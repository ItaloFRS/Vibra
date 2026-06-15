package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.events.repository.EventRepository;
import com.vibra.social.entity.ChatChannel;
import com.vibra.social.repository.ChatChannelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChannelService {

    private final ChatChannelRepository channelRepository;
    private final EventRepository eventRepository;

    public ChannelService(ChatChannelRepository channelRepository, EventRepository eventRepository) {
        this.channelRepository = channelRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public ChatChannel createChannel(UUID eventId, String name, String description) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        ChatChannel channel = ChatChannel.builder()
                .name(name)
                .description(description)
                .event(event)
                .build();

        return channelRepository.save(channel);
    }

    public List<ChatChannel> getChannelsByEvent(UUID eventId) {
        return channelRepository.findByEventId(eventId);
    }
}
