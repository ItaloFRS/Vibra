package com.vibra.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FinanceSummaryResponse {
    private BigDecimal totalBalance;      // Saldo Líquido Total (Disponível + A Receber)
    private BigDecimal availableBalance;  // Saldo de eventos já realizados
    private BigDecimal pendingBalance;    // Saldo de eventos futuros
    private BigDecimal totalGrossRevenue; // Receita Bruta Total (Sem descontar taxas)
    private BigDecimal totalPlatformFees; // Total de taxas retidas pela plataforma
}
