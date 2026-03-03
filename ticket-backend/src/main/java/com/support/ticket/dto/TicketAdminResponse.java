package com.support.ticket.dto;

import java.util.List;

public record TicketAdminResponse(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        String category,
        String username,
        String aiSummary,
        String sentiment,
        List<String> roles
) implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
}