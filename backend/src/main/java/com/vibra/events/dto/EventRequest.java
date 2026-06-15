package com.vibra.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;

@Data
public class EventRequest {
    @NotBlank
    private String title;

    private String description;

    private String category;

    private String thumbnailUrl;

    @NotNull
    private ZonedDateTime eventDate;

    private String location;

    private String externalTicketLink;

    private Double latitude;
    private Double longitude;

    private List<TicketTypeRequest> ticketTypes;

    private List<LineupItemRequest> lineup;
}
