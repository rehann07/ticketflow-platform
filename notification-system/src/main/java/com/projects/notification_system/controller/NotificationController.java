package com.projects.notification_system.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    // server application
    // /app/send-message
    @MessageMapping("/send-message")
    @SendTo("/topic/notifications")
    public String sendMessage(String message){
        System.out.println("Message : "+message);
        return message;
    }
}
