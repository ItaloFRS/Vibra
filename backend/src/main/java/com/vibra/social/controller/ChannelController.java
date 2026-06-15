package com.vibra.social.controller;

import com.vibra.social.dto.ChannelRequest;
import com.vibra.social.dto.ChannelResponse;
import com.vibra.social.entity.ChatChannel;
import com.vibra.social.service.ChannelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/social/events/{eventId}/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_PRODUCER')")
    public ResponseEntity<ChannelResponse> createChannel(
            @PathVariable UUID eventId,
            @Valid @RequestBody ChannelRequest request) {
        
        ChatChannel channel = channelService.createChannel(eventId, request.getName(), request.getDescription());
        
        return ResponseEntity.ok(ChannelResponse.builder()
                .id(channel.getId())
                .name(channel.getName())
                .description(channel.getDescription())
                .build());
    }

    @GetMapping
    public ResponseEntity<List<ChannelResponse>> getChannels(@PathVariable UUID eventId) {
        List<ChannelResponse> channels = channelService.getChannelsByEvent(eventId)
                .stream()
                .map(c -> ChannelResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .description(c.getDescription())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(channels);
    }
}
