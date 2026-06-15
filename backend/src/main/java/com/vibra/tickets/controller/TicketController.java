package com.vibra.tickets.controller;

import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import com.vibra.tickets.dto.PurchaseRequest;
import com.vibra.tickets.dto.PurchaseResponse;
import com.vibra.tickets.dto.TicketSummaryResponse;
import com.vibra.tickets.service.TicketAnalysisService;
import com.vibra.tickets.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.vibra.tickets.dto.TicketImportResponse;
import org.springframework.web.multipart.MultipartFile;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.UUID;

import com.vibra.tickets.service.QrExtractionService;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/tickets")
@Slf4j
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;
    private final QrExtractionService qrExtractionService;
    private final TicketAnalysisService ticketAnalysisService;

    public TicketController(TicketService ticketService, UserService userService, QrExtractionService qrExtractionService, TicketAnalysisService ticketAnalysisService) {
        this.ticketService = ticketService;
        this.userService = userService;
        this.qrExtractionService = qrExtractionService;
        this.ticketAnalysisService = ticketAnalysisService;
    }

    @PostMapping("/import")
    public ResponseEntity<TicketImportResponse> importTicket(@RequestParam("file") MultipartFile file) {
        log.info("Received ticket import request: {}", file.getOriginalFilename());
        try {
            List<QrExtractionService.QrExtractionResult> extractedQrs = qrExtractionService.extractQrCodes(file);
            String fullText = qrExtractionService.extractFullText(file);
            
            String imageBase64 = null;
            // Se for imagem, vamos converter para base64 para mandar pro Gemini fazer OCR visual
            if (!file.getContentType().equalsIgnoreCase("application/pdf")) {
                byte[] bytes = file.getBytes();
                String mimeType = file.getContentType();
                imageBase64 = "data:" + mimeType + ";base64," + java.util.Base64.getEncoder().encodeToString(bytes);
            } else if (!extractedQrs.isEmpty()) {
                // Se for PDF mas achamos um QR, mandamos o recorte do QR como imagem de contexto
                imageBase64 = extractedQrs.get(0).base64Image;
            }

            log.info("Extracted {} QR codes. Text length: {}. Has Image: {}", extractedQrs.size(), fullText.length(), (imageBase64 != null));

            Map<String, String> aiData = ticketAnalysisService.analyzeTicket(fullText, imageBase64);
            
            boolean success = !extractedQrs.isEmpty() || !aiData.get("eventTitle").equals("Não identificado");
            List<TicketImportResponse.QrCodeData> qrCodes = extractedQrs.stream().map(qr -> 
                TicketImportResponse.QrCodeData.builder()
                        .page(qr.page)
                        .content(qr.content)
                        .image(qr.base64Image)
                        .build()
            ).collect(Collectors.toList());

            TicketImportResponse response = TicketImportResponse.builder()
                    .success(success)
                    .pagesProcessed(1)
                    .qrCodes(qrCodes)
                    .eventTitle(aiData.get("eventTitle"))
                    .eventDate(aiData.get("eventDate"))
                    .location(aiData.get("location"))
                    .type(aiData.get("ticketType"))
                    .build();

            log.info("Import process finished for: {}", response.getEventTitle());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Critical error in importTicket: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketSummaryResponse>> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ticketService.getUserTickets(user.getId()));
    }

    @PostMapping("/purchase")
    public ResponseEntity<PurchaseResponse> purchase(@Valid @RequestBody PurchaseRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        PurchaseResponse response = ticketService.buyTicket(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    // Webhook para notificações do Mercado Pago
    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestParam(name = "data.id", required = false) String dataId,
                                              @RequestParam(name = "type", required = false) String type) {
        
        // No Mercado Pago, o tipo de notificação que nos interessa é "payment"
        if ("payment".equalsIgnoreCase(type) && dataId != null) {
            ticketService.processPaymentUpdate(Long.parseLong(dataId));
        }

        // Devemos sempre retornar 200 ou 201 para o Mercado Pago não tentar reenviar
        return ResponseEntity.ok().build();
    }
}
