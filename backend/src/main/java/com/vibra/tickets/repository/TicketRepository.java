package com.vibra.tickets.repository;

import com.vibra.tickets.entity.Ticket;
import com.vibra.tickets.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByUserId(UUID userId);
    List<Ticket> findByEventId(UUID eventId);
    Optional<Ticket> findByExternalPaymentId(String externalPaymentId);
    List<Ticket> findByStatus(TicketStatus status);
    
    long countByTicketBatchIdAndStatusIn(UUID ticketBatchId, List<TicketStatus> statuses);
}
