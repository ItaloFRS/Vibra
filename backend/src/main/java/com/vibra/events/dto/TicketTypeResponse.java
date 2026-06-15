package com.vibra.events.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TicketTypeResponse {
    private UUID id;
    private String name;
    private BigDecimal price;
    private Integer capacity;
    private List<TicketBatchResponse> batches;
}
