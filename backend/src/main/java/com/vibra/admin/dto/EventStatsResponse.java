package com.vibra.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class EventStatsResponse {
    private String eventTitle;
    private java.time.ZonedDateTime eventDate;
    private String location;
    private long totalTickets;
    private long soldTickets;
    private BigDecimal revenue;
    private double soldPercentage;
    
    // Novas métricas sociais
    private long matchesCount;
    private long messagesCount;
    private long interestCount;
    private double conversionRate;
    
    // Vendas por lote para o gráfico
    private List<BatchStat> salesByBatch;
    
    // Dados para o gráfico de linha (Data -> Quantidade)
    private Map<String, Long> salesOverTime;

    @Data
    @Builder
    public static class BatchStat {
        private java.util.UUID id;
        private String batchName;
        private long sold;
        private long capacity;
        private double percentage;
        private java.time.ZonedDateTime startDate;
        private java.time.ZonedDateTime endDate;
    }
}
