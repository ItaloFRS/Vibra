package com.vibra.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardSummaryResponse {
    private BigDecimal totalRevenue;
    private long totalTicketsSold;
    private long activeEventsCount;
    private double avgEngagementRate;
    
    // Variações percentuais (opcional para o dashboard)
    private double revenueGrowth;
    private double ticketsGrowth;
}
