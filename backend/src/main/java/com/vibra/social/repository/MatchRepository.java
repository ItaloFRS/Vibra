package com.vibra.social.repository;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MatchRepository extends JpaRepository<Match, UUID> {
    @Query("SELECT m FROM Match m WHERE m.event = :event AND (m.user1 = :user OR m.user2 = :user)")
    List<Match> findMatchesByUserAndEvent(@Param("user") User user, @Param("event") Event event);

    long countByEventId(UUID eventId);

    @Query("SELECT COUNT(m) FROM Match m WHERE m.user1 = :user OR m.user2 = :user")
    long countAllMatchesForUser(@Param("user") User user);

    @Query("SELECT m FROM Match m WHERE m.user1 = :user OR m.user2 = :user")
    List<Match> findAllMatchesForUser(@Param("user") User user);
}
