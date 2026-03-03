package com.projects.notification_system.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projects.notification_system.event.TicketCreatedEvent;
import com.projects.notification_system.event.TicketResolvedEvent;
import com.projects.notification_system.event.UserDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisMessageSubscriber {

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public void handleMessage(String message) {
        try {
            String[] parts = message.split(":", 2);
            if (parts.length < 2) return;

            String eventType = parts[0];
            String jsonPayload = parts[1];

            if ("TicketCreatedEvent".equals(eventType)) {
                TicketCreatedEvent event = objectMapper.readValue(jsonPayload, TicketCreatedEvent.class);
                notificationService.handleTicketCreated(event);

            } else if ("TicketResolvedEvent".equals(eventType)) {
                TicketResolvedEvent event = objectMapper.readValue(jsonPayload, TicketResolvedEvent.class);
                notificationService.handleTicketResolved(event);

            } else if ("UserDeletedEvent".equals(eventType)) {
                UserDeletedEvent event = objectMapper.readValue(jsonPayload, UserDeletedEvent.class);
                notificationService.handleUserDeleted(event);
            }

        } catch (Exception e) {
            log.error("Error processing Redis message", e);
        }
    }
}