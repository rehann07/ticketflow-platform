package com.projects.notification_system.service;

import com.projects.notification_system.event.TicketCreatedEvent;
import com.projects.notification_system.event.TicketResolvedEvent;
import com.projects.notification_system.event.UserDeletedEvent;
import com.projects.notification_system.model.Notification;
import com.projects.notification_system.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 1. HANDLER FOR TICKET CREATED
    public void handleTicketCreated(TicketCreatedEvent event) {
        log.info("\uD83D\uDD25 Redis Event Received: Ticket Created for {}", event.getUsername());

        String uiMessage = "Ticket #" + event.getTicketId() + " Created: " + event.getTitle();
        saveAndPushNotification(uiMessage, event.getUsername(), event.getCreatedAt());
    }

    // 2. HANDLER FOR TICKET RESOLVED
    public void handleTicketResolved(TicketResolvedEvent event) {
        log.info("✅ Redis Event Received: Ticket Resolved for {}", event.getUsername());

        String uiMessage = "Ticket #" + event.getTicketId() + " has been RESOLVED by " + event.getResolvedBy();

        saveAndPushNotification(uiMessage, event.getUsername(), event.getResolvedAt());
    }

    // 3. HANDLER FOR USER DELETED
    public void handleUserDeleted(UserDeletedEvent event) {
        log.info("\uD83D\uDDD1\uFE0F Redis Event Received: User Deleted for {}", event.getUsername());

        deleteAllNotifications(event.getUsername());

        System.out.println("✅ All orphaned notifications wiped for " + event.getUsername());
    }

    // --- HELPER TO REDUCE CODE REPETITION ---
    private void saveAndPushNotification(String message, String username, LocalDateTime time) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setUsername(username);
        n.setCreatedAt(time != null ? time : LocalDateTime.now());
        n.setRead(false);

        Notification saved = repository.save(n);

        // Push to React via WebSocket
        messagingTemplate.convertAndSend("/topic/notifications", saved);
    }

    // 2. GET HISTORY
    public List<Notification> getUserNotifications(String username) {
        return repository.findByUsernameOrderByCreatedAtDesc(username);
    }

    // 3. MARK AS READ
    public void markAsRead(Long id) {
        repository.findById(id).ifPresent(n -> {
            n.setRead(true);
            repository.save(n);
        });
    }

    public void markAllRead(String username) {
        List<Notification> list = repository.findByUsernameOrderByCreatedAtDesc(username);
        list.forEach(n -> n.setRead(true));
        repository.saveAll(list);
    }

    // ==========================================
    // 4. DELETE OPERATIONS
    // ==========================================

    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }

    public void deleteAllNotifications(String username) {
        List<Notification> list = repository.findByUsernameOrderByCreatedAtDesc(username);
        repository.deleteAll(list);
    }
}