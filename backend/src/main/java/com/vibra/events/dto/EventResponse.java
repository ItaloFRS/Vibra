package com.vibra.events.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class EventResponse {
    private UUID id;
    private String title;
    private String slug;
    private String description;
    private String category;
    private String thumbnailUrl;
    private ZonedDateTime eventDate;
    private String location;
    private String externalTicketLink;
    private Double latitude;
    private Double longitude;
    private UUID producerId;
    private List<TicketTypeResponse> ticketTypes;
    private List<LineupItemResponse> lineup;
}
