package com.projects.notification_system.controller;

import com.projects.notification_system.model.Notification;
import com.projects.notification_system.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationRestController {

    @Autowired
    private NotificationService service;

    // GET /notifications
    // Now dynamically extracts the username from the "X-Username" HTTP header
    @GetMapping({"", "/"})
    public List<Notification> getNotifications(@RequestHeader("X-Username") String username) {
        return service.getUserNotifications(username);
    }

    // PUT /notifications/{id}/read
    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markAsRead(id);
    }

    // PUT /notifications/read-all
    @PutMapping("/read-all")
    public void markAllRead(@RequestHeader("X-Username") String username) {
        service.markAllRead(username);
    }

    // ==========================================
    // DELETE ENDPOINTS
    // ==========================================

    // DELETE /notifications/{id}
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
    }

    // DELETE /notifications/all
    @DeleteMapping("/all")
    public void deleteAllNotifications(@RequestHeader("X-Username") String username) {
        service.deleteAllNotifications(username);
    }
}