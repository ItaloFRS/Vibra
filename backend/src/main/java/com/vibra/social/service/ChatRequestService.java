package com.vibra.social.service;

import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import com.vibra.social.entity.ChatRequest;
import com.vibra.social.repository.ChatRequestRepository;
import com.vibra.social.repository.MatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class ChatRequestService {

    private final ChatRequestRepository chatRequestRepository;
    private final MatchRepository matchRepository;
    private final UserService userService;

    public ChatRequestService(ChatRequestRepository chatRequestRepository, 
                              MatchRepository matchRepository, 
                              UserService userService) {
        this.chatRequestRepository = chatRequestRepository;
        this.matchRepository = matchRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<User> getConnectedUsers(UUID userId) {
        User user = userService.findById(userId);
        Set<User> connected = new HashSet<>();

        // From Accepted Chat Requests
        chatRequestRepository.findAcceptedRequestsForUser(userId).forEach(req -> {
            connected.add(req.getSender().getId().equals(userId) ? req.getReceiver() : req.getSender());
        });

        // From Matches
        matchRepository.findAllMatchesForUser(user).forEach(match -> {
            connected.add(match.getUser1().getId().equals(userId) ? match.getUser2() : match.getUser1());
        });

        return new ArrayList<>(connected);
    }

    @Transactional
    public ChatRequest sendRequest(UUID senderId, UUID receiverId) {
        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Você não pode enviar uma solicitação para si mesmo");
        }

        User sender = userService.findById(senderId);
        User receiver = userService.findById(receiverId);

        Optional<ChatRequest> existing = chatRequestRepository.findRequestBetweenUsers(senderId, receiverId);
        if (existing.isPresent()) {
            return existing.get();
        }

        ChatRequest request = ChatRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(ChatRequest.RequestStatus.PENDING)
                .build();

        return chatRequestRepository.save(request);
    }

    @Transactional
    public void acceptRequest(UUID requestId, UUID userId) {
        ChatRequest request = chatRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (!request.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Apenas o destinatário pode aceitar a solicitação");
        }

        request.setStatus(ChatRequest.RequestStatus.ACCEPTED);
        chatRequestRepository.save(request);
    }

    @Transactional
    public void rejectRequest(UUID requestId, UUID userId) {
        ChatRequest request = chatRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (!request.getReceiver().getId().equals(userId)) {
            throw new RuntimeException("Apenas o destinatário pode rejeitar a solicitação");
        }

        request.setStatus(ChatRequest.RequestStatus.REJECTED);
        chatRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<ChatRequest> getPendingRequests(UUID userId) {
        return chatRequestRepository.findPendingRequestsForUser(userId);
    }

    @Transactional(readOnly = true)
    public boolean areConnected(UUID user1Id, UUID user2Id) {
        // Check for accepted request
        Optional<ChatRequest> request = chatRequestRepository.findRequestBetweenUsers(user1Id, user2Id);
        if (request.isPresent() && request.get().getStatus() == ChatRequest.RequestStatus.ACCEPTED) {
            return true;
        }

        // Check for any match between them (regardless of event)
        User user1 = userService.findById(user1Id);
        User user2 = userService.findById(user2Id);
        // Assuming matchRepository has a method to check match between two users
        // This is a placeholder logic based on our current entities
        return false; 
    }
    
    @Transactional(readOnly = true)
    public String getRelationshipStatus(UUID currentUserId, UUID targetUserId) {
        Optional<ChatRequest> request = chatRequestRepository.findRequestBetweenUsers(currentUserId, targetUserId);
        if (request.isEmpty()) return "NONE";
        
        ChatRequest cr = request.get();
        if (cr.getStatus() == ChatRequest.RequestStatus.ACCEPTED) return "CONNECTED";
        if (cr.getStatus() == ChatRequest.RequestStatus.PENDING) {
            return cr.getSender().getId().equals(currentUserId) ? "PENDING_SENT" : "PENDING_RECEIVED";
        }
        return "NONE";
    }

    @Transactional
    public void deleteChat(UUID currentUserId, UUID targetUserId) {
        // Remove Accepted Chat Requests
        chatRequestRepository.findRequestBetweenUsers(currentUserId, targetUserId).ifPresent(chatRequestRepository::delete);
        
        // Note: For Matches, we might want to keep them but hide the chat, 
        // but for simplicity in this V1, let's remove the match connection if it exists.
        User user1 = userService.findById(currentUserId);
        User user2 = userService.findById(targetUserId);
        
        // This is a simplified approach
        matchRepository.findAllMatchesForUser(user1).forEach(match -> {
            if (match.getUser1().getId().equals(targetUserId) || match.getUser2().getId().equals(targetUserId)) {
                matchRepository.delete(match);
            }
        });
    }

    @Transactional(readOnly = true)
    public UUID getMatchIdBetweenUsers(UUID user1Id, UUID user2Id) {
        User user1 = userService.findById(user1Id);
        User user2 = userService.findById(user2Id);
        
        // Prioridade 1: Match oficial de evento
        Optional<UUID> matchId = matchRepository.findAllMatchesForUser(user1).stream()
                .filter(m -> m.getUser1().getId().equals(user2Id) || m.getUser2().getId().equals(user2Id))
                .map(m -> m.getId())
                .findFirst();
        
        if (matchId.isPresent()) return matchId.get();

        // Prioridade 2: Solicitação de chat aceita (usamos o ID do request como matchId para o socket)
        return chatRequestRepository.findRequestBetweenUsers(user1Id, user2Id)
                .filter(req -> req.getStatus() == ChatRequest.RequestStatus.ACCEPTED)
                .map(req -> req.getId())
                .orElse(null);
    }
}
