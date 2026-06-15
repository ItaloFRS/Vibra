package com.vibra.social.repository;

import com.vibra.social.entity.ChatRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRequestRepository extends JpaRepository<ChatRequest, UUID> {
    
    @Query("SELECT cr FROM ChatRequest cr WHERE cr.receiver.id = :userId AND cr.status = 'PENDING'")
    List<ChatRequest> findPendingRequestsForUser(@Param("userId") UUID userId);

    @Query("SELECT cr FROM ChatRequest cr WHERE (cr.sender.id = :userId OR cr.receiver.id = :userId) AND cr.status = 'ACCEPTED'")
    List<ChatRequest> findAcceptedRequestsForUser(@Param("userId") UUID userId);

    @Query("SELECT cr FROM ChatRequest cr WHERE (cr.sender.id = :user1Id AND cr.receiver.id = :user2Id) OR (cr.sender.id = :user2Id AND cr.receiver.id = :user1Id)")
    Optional<ChatRequest> findRequestBetweenUsers(@Param("user1Id") UUID user1Id, @Param("user2Id") UUID user2Id);
}
