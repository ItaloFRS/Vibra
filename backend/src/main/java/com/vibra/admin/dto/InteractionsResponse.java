package com.vibra.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionsResponse {
    private List<HourlyInteraction> peakHours;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HourlyInteraction {
        private Integer hour;
        private Long messageCount;
    }
}
