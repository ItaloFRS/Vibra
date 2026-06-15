package com.vibra.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TicketImportResponse {
    private boolean success;
    private int pagesProcessed;
    private List<QrCodeData> qrCodes;
    
    // Dados do evento (Mockados por enquanto, mas na versão final podem vir de um BD)
    private String eventTitle;
    private String eventDate;
    private String location;
    private String type;

    @Data
    @Builder
    public static class QrCodeData {
        private int page;
        private String content;
        private String image; // Base64
    }
}
