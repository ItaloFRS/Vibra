package com.vibra.social.controller;

import com.vibra.social.dto.ChatMessageRequest;
import com.vibra.social.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    public ChatController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/chat/event/{eventId}")
    public void sendMessageToEvent(@DestinationVariable UUID eventId, @Payload ChatMessageRequest request) {
        if ("TYPING".equals(request.getType()) || "READ_RECEIPT".equals(request.getType())) {
            messagingTemplate.convertAndSend("/topic/event/" + eventId, request);
            return;
        }

        var savedMessage = messageService.saveMessage(
                eventId,
                null,
                request.getSenderId(),
                request.getMatchId(),
                request.getContent(),
                request.isSystem()
        );
        messagingTemplate.convertAndSend("/topic/event/" + eventId, mapToResponse(savedMessage));
    }

    @MessageMapping("/chat/channels/{channelId}")
    public void sendMessageToChannel(@DestinationVariable UUID channelId, @Payload ChatMessageRequest request) {
        if ("READ_RECEIPT".equals(request.getType())) {
            messageService.markChannelMessagesAsRead(channelId, request.getSenderId());
            messagingTemplate.convertAndSend("/topic/channels/" + channelId, request);
            return;
        }

        if ("TYPING".equals(request.getType())) {
            messagingTemplate.convertAndSend("/topic/channels/" + channelId, request);
            return;
        }

        var savedMessage = messageService.saveMessage(
                request.getEventId(),
                channelId,
                request.getSenderId(),
                null,
                request.getContent(),
                request.isSystem()
        );
        messagingTemplate.convertAndSend("/topic/channels/" + channelId, mapToResponse(savedMessage));
    }

    @MessageMapping("/chat/directs/{matchId}")
    public void sendMessageToDirect(@DestinationVariable UUID matchId, @Payload ChatMessageRequest request) {
        if ("READ_RECEIPT".equals(request.getType())) {
            messageService.markDirectMessagesAsRead(matchId, request.getSenderId());
            messagingTemplate.convertAndSend("/topic/directs/" + matchId, request);
            return;
        }

        if ("TYPING".equals(request.getType())) {
            messagingTemplate.convertAndSend("/topic/directs/" + matchId, request);
            return;
        }

        var savedMessage = messageService.saveMessage(
                null,
                null,
                request.getSenderId(),
                matchId,
                request.getContent(),
                request.isSystem()
        );
        messagingTemplate.convertAndSend("/topic/directs/" + matchId, mapToResponse(savedMessage));
    }

    private com.vibra.social.dto.ChatMessageResponse mapToResponse(com.vibra.social.entity.Message msg) {
        return com.vibra.social.dto.ChatMessageResponse.builder()
                .messageId(msg.getId())
                .eventId(msg.getEvent() != null ? msg.getEvent().getId() : null)
                .channelId(msg.getChannel() != null ? msg.getChannel().getId() : null)
                .matchId(msg.getMatch() != null ? msg.getMatch().getId() : (msg.getChatRequest() != null ? msg.getChatRequest().getId() : null))
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getFullName())
                .senderPhotoUrl(msg.getSender().getProfilePhotoUrl())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .isSystem(msg.isSystem())
                .build();
    }
}
