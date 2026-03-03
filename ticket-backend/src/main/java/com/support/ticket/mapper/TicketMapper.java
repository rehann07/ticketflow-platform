package com.support.ticket.mapper;

import com.support.ticket.dto.TicketAdminResponse;
import com.support.ticket.dto.TicketRequest;
import com.support.ticket.dto.TicketResponse;
import com.support.ticket.model.Ticket;
import com.support.ticket.model.TicketPriority;
import com.support.ticket.model.TicketStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class TicketMapper {

    // 1. Entity -> User Response DTO
    public TicketResponse toResponse(Ticket ticket) {
        List<String> roles = new ArrayList<>(ticket.getUser().getRoles());

        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus().name(),
                ticket.getUser().getUsername(),
                roles
        );
    }

    // 2. Entity -> Admin Response DTO (With AI Fields)
    public TicketAdminResponse toAdminResponse(Ticket ticket) {
        List<String> roles = new ArrayList<>(ticket.getUser().getRoles());

        return new TicketAdminResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getStatus().name(),
                ticket.getPriority().name(),
                ticket.getCategory(),
                ticket.getUser().getUsername(),
                ticket.getAiSummary(),
                ticket.getSentiment(),
                roles
        );
    }

    // 3. Request DTO -> Entity
    public Ticket toEntity(TicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setStatus(TicketStatus.OPEN); // Default status

        ticket.setPriority(TicketPriority.MEDIUM); // Default if null

        return ticket;
    }
}