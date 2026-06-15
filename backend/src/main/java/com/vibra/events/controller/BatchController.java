package com.vibra.events.controller;

import com.vibra.events.dto.BatchUpdateRequest;
import com.vibra.events.entity.TicketBatch;
import com.vibra.events.service.BatchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events/batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_PRODUCER')")
    public ResponseEntity<TicketBatch> updateBatch(
            @PathVariable UUID id,
            @Valid @RequestBody BatchUpdateRequest request) {
        return ResponseEntity.ok(batchService.updateBatch(id, request));
    }
}
