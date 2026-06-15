package com.vibra.tickets.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class TicketSummaryResponse {
    private UUID ticketId;
    private String eventTitle;
    private String thumbnailUrl;
    private ZonedDateTime eventDate;
    private String status;
}
