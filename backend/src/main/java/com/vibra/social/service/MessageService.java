package com.vibra.social.service;

import com.vibra.events.entity.Event;
import com.vibra.events.repository.EventRepository;
import com.vibra.identity.entity.User;
import com.vibra.identity.repository.UserRepository;
import com.vibra.social.entity.ChatChannel;
import com.vibra.social.entity.ChatRequest;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Message;
import com.vibra.social.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final ChatChannelRepository channelRepository;
    private final ChatRequestRepository chatRequestRepository;

    public MessageService(MessageRepository messageRepository, EventRepository eventRepository,
                          UserRepository userRepository, MatchRepository matchRepository,
                          ChatChannelRepository channelRepository, ChatRequestRepository chatRequestRepository) {
        this.messageRepository = messageRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.channelRepository = channelRepository;
        this.chatRequestRepository = chatRequestRepository;
    }

    @Transactional
    public Message saveMessage(UUID eventId, UUID channelId, UUID senderId, UUID matchId, String content, boolean isSystem) {
        System.out.println("VIBRA DEBUG: Attempting to save message. MatchId/ConnectionId: " + matchId);
        
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        Match match = null;
        Event event = null;
        ChatRequest chatRequest = null;

        if (matchId != null) {
            Optional<Match> matchOpt = matchRepository.findById(matchId);
            if (matchOpt.isPresent()) {
                match = matchOpt.get();
                event = match.getEvent();
                System.out.println("VIBRA DEBUG: Identified as Match message.");
            } else {
                Optional<ChatRequest> requestOpt = chatRequestRepository.findById(matchId);
                if (requestOpt.isPresent()) {
                    chatRequest = requestOpt.get();
                    System.out.println("VIBRA DEBUG: Identified as ChatRequest message. Status: " + chatRequest.getStatus());
                } else {
                    System.out.println("VIBRA DEBUG: Error - matchId " + matchId + " not found in Match OR ChatRequest repositories.");
                    throw new RuntimeException("Connection not found (Neither Match nor Request)");
                }
            }
        } else if (eventId != null) {
            event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            System.out.println("VIBRA DEBUG: Identified as Event/Channel message.");
        } else {
            throw new RuntimeException("Connection context must be provided");
        }
        
        ChatChannel channel = null;
        if (channelId != null) {
            channel = channelRepository.findById(channelId)
                    .orElseThrow(() -> new RuntimeException("Channel not found"));
        }

        Message message = Message.builder()
                .event(event)
                .channel(channel)
                .sender(sender)
                .match(match)
                .chatRequest(chatRequest)
                .content(content)
                .isSystem(isSystem)
                .build();

        Message saved = messageRepository.save(message);
        System.out.println("VIBRA DEBUG: Message saved successfully with ID: " + saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Message> getDirectHistory(UUID connectionId) {
        // Tenta buscar por Match
        Optional<Match> matchOpt = matchRepository.findById(connectionId);
        if (matchOpt.isPresent()) {
            return messageRepository.findByMatchOrderByCreatedAtAsc(matchOpt.get());
        }
        
        // Se não for match, busca por ChatRequest
        ChatRequest chatRequest = chatRequestRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        return messageRepository.findByChatRequestOrderByCreatedAtAsc(chatRequest);
    }

    @Transactional(readOnly = true)
    public List<Message> getChatHistory(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return messageRepository.findByEventAndChannelIsNullOrderByCreatedAtAsc(event);
    }

    @Transactional(readOnly = true)
    public List<Message> getChannelHistory(UUID channelId) {
        ChatChannel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));
        return messageRepository.findByChannelOrderByCreatedAtAsc(channel);
    }

    @Transactional
    public void markChannelMessagesAsRead(UUID channelId, UUID userId) {
        ChatChannel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));
        List<Message> unread = messageRepository.findByChannelAndSenderIdNotAndReadAtIsNull(channel, userId);
        unread.forEach(msg -> msg.setReadAt(ZonedDateTime.now()));
        messageRepository.saveAll(unread);
    }

    @Transactional
    public void markDirectMessagesAsRead(UUID connectionId, UUID userId) {
        // Tenta por Match
        Optional<Match> matchOpt = matchRepository.findById(connectionId);
        if (matchOpt.isPresent()) {
            List<Message> unread = messageRepository.findByMatchAndSenderIdNotAndReadAtIsNull(matchOpt.get(), userId);
            unread.forEach(msg -> msg.setReadAt(ZonedDateTime.now()));
            messageRepository.saveAll(unread);
            return;
        }

        // Tenta por ChatRequest
        Optional<ChatRequest> requestOpt = chatRequestRepository.findById(connectionId);
        if (requestOpt.isPresent()) {
            List<Message> unread = messageRepository.findByChatRequestAndSenderIdNotAndReadAtIsNull(requestOpt.get(), userId);
            unread.forEach(msg -> msg.setReadAt(ZonedDateTime.now()));
            messageRepository.saveAll(unread);
        }
    }

    @Transactional(readOnly = true)
    public long getTotalUnreadChatsCount(UUID userId) {
        long directUnread = messageRepository.countUnreadDirectChatsForUser(userId);
        // Aplica filtro de 5 dias na contagem global para manter consistência
        long channelUnread = messageRepository.countUnreadChannelChatsForUser(userId, ZonedDateTime.now().minusDays(5));
        return directUnread + channelUnread;
    }
}
