package com.vibra.social.repository;

import com.vibra.events.entity.Event;
import com.vibra.social.entity.ChatChannel;
import com.vibra.social.entity.Match;
import com.vibra.social.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByEventAndChannelIsNullOrderByCreatedAtAsc(Event event);
    
    List<Message> findByChannelOrderByCreatedAtAsc(ChatChannel channel);

    List<Message> findByMatchOrderByCreatedAtAsc(Match match);
    
    List<Message> findByChatRequestOrderByCreatedAtAsc(com.vibra.social.entity.ChatRequest chatRequest);

    List<Message> findByChannelAndSenderIdNotAndReadAtIsNull(ChatChannel channel, UUID senderId);

    List<Message> findByMatchAndSenderIdNotAndReadAtIsNull(Match match, UUID senderId);

    @org.springframework.data.jpa.repository.Query("SELECT m FROM Message m WHERE m.chatRequest = :chatRequest AND m.sender.id <> :senderId AND m.readAt IS NULL")
    List<Message> findByChatRequestAndSenderIdNotAndReadAtIsNull(@org.springframework.data.repository.query.Param("chatRequest") com.vibra.social.entity.ChatRequest chatRequest, @org.springframework.data.repository.query.Param("senderId") UUID senderId);
    
    long countByChannelAndSenderIdNotAndReadAtIsNull(ChatChannel channel, UUID senderId);
    
    @org.springframework.data.jpa.repository.Query("SELECT " +
           "(SELECT COUNT(DISTINCT m1.match.id) FROM Message m1 JOIN Match mat ON m1.match.id = mat.id WHERE (mat.user1.id = :userId OR mat.user2.id = :userId) AND m1.sender.id <> :userId AND m1.readAt IS NULL) + " +
           "(SELECT COUNT(DISTINCT m2.chatRequest.id) FROM Message m2 JOIN ChatRequest cr ON m2.chatRequest.id = cr.id WHERE (cr.sender.id = :userId OR cr.receiver.id = :userId) AND m2.sender.id <> :userId AND m2.readAt IS NULL)")
    long countUnreadDirectChatsForUser(@org.springframework.data.repository.query.Param("userId") UUID userId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM messages WHERE match_id = :connId OR chat_request_id = :connId ORDER BY created_at DESC LIMIT 1", nativeQuery = true)
    java.util.Optional<Message> findLastMessageByConnectionId(@org.springframework.data.repository.query.Param("connId") UUID connId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(m) > 0 FROM Message m WHERE (m.match.id = :connId OR m.chatRequest.id = :connId) AND m.sender.id <> :userId AND m.readAt IS NULL")
    boolean hasUnreadMessagesInConnection(@org.springframework.data.repository.query.Param("connId") UUID connId, @org.springframework.data.repository.query.Param("userId") UUID userId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM messages WHERE match_id = :matchId ORDER BY created_at DESC LIMIT 1", nativeQuery = true)
    java.util.Optional<Message> findLastMessageByMatch(@org.springframework.data.repository.query.Param("matchId") UUID matchId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(m) > 0 FROM Message m WHERE m.match.id = :matchId AND m.sender.id <> :userId AND m.readAt IS NULL")
    boolean hasUnreadMessagesInMatch(@org.springframework.data.repository.query.Param("matchId") UUID matchId, @org.springframework.data.repository.query.Param("userId") UUID userId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT m.channel.id) FROM Message m " +
           "JOIN UserEventInterest uei ON m.channel.event.id = uei.event.id " +
           "WHERE uei.user.id = :userId " +
           "AND m.sender.id <> :userId " +
           "AND m.readAt IS NULL " +
           "AND m.channel.event.eventDate > :limitDate " +
           "AND m.channel.id NOT IN (SELECT mc.id.channelId FROM MutedChannel mc WHERE mc.id.userId = :userId)")
    long countUnreadChannelChatsForUser(@org.springframework.data.repository.query.Param("userId") UUID userId, @org.springframework.data.repository.query.Param("limitDate") java.time.ZonedDateTime limitDate);

    @org.springframework.data.jpa.repository.Query("SELECT m.id FROM Match m WHERE ((m.user1.id = :u1 AND m.user2.id = :u2) OR (m.user1.id = :u2 AND m.user2.id = :u1)) ORDER BY m.createdAt DESC")
    java.util.List<UUID> findMatchIdsBetweenUsers(@org.springframework.data.repository.query.Param("u1") UUID u1, @org.springframework.data.repository.query.Param("u2") UUID u2);

    long countByEventId(UUID eventId);
}
