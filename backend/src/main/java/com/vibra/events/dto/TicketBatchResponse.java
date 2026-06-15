package com.vibra.events.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class TicketBatchResponse {
    private UUID id;
    private String batchName;
    private BigDecimal price;
    private Integer capacity;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private Integer batchOrder;
}
