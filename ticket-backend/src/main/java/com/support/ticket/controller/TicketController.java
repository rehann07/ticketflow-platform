package com.support.ticket.controller;

import com.support.ticket.dto.TicketRequest;
import com.support.ticket.dto.TicketResponse;
import com.support.ticket.dto.UpdateTicketRequest;
import com.support.ticket.model.User;
import com.support.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    // 1. Create Ticket
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(
            @RequestBody @Valid TicketRequest request,
            @AuthenticationPrincipal User user
    ) {
        TicketResponse response = ticketService.createTicket(request, user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. Get My Tickets
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(ticketService.getAllTickets(user));
    }

    // 3. Get Single Ticket
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTicket(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketService.getTicketById(id, user));
    }

    // 4. Update Details (Title/Desc)
    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> updateTicketDetails(
            @PathVariable Long id,
            @RequestBody UpdateTicketRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                ticketService.updateTicketDetails(id, request.title(), request.description(), user)
        );
    }

    // 5. User Delete: Delete My Own Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMyTicket(@PathVariable Long id, @AuthenticationPrincipal User user) {
        ticketService.deleteTicket(id, user);
        return ResponseEntity.ok("Ticket deleted successfully");
    }
}