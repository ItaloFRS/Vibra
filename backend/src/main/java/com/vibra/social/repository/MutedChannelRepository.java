package com.vibra.social.repository;

import com.vibra.social.entity.MutedChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface MutedChannelRepository extends JpaRepository<MutedChannel, MutedChannel.MutedChannelId> {

    @Query("SELECT mc.id.channelId FROM MutedChannel mc WHERE mc.id.userId = :userId")
    List<UUID> findMutedChannelIdsByUserId(UUID userId);

    boolean existsByIdUserIdAndIdChannelId(UUID userId, UUID channelId);
}
