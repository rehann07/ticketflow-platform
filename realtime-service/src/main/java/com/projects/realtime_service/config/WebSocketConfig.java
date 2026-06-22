package com.projects.realtime_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 1. The tunnel entrance: React connects to this URL (e.g., ws://localhost:8081/ws)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Fallback for older browsers
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 2. The broadcasting channel: The server pushes messages to destinations starting with "/topic"
        config.enableSimpleBroker("/topic");

        // 3. The receiving channel (Optional for now): If React sends a message to the server, it uses "/app"
        config.setApplicationDestinationPrefixes("/app");
    }
}