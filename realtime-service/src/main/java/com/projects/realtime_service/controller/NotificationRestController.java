package com.projects.realtime_service.controller;

import com.projects.realtime_service.model.Notification;
import com.projects.realtime_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationRestController {

    private final NotificationService service;

    // React calls this when the page loads to get older notifications
    @GetMapping
    public List<Notification> getNotifications(@RequestHeader("X-Username") String username) {
        return service.getUserNotifications(username);
    }

    // React calls this when the user clicks the "eye" or "check" icon
    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markAsRead(id);
    }

    @DeleteMapping("/all")
    public void deleteAllNotifications(@RequestHeader("X-Username") String username) {
        service.deleteAllNotifications(username);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        // Make sure you have this method in your NotificationService too!
        service.deleteNotificationById(id);
    }
}