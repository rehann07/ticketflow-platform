package com.projects.notification_system.repository;

import com.projects.notification_system.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Fetch notifications for a specific user, newest first
    List<Notification> findByUsernameOrderByCreatedAtDesc(String username);
}