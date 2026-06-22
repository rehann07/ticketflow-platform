package com.projects.realtime_service.service;

import com.projects.realtime_service.model.Notification;
import com.projects.realtime_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    // This tool is what pushes data down the WebSocket tunnel to React
    private final SimpMessagingTemplate messagingTemplate;

    // 1. Create, Save, and Broadcast Notification
    public void createAndPushNotification(String message, String username, LocalDateTime time) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setUsername(username);
        n.setCreatedAt(time != null ? time : LocalDateTime.now());
        n.setRead(false);

        // Save to DB so it appears in their history
        Notification saved = repository.save(n);

        // Instantly push to the live WebSocket channel
        messagingTemplate.convertAndSend("/topic/notifications/" + username, saved);
    }

    // 2. Fetch History
    public List<Notification> getUserNotifications(String username) {
        return repository.findByUsernameOrderByCreatedAtDesc(username);
    }

    // 3. Mark as Read
    public void markAsRead(Long id) {
        repository.findById(id).ifPresent(n -> {
            n.setRead(true);
            repository.save(n);
        });
    }

    // 4. Delete Data
    public void deleteAllNotifications(String username) {
        List<Notification> list = repository.findByUsernameOrderByCreatedAtDesc(username);
        repository.deleteAll(list);
    }

    // 5. Delete a single notification
    public void deleteNotificationById(Long id) {
        repository.deleteById(id);
    }

    // 6. Mark all as read
    public void markAllAsRead(String username) {
        List<Notification> notifications = repository.findByUsernameOrderByCreatedAtDesc(username);
        notifications.forEach(n -> n.setRead(true));
        repository.saveAll(notifications);
    }
}
