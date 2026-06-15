package com.vibra.social.repository;

import com.vibra.social.entity.ChatChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatChannelRepository extends JpaRepository<ChatChannel, UUID> {
    List<ChatChannel> findByEventId(UUID eventId);
}
