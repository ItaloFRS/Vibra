package com.vibra.social.websocket;

import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import com.vibra.social.dto.OnlineUsersResponse;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PresenceEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    
    private final Map<String, Set<OnlineUserDTO>> channelParticipants = new ConcurrentHashMap<>();
    private final Map<String, SubscriptionInfo> sessionSubscriptions = new ConcurrentHashMap<>();

    public PresenceEventListener(SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        String sessionId = accessor.getSessionId();
        String userEmail = accessor.getUser() != null ? accessor.getUser().getName() : null;

        if (destination != null && destination.startsWith("/topic/channels/") && userEmail != null) {
            String channelId = destination.replace("/topic/channels/", "");
            
            User user = userService.findUserByEmail(userEmail);
            OnlineUserDTO onlineUser = new OnlineUserDTO(user.getId(), user.getFullName(), user.getProfilePhotoUrl());

            channelParticipants.computeIfAbsent(channelId, k -> Collections.synchronizedSet(new HashSet<>())).add(onlineUser);
            sessionSubscriptions.put(sessionId, new SubscriptionInfo(channelId, onlineUser));

            broadcastPresence(channelId);
        }
    }

    @EventListener
    public void handleUnsubscribe(SessionUnsubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        removeUser(accessor.getSessionId());
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        removeUser(event.getSessionId());
    }

    private void removeUser(String sessionId) {
        if (sessionId == null) return;
        SubscriptionInfo info = sessionSubscriptions.remove(sessionId);
        if (info != null) {
            Set<OnlineUserDTO> participants = channelParticipants.get(info.channelId);
            if (participants != null) {
                participants.remove(info.onlineUser);
                broadcastPresence(info.channelId);
            }
        }
    }

    private void broadcastPresence(String channelId) {
        Set<OnlineUserDTO> participants = channelParticipants.getOrDefault(channelId, Collections.emptySet());
        messagingTemplate.convertAndSend("/topic/channels/" + channelId + "/presence", new OnlineUsersResponse(participants));
    }

    public record OnlineUserDTO(UUID id, String fullName, String photoUrl) {}
    private record SubscriptionInfo(String channelId, OnlineUserDTO onlineUser) {}
}
