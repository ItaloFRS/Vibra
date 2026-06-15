package com.vibra.social.repository;

import com.vibra.events.entity.Event;
import com.vibra.identity.entity.User;
import com.vibra.social.entity.Swipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SwipeRepository extends JpaRepository<Swipe, UUID> {
    Optional<Swipe> findByEventAndSwiperAndSwiped(Event event, User swiper, User swiped);
}
