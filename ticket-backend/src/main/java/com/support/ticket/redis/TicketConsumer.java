package com.support.ticket.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.support.ticket.constants.EmailTemplate;
import com.support.ticket.event.TicketCreatedEvent;
import com.support.ticket.event.TicketResolvedEvent;
import com.support.ticket.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketConsumer {

    private static final Logger log = LoggerFactory.getLogger(TicketConsumer.class);
    private final EmailService emailService;

    private final ObjectMapper objectMapper;

    // Redis will push all messages to this single method
    public void handleMessage(String message) {
        try {
            // Split the identifier from the JSON payload
            String[] parts = message.split(":", 2);
            if (parts.length < 2) return;

            String eventType = parts[0];
            String jsonPayload = parts[1];

            // 🚀 Route the event based on the prefix!
            if ("TicketCreatedEvent".equals(eventType)) {
                TicketCreatedEvent event = objectMapper.readValue(jsonPayload, TicketCreatedEvent.class);
                processTicketCreated(event);

            } else if ("TicketResolvedEvent".equals(eventType)) {
                TicketResolvedEvent event = objectMapper.readValue(jsonPayload, TicketResolvedEvent.class);
                processTicketResolved(event);

            } else if ("UserDeletedEvent".equals(eventType)) {
                // 🎉 Remember the error that crashed your app earlier?
                // Now we safely ignore events this service doesn't care about!
                log.debug("Email service ignoring UserDeletedEvent");
            }

        } catch (Exception e) {
            log.error("Error processing Redis message for email", e);
        }
    }
    private void processTicketCreated(TicketCreatedEvent event) {
        log.info("Processing Created Event for ticket: {}", event.getTicketId());
        String subject = String.format(EmailTemplate.TICKET_CREATED_SUBJECT, event.getTitle());
        String body = String.format(EmailTemplate.TICKET_CREATED_BODY, event.getTitle(), event.getStatus());
        emailService.sendEmail(event.getEmail(), subject, body);
    }

    private void processTicketResolved(TicketResolvedEvent event) {
        log.info("Processing Resolved Event for ticket: {}", event.getTicketId());
        String subject = String.format(EmailTemplate.TICKET_RESOLVED_SUBJECT, event.getTitle());
        String body = String.format(EmailTemplate.TICKET_RESOLVED_BODY, event.getTitle(), event.getResolvedBy());
        emailService.sendEmail(event.getEmail(), subject, body);
    }
}