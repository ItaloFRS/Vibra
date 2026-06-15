package com.vibra.social.repository;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.UserEventInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserEventInterestRepository extends JpaRepository<UserEventInterest, UUID> {
    Optional<UserEventInterest> findByUserAndEvent(User user, Event event);
    
    List<UserEventInterest> findByUserIdAndIsFavoriteTrue(UUID userId);
    
    List<UserEventInterest> findByEventId(UUID eventId);
    
    long countByEventId(UUID eventId);
    }
