package com.vibra.events.controller;

import com.vibra.events.dto.*;
import com.vibra.events.entity.Event;
import com.vibra.events.service.EventService;
import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_PRODUCER')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User producer = userService.findUserByEmail(userDetails.getUsername());
        
        Event event = eventService.createEvent(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getThumbnailUrl(),
                request.getEventDate(),
                request.getLocation(),
                request.getLatitude(),
                request.getLongitude(),
                producer.getId(),
                request.getTicketTypes(),
                request.getLineup(),
                request.getExternalTicketLink()
        );

        return ResponseEntity.ok(mapToResponse(event));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {
        
        List<Event> events = eventService.findAllEvents();

        List<EventResponse> response = events.stream()
                .filter(e -> category == null || category.isEmpty() || category.equalsIgnoreCase(e.getCategory()))
                .filter(e -> search == null || search.isEmpty() || 
                        e.getTitle().toLowerCase().contains(search.toLowerCase()) || 
                        (e.getDescription() != null && e.getDescription().toLowerCase().contains(search.toLowerCase())))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        // Simulação simples de ordenação por proximidade se lat/lng fornecidos
        if (lat != null && lng != null) {
            response.sort((a, b) -> {
                double distA = Math.sqrt(Math.pow(a.getLatitude() - lat, 2) + Math.pow(a.getLongitude() - lng, 2));
                double distB = Math.sqrt(Math.pow(b.getLatitude() - lat, 2) + Math.pow(b.getLongitude() - lng, 2));
                return Double.compare(distA, distB);
            });
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(List.of(
            "Festa Noturna", 
            "São João | Forró", 
            "Futebol", 
            "Esportes", 
            "Cultural", 
            "Outros"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable java.util.UUID id) {
        Event event = eventService.findEventById(id);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<EventResponse> getEventBySlug(@PathVariable String slug) {
        Event event = eventService.findBySlug(slug);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @GetMapping("/producer")
    @PreAuthorize("hasAuthority('ROLE_PRODUCER')")
    public ResponseEntity<List<EventResponse>> getProducerEvents(@AuthenticationPrincipal UserDetails userDetails) {
        User producer = userService.findUserByEmail(userDetails.getUsername());
        List<Event> events = eventService.findEventsByProducer(producer.getId());
        
        List<EventResponse> response = events.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_PRODUCER')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody EventRequest request) {
        Event event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(mapToResponse(event));
    }

    private EventResponse mapToResponse(Event event) {
        List<TicketTypeResponse> ttResponses = event.getTicketTypes() == null ? null :
                event.getTicketTypes().stream()
                        .map(tt -> TicketTypeResponse.builder()
                                .id(tt.getId())
                                .name(tt.getName())
                                .price(tt.getPrice())
                                .capacity(tt.getCapacity())
                                .batches(tt.getBatches() == null ? null :
                                        tt.getBatches().stream()
                                                .map(b -> TicketBatchResponse.builder()
                                                        .id(b.getId())
                                                        .batchName(b.getBatchName())
                                                        .price(b.getPrice())
                                                        .capacity(b.getCapacity())
                                                        .startDate(b.getStartDate())
                                                        .endDate(b.getEndDate())
                                                        .batchOrder(b.getBatchOrder())
                                                        .build())
                                                .collect(Collectors.toList()))
                                .build())
                        .collect(Collectors.toList());

        List<LineupItemResponse> luResponses = event.getLineup() == null ? null :
                event.getLineup().stream()
                        .map(lu -> LineupItemResponse.builder()
                                .id(lu.getId())
                                .artistName(lu.getArtistName())
                                .artistImageUrl(lu.getArtistImageUrl())
                                .build())
                        .collect(Collectors.toList());

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .thumbnailUrl(event.getThumbnailUrl())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .externalTicketLink(event.getExternalTicketLink())
                .latitude(event.getLatitude())
                .longitude(event.getLongitude())
                .producerId(event.getProducerId())
                .ticketTypes(ttResponses)
                .lineup(luResponses)
                .build();
    }
}
