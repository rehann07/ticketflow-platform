package com.projects.realtime_service.repository;

import com.projects.realtime_service.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Custom query: Find all notifications for a user, sorted with newest at the top
    List<Notification> findByUsernameOrderByCreatedAtDesc(String username);
}