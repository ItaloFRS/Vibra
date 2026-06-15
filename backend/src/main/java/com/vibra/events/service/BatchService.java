package com.vibra.events.service;

import com.vibra.events.dto.BatchUpdateRequest;
import com.vibra.events.entity.TicketBatch;
import com.vibra.events.repository.TicketBatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BatchService {

    private final TicketBatchRepository batchRepository;

    public BatchService(TicketBatchRepository batchRepository) {
        this.batchRepository = batchRepository;
    }

    @Transactional
    public TicketBatch updateBatch(UUID id, BatchUpdateRequest request) {
        TicketBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lote não encontrado"));

        if (request.getPrice() != null) {
            batch.setPrice(request.getPrice());
        }
        
        if (request.getCapacity() != null) {
            batch.setCapacity(request.getCapacity());
        }
        
        if (request.getEndDate() != null) {
            ZonedDateTime newEnd = request.getEndDate();
            
            // Regra: Não permitir encerrar o último lote manualmente
            List<TicketBatch> allBatches = batch.getTicketType().getBatches();
            allBatches.sort(java.util.Comparator.comparing(TicketBatch::getBatchOrder));
            
            boolean isLast = allBatches.get(allBatches.size() - 1).getId().equals(batch.getId());
            
            if (isLast && newEnd.isBefore(batch.getEndDate())) {
                throw new RuntimeException("O último lote não pode ser encerrado manualmente antes do prazo.");
            }

            batch.setEndDate(newEnd);

            // Regra: Iniciar o próximo lote imediatamente se houver um
            int nextOrder = batch.getBatchOrder() + 1;
            allBatches.stream()
                    .filter(b -> b.getBatchOrder() == nextOrder)
                    .findFirst()
                    .ifPresent(nextBatch -> {
                        nextBatch.setStartDate(newEnd);
                        batchRepository.save(nextBatch);
                    });
        }

        return batchRepository.save(batch);
    }
}
