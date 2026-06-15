package com.vibra.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchUpdateRequest {
    private BigDecimal price;
    private Integer capacity;
    private ZonedDateTime endDate;
}
