package com.vibra.tickets.service;

import com.mercadopago.resources.payment.Payment;
import com.vibra.events.entity.Event;
import com.vibra.events.entity.TicketBatch;
import com.vibra.events.entity.TicketType;
import com.vibra.events.repository.EventRepository;
import com.vibra.events.repository.TicketTypeRepository;
import com.vibra.tickets.dto.PurchaseRequest;
import com.vibra.tickets.dto.PurchaseResponse;
import com.vibra.tickets.dto.TicketSummaryResponse;
import com.vibra.tickets.entity.Ticket;
import com.vibra.tickets.entity.TicketStatus;
import com.vibra.tickets.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final EventRepository eventRepository;
    private final BatchSelectionService batchSelectionService;
    private final MercadoPagoService mercadoPagoService;

    public TicketService(TicketRepository ticketRepository, 
                         TicketTypeRepository ticketTypeRepository, 
                         EventRepository eventRepository,
                         BatchSelectionService batchSelectionService, 
                         MercadoPagoService mercadoPagoService) {
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.eventRepository = eventRepository;
        this.batchSelectionService = batchSelectionService;
        this.mercadoPagoService = mercadoPagoService;
    }

    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getUserTickets(UUID userId) {
        return ticketRepository.findByUserId(userId).stream()
                .filter(t -> t.getStatus() == TicketStatus.PAID)
                .map(t -> {
                    Event event = eventRepository.findById(t.getEventId()).orElse(null);
                    return TicketSummaryResponse.builder()
                            .ticketId(t.getId())
                            .eventTitle(event != null ? event.getTitle() : "Evento Desconhecido")
                            .thumbnailUrl(event != null ? event.getThumbnailUrl() : null)
                            .eventDate(event != null ? event.getEventDate() : null)
                            .status(t.getStatus().name())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public PurchaseResponse buyTicket(UUID userId, PurchaseRequest request) {
        TicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                .orElseThrow(() -> new RuntimeException("Tipo de ingresso não encontrado"));

        TicketBatch activeBatch = batchSelectionService.findActiveBatch(ticketType)
                .orElseThrow(() -> new RuntimeException("Nenhum lote disponível para este ingresso"));

        Ticket ticket = Ticket.builder()
                .userId(userId)
                .eventId(ticketType.getEvent().getId())
                .ticketBatchId(activeBatch.getId())
                .status(TicketStatus.PENDING)
                .pricePaid(activeBatch.getPrice())
                .build();

        ticket = ticketRepository.save(ticket);

        Payment payment = mercadoPagoService.processPayment(
                ticket.getId(), 
                ticketType.getEvent().getTitle(), 
                activeBatch.getPrice(), 
                request.getPayment()
        );

        ticket.setExternalPaymentId(payment.getId().toString());
        
        String mpStatus = payment.getStatus();
        if ("approved".equalsIgnoreCase(mpStatus)) {
            ticket.setStatus(TicketStatus.PAID);
        } else if ("rejected".equalsIgnoreCase(mpStatus) || "cancelled".equalsIgnoreCase(mpStatus)) {
            ticket.setStatus(TicketStatus.CANCELLED);
        }
        
        ticketRepository.save(ticket);

        PurchaseResponse.PurchaseResponseBuilder responseBuilder = PurchaseResponse.builder()
                .ticketId(ticket.getId())
                .status(ticket.getStatus())
                .amount(ticket.getPricePaid())
                .paymentMethod(payment.getPaymentMethodId());

        if (payment.getPointOfInteraction() != null && 
            payment.getPointOfInteraction().getTransactionData() != null) {
            
            var data = payment.getPointOfInteraction().getTransactionData();
            responseBuilder.qrCode(data.getQrCode());
            responseBuilder.qrCodeBase64(data.getQrCodeBase64());
        }

        return responseBuilder.build();
    }

    @Transactional
    public void processPaymentUpdate(Long externalPaymentId) {
        Payment payment = mercadoPagoService.getPaymentById(externalPaymentId);

        Ticket ticket = ticketRepository.findByExternalPaymentId(payment.getId().toString())
                .orElseThrow(() -> new RuntimeException("Ticket não encontrado para o pagamento: " + payment.getId()));

        String mpStatus = payment.getStatus();
        
        if ("approved".equalsIgnoreCase(mpStatus)) {
            ticket.setStatus(TicketStatus.PAID);
        } else if ("rejected".equalsIgnoreCase(mpStatus) || "cancelled".equalsIgnoreCase(mpStatus)) {
            ticket.setStatus(TicketStatus.CANCELLED);
        }

        ticketRepository.save(ticket);
    }
}
