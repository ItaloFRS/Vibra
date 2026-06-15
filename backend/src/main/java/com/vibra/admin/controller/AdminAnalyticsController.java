package com.vibra.admin.controller;

import com.vibra.admin.dto.ConversionsResponse;
import com.vibra.admin.dto.DemographicsResponse;
import com.vibra.admin.dto.InteractionsResponse;
import com.vibra.admin.service.AnalyticsService;
import com.vibra.events.entity.Event;
import com.vibra.events.repository.EventRepository;
import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/events/{eventId}/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PRODUCER')")
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;
    private final EventRepository eventRepository;
    private final UserService userService;

    @GetMapping("/demographics")
    public ResponseEntity<DemographicsResponse> getDemographics(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        validateOwnership(eventId, userDetails);
        return ResponseEntity.ok(analyticsService.getDemographics(eventId));
    }

    @GetMapping("/interactions")
    public ResponseEntity<InteractionsResponse> getInteractions(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        validateOwnership(eventId, userDetails);
        return ResponseEntity.ok(analyticsService.getInteractions(eventId));
    }

    @GetMapping("/conversions")
    public ResponseEntity<ConversionsResponse> getConversions(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        validateOwnership(eventId, userDetails);
        return ResponseEntity.ok(analyticsService.getConversions(eventId));
    }

    private void validateOwnership(UUID eventId, UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getProducerId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You are not the owner of this event");
        }
    }
}
