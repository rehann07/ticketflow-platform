package com.support.ticket.dto;

public record UpdateTicketRequest(
        String title,
        String description
) {}