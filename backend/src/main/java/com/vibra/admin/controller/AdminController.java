package com.vibra.admin.controller;

import com.vibra.admin.dto.DashboardSummaryResponse;
import com.vibra.admin.dto.FinanceSummaryResponse;
import com.vibra.admin.dto.TransactionResponse;
import com.vibra.admin.service.AdminService;
import com.vibra.identity.entity.User;
import com.vibra.identity.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('PRODUCER')")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;

    public AdminController(AdminService adminService, UserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        User producer = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(adminService.getProducerSummary(producer.getId()));
    }

    @GetMapping("/finances/summary")
    public ResponseEntity<FinanceSummaryResponse> getFinanceSummary(@AuthenticationPrincipal UserDetails userDetails) {
        User producer = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(adminService.getFinanceSummary(producer.getId()));
    }

    @GetMapping("/finances/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@AuthenticationPrincipal UserDetails userDetails) {
        User producer = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(adminService.getTransactions(producer.getId()));
    }

    @GetMapping("/events/{id}/stats")
    public ResponseEntity<com.vibra.admin.dto.EventStatsResponse> getEventStats(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getEventStats(id));
    }
}
