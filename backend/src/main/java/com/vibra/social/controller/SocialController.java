package com.vibra.social.controller;

import com.vibra.events.dto.EventResponse;
import com.vibra.events.dto.LineupItemResponse;
import com.vibra.events.dto.TicketTypeResponse;
import com.vibra.events.entity.Event;
import com.vibra.events.repository.EventRepository;
import com.vibra.identity.dto.UserResponse;
import com.vibra.identity.entity.User;
import com.vibra.identity.repository.UserRepository;
import com.vibra.identity.service.UserService;
import com.vibra.social.dto.ChatMessageResponse;
import com.vibra.social.dto.MatchResponse;
import com.vibra.social.dto.SwipeRequest;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Message;
import com.vibra.social.entity.UserEventInterest;
import com.vibra.social.repository.*;
import com.vibra.social.service.InterestService;
import com.vibra.social.service.MatchService;
import com.vibra.social.service.MessageService;
import com.vibra.social.service.SwipeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.vibra.social.dto.InterestResponse;

import com.vibra.social.dto.ChatRequestResponse;
import com.vibra.social.service.ChatRequestService;

import java.time.ZonedDateTime;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.vibra.social.dto.ChatSummaryResponse;

@RestController
@RequestMapping("/api/v1/social")
public class SocialController {

    private final SwipeService swipeService;
    private final MatchService matchService;
    private final MessageService messageService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final UserEventInterestRepository interestRepository;
    private final InterestService interestService;
    private final ChatRequestService chatRequestService;
    private final MessageRepository messageRepository;
    private final MutedChannelRepository mutedChannelRepository;
    private final ChatChannelRepository channelRepository;

    public SocialController(SwipeService swipeService, MatchService matchService, MessageService messageService,
                            UserService userService, UserRepository userRepository, EventRepository eventRepository,
                            UserEventInterestRepository interestRepository, InterestService interestService,
                            ChatRequestService chatRequestService,
                            MessageRepository messageRepository,
                            MutedChannelRepository mutedChannelRepository,
                            ChatChannelRepository channelRepository) {
        this.swipeService = swipeService;
        this.matchService = matchService;
        this.messageService = messageService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.interestRepository = interestRepository;
        this.interestService = interestService;
        this.chatRequestService = chatRequestService;
        this.messageRepository = messageRepository;
        this.mutedChannelRepository = mutedChannelRepository;
        this.channelRepository = channelRepository;
    }

    @PostMapping("/channels/{channelId}/toggle-mute")
    public ResponseEntity<Map<String, Boolean>> toggleMuteChannel(@PathVariable UUID channelId, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        com.vibra.social.entity.MutedChannel.MutedChannelId id = 
            new com.vibra.social.entity.MutedChannel.MutedChannelId(user.getId(), channelId);
        
        boolean currentlyMuted = mutedChannelRepository.existsById(id);
        
        if (currentlyMuted) {
            mutedChannelRepository.deleteById(id);
        } else {
            mutedChannelRepository.save(com.vibra.social.entity.MutedChannel.builder()
                .id(id)
                .build());
        }
        
        return ResponseEntity.ok(Map.of("muted", !currentlyMuted));
    }

