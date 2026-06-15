package com.vibra.events.repository;

import com.vibra.events.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByProducerId(UUID producerId);
    java.util.Optional<Event> findBySlug(String slug);
    List<Event> findAllByOrderByEventDateAsc();
}
