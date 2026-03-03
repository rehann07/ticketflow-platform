package com.support.ticket.dto;

import com.support.ticket.model.TicketPriority;

public record TicketAnalysis(TicketPriority priority, String category, String summary,String sentiment) {}
