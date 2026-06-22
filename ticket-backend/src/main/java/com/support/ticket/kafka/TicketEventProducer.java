package com.support.ticket.kafka;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketEventProducer {

    private static final Logger log = LoggerFactory.getLogger(TicketEventProducer.class);
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendEvent(String topic, Object event) {
        try {
            kafkaTemplate.send(topic, event);
            log.info("🚀 Sent to Kafka topic {}: {}", topic, event.getClass().getSimpleName());
        } catch (Exception e) {
            log.error("Failed to send Kafka event", e);
        }
    }
}