    @GetMapping("/chats")
    public ResponseEntity<List<ChatSummaryResponse>> getChats(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        List<User> connectedUsers = chatRequestService.getConnectedUsers(currentUser.getId());
        
        List<ChatSummaryResponse> responses = connectedUsers.stream()
                .map(user -> {
                    UUID connectionId = chatRequestService.getMatchIdBetweenUsers(currentUser.getId(), user.getId());
                    
                    String lastMessage = "Inicie uma conversa!";
                    ZonedDateTime lastMessageAt = ZonedDateTime.now().minusYears(10); 
                    boolean unread = false;

                    if (connectionId != null) {
                        Optional<Message> msgOpt = messageRepository.findLastMessageByConnectionId(connectionId);
                        if (msgOpt.isPresent()) {
                            Message msg = msgOpt.get();
                            if (msg.getCreatedAt() != null) {
                                lastMessage = msg.getContent();
                                lastMessageAt = msg.getCreatedAt();
                            }
                        }
                        unread = messageRepository.hasUnreadMessagesInConnection(connectionId, currentUser.getId());
                    }

                    return ChatSummaryResponse.builder()
                            .userId(user.getId())
                            .userName(user.getFullName() != null ? user.getFullName() : "Usuário Vibra")
                            .userPhotoUrl(user.getProfilePhotoUrl())
                            .lastMessage(lastMessage)
                            .lastMessageAt(lastMessageAt)
                            .unread(unread)
                            .build();
                })
                .sorted((c1, c2) -> c2.getLastMessageAt().compareTo(c1.getLastMessageAt()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/chats/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        long directCount = messageRepository.countUnreadDirectChatsForUser(user.getId());
        // Aplica filtro de 5 dias na contagem global de canais
        long channelCount = messageRepository.countUnreadChannelChatsForUser(user.getId(), ZonedDateTime.now().minusDays(5));
        
        return ResponseEntity.ok(Map.of("unreadCount", directCount + channelCount));
    }

    @GetMapping("/communities")
    public ResponseEntity<List<Map<String, Object>>> getCommunities(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        List<UserEventInterest> interests = interestRepository.findByUserIdAndIsFavoriteTrue(user.getId());
        
        ZonedDateTime fiveDaysAgo = ZonedDateTime.now().minusDays(5);

        List<Map<String, Object>> responses = interests.stream()
            .filter(interest -> interest.getEvent().getEventDate().isAfter(fiveDaysAgo))
            .map(interest -> {
                Event event = interest.getEvent();
                List<com.vibra.social.entity.ChatChannel> channels = channelRepository.findByEventId(event.getId());
                
                List<Map<String, Object>> channelResponses = channels.stream()
                    .map(channel -> {
                        long unread = messageRepository.countByChannelAndSenderIdNotAndReadAtIsNull(channel, user.getId());
                        boolean muted = mutedChannelRepository.existsById(new com.vibra.social.entity.MutedChannel.MutedChannelId(user.getId(), channel.getId()));
                        
                        // Mock de ativos para interface (será real no websocket posterior)
                        long activeUsers = interestRepository.countByEventId(event.getId()); 

                        Map<String, Object> channelMap = new java.util.HashMap<>();
                        channelMap.put("id", channel.getId());
                        channelMap.put("name", channel.getName());
                        channelMap.put("unreadCount", unread);
                        channelMap.put("isMuted", muted);
                        channelMap.put("activeCount", activeUsers);
                        return channelMap;
                    }).collect(Collectors.toList());

                Map<String, Object> eventMap = new java.util.HashMap<>();
                eventMap.put("id", event.getId());
                eventMap.put("title", event.getTitle());
                eventMap.put("thumbnailUrl", event.getThumbnailUrl());
                eventMap.put("channels", channelResponses);
                
                return eventMap;
            })
            .filter(e -> !((List)e.get("channels")).isEmpty())
            .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/users/{id}/relationship")
    public ResponseEntity<Map<String, String>> getRelationship(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        String status = chatRequestService.getRelationshipStatus(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("status", status));
    }

    @GetMapping("/users/{id}/interests")
    public ResponseEntity<List<EventResponse>> getUserInterests(@PathVariable UUID id) {
        List<UserEventInterest> interests = interestRepository.findByUserIdAndIsFavoriteTrue(id);
        List<EventResponse> response = interests.stream()
                .map(interest -> mapToEventResponse(interest.getEvent()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests")
    public ResponseEntity<Void> sendRequest(@RequestBody Map<String, UUID> requestBody, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        chatRequestService.sendRequest(currentUser.getId(), requestBody.get("targetUserId"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<ChatRequestResponse>> getPendingRequests(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        List<ChatRequestResponse> responses = chatRequestService.getPendingRequests(currentUser.getId()).stream()
                .map(req -> ChatRequestResponse.builder()
                        .id(req.getId())
                        .senderId(req.getSender().getId())
                        .senderName(req.getSender().getFullName())
                        .senderPhotoUrl(req.getSender().getProfilePhotoUrl())
                        .status(req.getStatus().name())
                        .createdAt(req.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        chatRequestService.acceptRequest(id, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        chatRequestService.rejectRequest(id, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/chats/{targetUserId}")
    public ResponseEntity<Void> deleteChat(@PathVariable UUID targetUserId, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        chatRequestService.deleteChat(currentUser.getId(), targetUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{targetUserId}/match-id")
    public ResponseEntity<Map<String, UUID>> getMatchId(@PathVariable UUID targetUserId, @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userService.findUserByEmail(userDetails.getUsername());
        UUID matchId = chatRequestService.getMatchIdBetweenUsers(currentUser.getId(), targetUserId);
        return ResponseEntity.ok(Map.of("matchId", matchId != null ? matchId : UUID.fromString("00000000-0000-0000-0000-000000000000")));
    }

    @PostMapping("/events/{eventId}/favorite")
    public ResponseEntity<Void> toggleFavorite(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userService.findUserByEmail(userDetails.getUsername());
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        interestService.toggleFavorite(user, event);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/interests")
    public ResponseEntity<List<EventResponse>> getMyInterests(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        List<UserEventInterest> interests = interestRepository.findByUserIdAndIsFavoriteTrue(user.getId());
        
        List<EventResponse> response = interests.stream()
                .map(interest -> mapToEventResponse(interest.getEvent()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(response);
    }

    @PostMapping("/swipe")
    public ResponseEntity<MatchResponse> swipe(
            @Valid @RequestBody SwipeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User swiper = userService.findUserByEmail(userDetails.getUsername());
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User swiped = userRepository.findById(request.getSwipedUserId())
                .orElseThrow(() -> new RuntimeException("Swiped user not found"));

        swipeService.recordSwipe(event, swiper, swiped, request.getIsLike());

        if (request.getIsLike()) {
            List<Match> matches = matchService.getMatchesForUserInEvent(swiper, event);
            Optional<Match> latestMatch = matches.stream()
                    .filter(m -> m.getUser1().getId().equals(swiped.getId()) || m.getUser2().getId().equals(swiped.getId()))
                    .findFirst();

            if (latestMatch.isPresent()) {
                Match m = latestMatch.get();
                User matchedUser = m.getUser1().getId().equals(swiper.getId()) ? m.getUser2() : m.getUser1();
                return ResponseEntity.ok(MatchResponse.builder()
                        .matchId(m.getId())
                        .matchedUserId(matchedUser.getId())
                        .matchedUserName(matchedUser.getFullName())
                        .matchedUserPhotoUrl(matchedUser.getProfilePhotoUrl())
                        .matchedAt(m.getCreatedAt())
                        .build());
            }
        }

        return ResponseEntity.ok().build();
    }


    @GetMapping("/matches/count")
    public ResponseEntity<Long> getMatchCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(matchService.countAllMatchesForUser(user));
    }

    @GetMapping("/matches/{eventId}")
    public ResponseEntity<List<MatchResponse>> getMatches(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
            
        User user = userService.findUserByEmail(userDetails.getUsername());
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Match> matches = matchService.getMatchesForUserInEvent(user, event);

        List<MatchResponse> response = matches.stream().map(match -> {
            User matchedUser = match.getUser1().getId().equals(user.getId()) ? match.getUser2() : match.getUser1();
            return MatchResponse.builder()
                    .matchId(match.getId())
                    .matchedUserId(matchedUser.getId())
                    .matchedUserName(matchedUser.getFullName())
                    .matchedUserPhotoUrl(matchedUser.getProfilePhotoUrl())
                    .matchedAt(match.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody com.vibra.social.dto.ChatMessageRequest request) {
        Message saved = messageService.saveMessage(
                request.getEventId(),
                request.getChannelId(),
                request.getSenderId(),
                request.getMatchId(),
                request.getContent(),
                false
        );

        return ResponseEntity.ok(ChatMessageResponse.builder()
                .messageId(saved.getId())
                .eventId(saved.getEvent() != null ? saved.getEvent().getId() : null)
                .channelId(saved.getChannel() != null ? saved.getChannel().getId() : null)
                .senderId(saved.getSender().getId())
                .senderName(saved.getSender().getFullName())
                .senderPhotoUrl(saved.getSender().getProfilePhotoUrl())
                .matchId(saved.getMatch() != null ? saved.getMatch().getId() : (saved.getChatRequest() != null ? saved.getChatRequest().getId() : null))
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt())
                .isSystem(saved.isSystem())
                .build());
    }

    @GetMapping("/chat/{eventId}/history")
    public ResponseEntity<List<ChatMessageResponse>> getChatHistory(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        List<Message> history = messageService.getChatHistory(eventId);

        return ResponseEntity.ok(mapToMessageResponses(history));
    }

    @GetMapping("/chat/channels/{channelId}/history")
    public ResponseEntity<List<ChatMessageResponse>> getChannelHistory(
            @PathVariable UUID channelId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findUserByEmail(userDetails.getUsername());
        messageService.markChannelMessagesAsRead(channelId, user.getId());

        List<Message> history = messageService.getChannelHistory(channelId);
        return ResponseEntity.ok(mapToMessageResponses(history));
    }

    @PostMapping("/chat/channels/{channelId}/read")
    public ResponseEntity<Void> markChannelAsRead(@PathVariable UUID channelId, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        messageService.markChannelMessagesAsRead(channelId, user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/events/{eventId}/members")
    public ResponseEntity<List<UserResponse>> getEventMembers(@PathVariable UUID eventId) {
        List<UserEventInterest> interests = interestRepository.findByEventId(eventId);
        List<UserResponse> response = interests.stream()
                .map(interest -> {
                    User u = interest.getUser();
                    return UserResponse.builder()
                            .id(u.getId())
                            .fullName(u.getFullName())
                            .profilePhotoUrl(u.getProfilePhotoUrl())
                            .bio(u.getBio())
                            .build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chat/directs/{connectionId}/history")
    public ResponseEntity<List<ChatMessageResponse>> getDirectHistory(
            @PathVariable UUID connectionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findUserByEmail(userDetails.getUsername());
        // Marca como lido ao abrir o chat individual/solicitação
        messageService.markDirectMessagesAsRead(connectionId, user.getId());

        List<Message> history = messageService.getDirectHistory(connectionId);

        return ResponseEntity.ok(mapToMessageResponses(history));
    }

    private List<ChatMessageResponse> mapToMessageResponses(List<Message> history) {
        return history.stream().map(msg -> ChatMessageResponse.builder()
                .messageId(msg.getId())
                .eventId(msg.getEvent() != null ? msg.getEvent().getId() : null)
                .channelId(msg.getChannel() != null ? msg.getChannel().getId() : null)
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getFullName())
                .senderPhotoUrl(msg.getSender().getProfilePhotoUrl())
                .matchId(msg.getMatch() != null ? msg.getMatch().getId() : (msg.getChatRequest() != null ? msg.getChatRequest().getId() : null))
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .isSystem(msg.isSystem())
                .build()).collect(Collectors.toList());
    }


    @GetMapping("/events/{eventId}/potential-swipes")
    public ResponseEntity<List<UserResponse>> getPotentialSwipes(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
            
        User user = userService.findUserByEmail(userDetails.getUsername());
        List<User> potentials = matchService.getPotentialSwipersWithSorting(eventId, user);

        List<UserResponse> response = potentials.stream().map(u -> UserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .profilePhotoUrl(u.getProfilePhotoUrl())
                .bio(u.getBio())
                .preferences(u.getPreferences())
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/events/{eventId}/interest")
    public ResponseEntity<InterestResponse> getInterestByEvent(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
            
        User user = userService.findUserByEmail(userDetails.getUsername());
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        UserEventInterest interest = interestRepository.findByUserAndEvent(user, event)
                .orElse(UserEventInterest.builder()
                        .user(user)
                        .event(event)
                        .isFavorite(false)
                        .hasTicket(false)
                        .build());

        return ResponseEntity.ok(InterestResponse.builder()
                .eventId(eventId)
                .isFavorite(interest.isFavorite())
                .hasTicket(interest.isHasTicket())
                .build());
    }

    private EventResponse mapToEventResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .thumbnailUrl(event.getThumbnailUrl())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .producerId(event.getProducerId())
                .build();
    }
}
