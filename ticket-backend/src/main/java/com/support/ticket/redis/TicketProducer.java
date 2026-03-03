package com.support.ticket.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketProducer {

    private static final Logger log = LoggerFactory.getLogger(TicketProducer.class);
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public void sendEvent(String topic, Object event) {
        try {
            // Convert the Java object to a plain JSON string
            String jsonPayload = objectMapper.writeValueAsString(event);

            // Format: "UserDeletedEvent:{"username":"rehan"}"
            String message = event.getClass().getSimpleName() + ":" + jsonPayload;

            redisTemplate.convertAndSend(topic, message);
            log.info("🚀 Sent to Redis topic {}: {}", topic, message);

        } catch (Exception e) {
            log.error("Failed to send Redis event", e);
        }
    }
}