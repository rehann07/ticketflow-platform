package com.support.ticket.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketResolvedEvent {
    private Long ticketId;
    private String title;
    private String status;
    private String email;
    private String username;
    private String resolvedBy;
    private LocalDateTime resolvedAt;
}