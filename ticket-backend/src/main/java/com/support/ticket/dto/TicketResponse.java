package com.support.ticket.dto;

import java.util.List;

public record TicketResponse(
        Long id,
        String title,
        String description,
        String status,
        String username,
        List<String> roles
){
}