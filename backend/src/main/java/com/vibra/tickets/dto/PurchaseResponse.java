package com.vibra.tickets.dto;

import com.vibra.tickets.entity.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class PurchaseResponse {
    private UUID ticketId;
    private TicketStatus status;
    private BigDecimal amount;
    private String paymentMethod;
    
    // Campos para PIX
    private String qrCode;
    private String qrCodeBase64;
    
    // Campo para redirecionamento se necessário
    private String checkoutUrl;
}
