package com.vibra.events.repository;

import com.vibra.events.entity.TicketBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TicketBatchRepository extends JpaRepository<TicketBatch, UUID> {
}
