package com.projects.realtime_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.support.converter.JsonMessageConverter;
import org.springframework.kafka.support.converter.RecordMessageConverter;

@Configuration
public class KafkaConfig {

    // This tool intercepts the raw JSON string from Kafka and automatically
    // maps it to whatever object you put in your @KafkaListener parameter!
    @Bean
    public RecordMessageConverter converter() {
        return new JsonMessageConverter();
    }
}