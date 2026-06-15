package com.vibra.events.service;

import com.vibra.events.entity.Event;
import com.vibra.events.repository.EventRepository;
import com.vibra.identity.entity.User;
import com.vibra.identity.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateNewEvent() {
        // Arrange
        User producer = User.builder()
                .id(UUID.randomUUID())
                .role(UserRole.ROLE_PRODUCER)
                .build();
        
        Event event = Event.builder()
                .title("Test Event")
                .eventDate(ZonedDateTime.now().plusDays(1))
                .producerId(producer.getId())
                .build();

        when(eventRepository.save(any(Event.class))).thenReturn(event);

        // Act
        Event createdEvent = eventService.createEvent("Test Event", "Description", null, null, 
                                                     event.getEventDate(), "Location", 
                                                     null, null,
                                                     producer.getId(), null, null, "http://external.link");

        // Assert
        assertNotNull(createdEvent);
        assertEquals("Test Event", createdEvent.getTitle());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void shouldUpdateEventWithExternalLink() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        Event existingEvent = Event.builder()
                .id(eventId)
                .title("Old Title")
                .build();

        com.vibra.events.dto.EventRequest request = new com.vibra.events.dto.EventRequest();
        request.setTitle("New Title");
        request.setExternalTicketLink("http://new.link");

        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.of(existingEvent));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Event updatedEvent = eventService.updateEvent(eventId, request);

        // Assert
        assertEquals("New Title", updatedEvent.getTitle());
        assertEquals("http://new.link", updatedEvent.getExternalTicketLink());
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void shouldListAllEvents() {
        // Arrange
        when(eventRepository.findAll()).thenReturn(Arrays.asList(new Event(), new Event()));

        // Act
        List<Event> events = eventService.findAllEvents();

        // Assert
        assertEquals(2, events.size());
        verify(eventRepository, times(1)).findAll();
    }
}
