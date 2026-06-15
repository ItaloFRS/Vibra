package com.vibra.identity.repository;

import com.vibra.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query(value = "SELECT u.* FROM users u " +
           "JOIN user_event_interests uei ON u.id = uei.user_id " +
           "WHERE uei.event_id = :eventId " +
           "AND u.id <> :userId " +
           "AND (uei.is_favorite = true OR uei.has_ticket = true) " +
           "AND u.id NOT IN (" +
           "  SELECT s.swiped_id FROM swipes s WHERE s.event_id = :eventId AND s.swiper_id = :userId" +
           ") " +
           "AND (u.preferences ->> 'wantsMatches')::boolean = true",
           nativeQuery = true)
    List<User> findPotentialSwipers(@Param("eventId") UUID eventId, @Param("userId") UUID userId);
}
