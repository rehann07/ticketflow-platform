package com.support.ticket.kafka;

import com.support.ticket.constants.EmailTemplate;
import com.support.ticket.event.TicketCreatedEvent;
import com.support.ticket.event.TicketResolvedEvent;
import com.support.ticket.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(TicketEventConsumer.class);
    private final EmailService emailService;

    @KafkaListener(topics = "ticket_created_topic", groupId = "ticket-email-group")
    public void processTicketCreated(TicketCreatedEvent event) {
        log.info("📨 Consumed Created Event for ticket: {}", event.getTicketId());
        String subject = String.format(EmailTemplate.TICKET_CREATED_SUBJECT, event.getTitle());
        String body = String.format(EmailTemplate.TICKET_CREATED_BODY, event.getTitle(), event.getStatus());
        emailService.sendEmail(event.getEmail(), subject, body);
    }

    @KafkaListener(topics = "ticket_resolved_topic", groupId = "ticket-email-group")
    public void processTicketResolved(TicketResolvedEvent event) {
        log.info("📨 Consumed Resolved Event for ticket: {}", event.getTicketId());
        String subject = String.format(EmailTemplate.TICKET_RESOLVED_SUBJECT, event.getTitle());
        String body = String.format(EmailTemplate.TICKET_RESOLVED_BODY, event.getTitle(), event.getResolvedBy());
        emailService.sendEmail(event.getEmail(), subject, body);
    }
}