package com.projects.notification_system.event;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketCreatedEvent {
    private String email;
    private String title;
    private String status;
    private String username;
    private Long ticketId;
    private LocalDateTime createdAt;
}