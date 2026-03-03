package com.support.ticket.controller;

import com.support.ticket.dto.RegisterRequest;
import com.support.ticket.dto.TicketAdminResponse;
import com.support.ticket.dto.UserResponse;
import com.support.ticket.model.User;
import com.support.ticket.service.TicketService;
import com.support.ticket.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final TicketService ticketService;

    // --- USER MANAGEMENT ---

    // 1. View All Users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 2. Delete a User (Ban)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        userService.deleteUser(id, user);
        return ResponseEntity.ok("User deleted successfully.");
    }

    // 3. Create another Admin
    @PostMapping("/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createAdmin(@RequestBody @Valid RegisterRequest request) {
        userService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin created.");
    }

    // --- TICKET MANAGEMENT ---

    // 4. Get System-Wide Tickets (With AI Data)
    @GetMapping("/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketAdminResponse>> getAllTicketsSystemWide() {
        return ResponseEntity.ok(ticketService.findAllTicketsInSystem());
    }

    // 5. Update Status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketAdminResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status, user));
    }

    // 6. Delete ANY Ticket (Admin Override)
    @DeleteMapping("/tickets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAnyTicket(@PathVariable Long id) {
        ticketService.deleteTicketAsAdmin(id);
        return ResponseEntity.ok("Ticket deleted by Admin.");
    }
}