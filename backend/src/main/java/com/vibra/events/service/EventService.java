package com.vibra.events.service;

import com.vibra.events.dto.LineupItemRequest;
import com.vibra.events.dto.TicketBatchRequest;
import com.vibra.events.dto.TicketTypeRequest;
import com.vibra.events.entity.Event;
import com.vibra.events.entity.LineupItem;
import com.vibra.events.entity.TicketBatch;
import com.vibra.events.entity.TicketType;
import com.vibra.events.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Event createEvent(String title, String description, String category, String thumbnailUrl, 
                              ZonedDateTime eventDate, String location, 
                              Double latitude, Double longitude,
                              UUID producerId,
                              List<TicketTypeRequest> ticketTypeRequests,
                              List<LineupItemRequest> lineupItemRequests,
                              String externalTicketLink) {
        String slug = generateSlug(title);
        
        Event event = Event.builder()
                .title(title)
                .slug(slug)
                .description(description)
                .category(category)
                .thumbnailUrl(thumbnailUrl)
                .eventDate(eventDate)
                .location(location)
                .latitude(latitude)
                .longitude(longitude)
                .producerId(producerId)
                .externalTicketLink(externalTicketLink)
                .ticketTypes(new ArrayList<>())
                .lineup(new ArrayList<>())
                .build();

        ZonedDateTime now = ZonedDateTime.now();

        if (ticketTypeRequests != null) {
            for (TicketTypeRequest ttReq : ticketTypeRequests) {
                TicketType ticketType = TicketType.builder()
                        .name(ttReq.getName())
                        .event(event)
                        .batches(new ArrayList<>())
                        .build();

                // Lógica de Lotes
                if (ttReq.getBatches() == null || ttReq.getBatches().isEmpty()) {
                    // Preço Fixo / Lote Único
                    TicketBatch batch = TicketBatch.builder()
                            .batchName("Lote Único")
                            .price(ttReq.getPrice())
                            .capacity(ttReq.getCapacity())
                            .startDate(now)
                            .endDate(eventDate)
                            .batchOrder(1)
                            .ticketType(ticketType)
                            .build();
                    
                    ticketType.getBatches().add(batch);
                    ticketType.setPrice(ttReq.getPrice());
                    ticketType.setCapacity(ttReq.getCapacity());
                } else {
                    // Múltiplos Lotes
                    int numBatches = Math.min(ttReq.getBatches().size(), 4);
                    Duration totalDuration = Duration.between(now, eventDate);
                    Duration batchDuration = totalDuration.dividedBy(numBatches);

                    int totalCapacity = 0;
                    for (int i = 0; i < numBatches; i++) {
                        TicketBatchRequest bReq = ttReq.getBatches().get(i);
                        ZonedDateTime start = now.plus(batchDuration.multipliedBy(i));
                        ZonedDateTime end = (i == numBatches - 1) ? eventDate : now.plus(batchDuration.multipliedBy(i + 1));

                        TicketBatch batch = TicketBatch.builder()
                                .batchName(bReq.getBatchName() != null ? bReq.getBatchName() : (i + 1) + "º Lote")
                                .price(bReq.getPrice())
                                .capacity(bReq.getCapacity())
                                .startDate(bReq.getStartDate() != null ? bReq.getStartDate() : start)
                                .endDate(bReq.getEndDate() != null ? bReq.getEndDate() : end)
                                .batchOrder(i + 1)
                                .ticketType(ticketType)
                                .build();
                        
                        ticketType.getBatches().add(batch);
                        totalCapacity += bReq.getCapacity();

                        // Seta o preço do 1º lote como o preço inicial do ticket type
                        if (i == 0) ticketType.setPrice(bReq.getPrice());
                    }
                    ticketType.setCapacity(totalCapacity);
                }

                event.getTicketTypes().add(ticketType);
            }
        }

        if (lineupItemRequests != null) {
            for (LineupItemRequest luReq : lineupItemRequests) {
                LineupItem lineupItem = LineupItem.builder()
                        .artistName(luReq.getArtistName())
                        .artistImageUrl(luReq.getArtistImageUrl())
                        .event(event)
                        .build();
                event.getLineup().add(lineupItem);
            }
        }
        
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(UUID id, com.vibra.events.dto.EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getCategory() != null) event.setCategory(request.getCategory());
        if (request.getThumbnailUrl() != null) event.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getEventDate() != null) event.setEventDate(request.getEventDate());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getLatitude() != null) event.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) event.setLongitude(request.getLongitude());
        if (request.getExternalTicketLink() != null) event.setExternalTicketLink(request.getExternalTicketLink());

        // Atualizar Lineup (Substituição simples para MVP)
        if (request.getLineup() != null) {
            event.getLineup().clear();
            for (com.vibra.events.dto.LineupItemRequest luReq : request.getLineup()) {
                LineupItem lineupItem = LineupItem.builder()
                        .artistName(luReq.getArtistName())
                        .artistImageUrl(luReq.getArtistImageUrl())
                        .event(event)
                        .build();
                event.getLineup().add(lineupItem);
            }
        }

        return eventRepository.save(event);
    }

    public List<Event> findAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc();
    }

    public Event findEventById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
    }

    public List<Event> findEventsByProducer(UUID producerId) {
        return eventRepository.findByProducerId(producerId);
    }

    public Event findBySlug(String slug) {
        return eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado pelo slug: " + slug));
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }
}
