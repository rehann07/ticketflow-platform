package com.support.ticket.service;

import com.support.ticket.dto.TicketAdminResponse;
import com.support.ticket.dto.TicketAnalysis;
import com.support.ticket.dto.TicketRequest;
import com.support.ticket.dto.TicketResponse;
import com.support.ticket.event.TicketCreatedEvent;
import com.support.ticket.event.TicketResolvedEvent;
import com.support.ticket.exception.InvalidTicketStatusException;
import com.support.ticket.exception.TicketNotFoundException;
import com.support.ticket.exception.TicketUpdateNotAllowedException;
import com.support.ticket.redis.TicketProducer;
import com.support.ticket.mapper.TicketMapper;
import com.support.ticket.model.Ticket;
import com.support.ticket.model.TicketPriority;
import com.support.ticket.model.TicketStatus;
import com.support.ticket.model.User;
import com.support.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final UserService userService;
    private final TicketMapper ticketMapper;
    private final TicketProducer ticketProducer;
    private final AiService aiService;

    // ==================================================================================
    // 1. TICKET CREATION (WITH AI ENRICHMENT)
    // ==================================================================================

    @Transactional
    public TicketResponse createTicket(TicketRequest request, User user) {

        Ticket ticket = ticketMapper.toEntity(request);
        ticket.setUser(user);

        // --- AI Auto-Triage Logic ---
        try {
            TicketAnalysis analysis = aiService.analyzeTicket(ticket.getTitle(), ticket.getDescription());

            // Auto-set priority & category
            ticket.setPriority(analysis.priority());
            ticket.setCategory(analysis.category());

            // Save hidden fields for Admin
            ticket.setAiSummary(analysis.summary());
            ticket.setSentiment(analysis.sentiment());

        } catch (Exception e) {
            log.error("AI Analysis failed: {}", e.getMessage());
            // Fallback defaults
            if (ticket.getPriority() == null) ticket.setPriority(TicketPriority.MEDIUM);
            if (ticket.getCategory() == null) ticket.setCategory("General");
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // --- Redis Event ---
        try {
            TicketCreatedEvent event = new TicketCreatedEvent(
                    user.getEmail(),
                    savedTicket.getTitle(),
                    savedTicket.getStatus().name(),
                    user.getUsername(),
                    savedTicket.getId(),
                    savedTicket.getCreatedAt()
            );
            ticketProducer.sendEvent("ticket_notifications", event);
        } catch (Exception e) {
            log.error("Failed to send Redis event, but ticket was saved", e);
        }

        return ticketMapper.toResponse(savedTicket);
    }

    // ==================================================================================
    // 2. READ OPERATIONS (GET)
    // ==================================================================================

    @Cacheable(value = "tickets_response", key = "#id + ':' + #user.username")
    @Transactional(readOnly = true)
    public Object getTicketById(Long id, User user) {
        log.info("Fetching ticket from DB: {}", id);

        Ticket ticket = ticketRepository.findByIdWithUser(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");

        if (isAdmin) {
            return ticketMapper.toAdminResponse(ticket); // Returns DTO with AI Summary & Sentiment
        } else {
            validateOwnership(ticket, user);
            return ticketMapper.toResponse(ticket); // Returns clean User DTO
        }
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets(User user) {
        String currentUsername = user.getUsername();

        log.info("Fetching all tickets for user: {}", currentUsername);

        List<Ticket> tickets = ticketRepository.findByUserId(user.getId());
        return tickets.stream()
                .map(ticketMapper::toResponse)
                .toList();
    }

    // ==================================================================================
    // 3. UPDATE OPERATIONS
    // ==================================================================================

    @CacheEvict(value = "tickets_response", key = "#id + ':' + #user.username")
    @Transactional
    public TicketResponse updateTicketDetails(Long id, String newTitle, String newDescription, User user) {
        Ticket ticket = ticketRepository.findByIdWithUser(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        validateOwnership(ticket, user);

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new TicketUpdateNotAllowedException("Only OPEN tickets can be edited");
        }

        ticket.setTitle(newTitle);
        ticket.setDescription(newDescription);

        return ticketMapper.toResponse(ticketRepository.save(ticket));
    }

    // ==================================================================================
    // 4. DELETE OPERATIONS
    // ==================================================================================

    @CacheEvict(value = "tickets_response", key = "#id + ':' + #user.username")
    public void deleteTicket(Long id, User user) {
        Ticket ticket = ticketRepository.findByIdWithUser(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        validateOwnership(ticket, user);
        ticketRepository.delete(ticket);
    }

    // ==================================================================================
    // 5. ADMIN OPERATIONS
    // ==================================================================================

    @Transactional(readOnly = true)
    public List<TicketAdminResponse> findAllTicketsInSystem() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toAdminResponse)
                .toList();
    }

    @CacheEvict(value = "tickets_response", key = "#id + ':' + #user.username")
    @Transactional
    public TicketAdminResponse updateTicketStatus(Long id, String newStatus, User user) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));

        validateOwnership(ticket, user);

        TicketStatus status;
        try {
            status = TicketStatus.valueOf(newStatus.toUpperCase());
            ticket.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new InvalidTicketStatusException(newStatus);
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // --- Redis Event Trigger ---
        try {
            // Only trigger the Resolved event.
            if (status == TicketStatus.RESOLVED) {
                TicketResolvedEvent resolvedEvent = new TicketResolvedEvent(
                        savedTicket.getId(),
                        savedTicket.getTitle(),
                        savedTicket.getStatus().name(),
                        savedTicket.getUser().getEmail(),
                        savedTicket.getUser().getUsername(),
                        user.getUsername(),
                        java.time.LocalDateTime.now()
                );
                ticketProducer.sendEvent("ticket_notifications", resolvedEvent);
            }
        } catch (Exception e) {
            log.error("Failed to send status update Redis event", e);
        }

        return ticketMapper.toAdminResponse(savedTicket);
    }

    public void deleteTicketAsAdmin(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new TicketNotFoundException(id);
        }
        ticketRepository.deleteById(id);
    }

    // ==================================================================================
    // 6. HELPER METHODS (PRIVATE)
    // ==================================================================================

    private void validateOwnership(Ticket ticket, User user) {
        String currentUsername = user.getUsername();
        String ticketOwner = ticket.getUser().getUsername();

        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");

        if (!currentUsername.equals(ticketOwner) && !isAdmin) {
            log.warn("🚨 IDOR Attempt: User '{}' tried to access Ticket ID {} owned by '{}'",
                    currentUsername, ticket.getId(), ticketOwner);

            throw new AccessDeniedException("Access denied: You are not authorized to access this resource");
        }
    }
}