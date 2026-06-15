package com.vibra.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class TicketTypeRequest {
    @NotBlank
    private String name;

    private BigDecimal price; // Opcional se houver lotes

    private Integer capacity; // Opcional se houver lotes

    private List<TicketBatchRequest> batches;
}
