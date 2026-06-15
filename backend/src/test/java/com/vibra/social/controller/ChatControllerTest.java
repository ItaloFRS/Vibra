package com.vibra.social.controller;

import com.vibra.identity.entity.User;
import com.vibra.social.dto.ChatMessageRequest;
import com.vibra.social.entity.Message;
import com.vibra.social.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ChatControllerTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private MessageService messageService;

    @InjectMocks
    private ChatController chatController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldBroadcastAndSaveMessageToEventChannel() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID senderId = UUID.randomUUID();
        ChatMessageRequest request = new ChatMessageRequest();
        request.setEventId(eventId);
        request.setSenderId(senderId);
        request.setContent("Hello community!");
        
        Message savedMessage = Message.builder()
                .id(UUID.randomUUID())
                .content("Hello community!")
                .sender(User.builder().id(senderId).fullName("Sender").build())
                .build();
                
        when(messageService.saveMessage(any(), any(), any(), any(), any(), anyBoolean())).thenReturn(savedMessage);

        // Act
        chatController.sendMessageToEvent(eventId, request);

        // Assert
        verify(messageService, times(1)).saveMessage(eventId, null, senderId, null, "Hello community!", false);
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/event/" + eventId), any(Message.class));
    }
}
