package com.vibra.tickets.service;

import com.vibra.events.entity.TicketBatch;
import com.vibra.events.entity.TicketType;
import com.vibra.tickets.entity.TicketStatus;
import com.vibra.tickets.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class BatchSelectionService {

    private final TicketRepository ticketRepository;

    public BatchSelectionService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Optional<TicketBatch> findActiveBatch(TicketType ticketType) {
        ZonedDateTime now = ZonedDateTime.now();
        
        // Ordena os lotes pela ordem de criação (1, 2, 3...)
        List<TicketBatch> batches = ticketType.getBatches().stream()
                .sorted(Comparator.comparingInt(TicketBatch::getBatchOrder))
                .toList();

        for (TicketBatch batch : batches) {
            // Regra 1: O lote ainda está no prazo?
            boolean isWithinTime = now.isBefore(batch.getEndDate());

            // Regra 2: Ainda há ingressos disponíveis (considerando pagos e pendentes)?
            long soldTickets = ticketRepository.countByTicketBatchIdAndStatusIn(
                    batch.getId(), 
                    List.of(TicketStatus.PAID, TicketStatus.PENDING)
            );
            boolean hasCapacity = soldTickets < batch.getCapacity();

            System.out.println("Verificando Lote: " + batch.getBatchName() + 
                               " | No Prazo: " + isWithinTime + 
                               " | Tem Vaga: " + hasCapacity + 
                               " (Vendidos: " + soldTickets + " / Total: " + batch.getCapacity() + ")");

            if (isWithinTime && hasCapacity) {
                return Optional.of(batch);
            }
        }

        return Optional.empty(); // Nenhum lote disponível
    }
}
