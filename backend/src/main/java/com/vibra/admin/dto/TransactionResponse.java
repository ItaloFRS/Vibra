package com.vibra.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionResponse {
    private UUID ticketId;
    private String eventTitle;
    private ZonedDateTime purchaseDate;
    private BigDecimal grossAmount;
    private BigDecimal feeAmount;
    private BigDecimal netAmount;
    private String status; // PAID, REFUNDED, etc.
}
