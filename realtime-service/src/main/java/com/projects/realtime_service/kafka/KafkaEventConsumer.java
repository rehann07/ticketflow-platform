package com.projects.realtime_service.kafka;

import com.projects.realtime_service.event.TicketCreatedEvent;
import com.projects.realtime_service.event.TicketResolvedEvent;
import com.projects.realtime_service.event.UserDeletedEvent;
import com.projects.realtime_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaEventConsumer {

    private final NotificationService notificationService;

    // Listens to Kafka. If the app crashes, it remembers where it stopped reading!
    @KafkaListener(topics = "ticket_created_topic", groupId = "notification-group")
    public void handleTicketCreated(TicketCreatedEvent event) {
        log.info("📨 Kafka Event: Ticket Created for {}", event.getUsername());

        String uiMessage = "Ticket #" + event.getTicketId() + " Created: " + event.getTitle();
        notificationService.createAndPushNotification(uiMessage, event.getUsername(), event.getCreatedAt());
    }

    @KafkaListener(topics = "ticket_resolved_topic", groupId = "notification-group")
    public void handleTicketResolved(TicketResolvedEvent event) {
        log.info("✅ Kafka Event: Ticket Resolved for {}", event.getUsername());

        String uiMessage = "Ticket #" + event.getTicketId() + " has been RESOLVED by " + event.getResolvedBy();
        notificationService.createAndPushNotification(uiMessage, event.getUsername(), event.getResolvedAt());
    }

    @KafkaListener(topics = "user_deleted_topic", groupId = "notification-group")
    public void handleUserDeleted(UserDeletedEvent event) {
        log.info("🗑️ Kafka Event: User Deleted for {}", event.getUsername());

        // Wipe all notifications if the user gets banned/deleted
        notificationService.deleteAllNotifications(event.getUsername());
    }
}