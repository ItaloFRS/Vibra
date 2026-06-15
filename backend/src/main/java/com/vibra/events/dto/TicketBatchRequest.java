package com.vibra.events.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
public class TicketBatchRequest {
    private String batchName; // Opcional, o backend pode gerar
    private BigDecimal price;
    private Integer capacity;
    private ZonedDateTime startDate; // Opcional, pode ser calculado
    private ZonedDateTime endDate; // Opcional, pode ser calculado
}
