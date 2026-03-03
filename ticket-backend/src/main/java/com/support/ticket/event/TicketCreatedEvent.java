package com.support.ticket.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketCreatedEvent {
    private String email;
    private String title;
    private String status;
    private String username; // Needed to route WebSocket message
    private Long ticketId;
    private LocalDateTime createdAt;
}