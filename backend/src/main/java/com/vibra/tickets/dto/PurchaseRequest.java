package com.vibra.tickets.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PurchaseRequest {
    @NotNull
    private UUID ticketTypeId;

    @NotNull
    private PaymentRequest payment;
}
