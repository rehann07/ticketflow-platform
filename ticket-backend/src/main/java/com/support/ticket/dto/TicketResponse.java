package com.support.ticket.dto;

import java.util.List;

public record TicketResponse(
        Long id,
        String title,
        String description,
        String status,
        String username,
        List<String> roles
) implements java.io.Serializable {  // Good practice for Redis
    private static final long serialVersionUID = 1L;
}