package com.support.ticket.service;

import com.support.ticket.dto.TicketAnalysis;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public TicketAnalysis analyzeTicket(String title, String description) {
        String promptText = """
        Analyze this support ticket.
        Title: %s
        Description: %s
        
        Output JSON with these fields:
        1. priority: (LOW, MEDIUM, HIGH) based on urgency.
        2. category: (Technical, Billing, Account, Feature).
        3. summary: A 1-sentence summary for the admin.
        4. sentiment: (Positive, Neutral, Frustrated, Angry).
        
        """.formatted(title, description);

        return chatClient.prompt()
                .user(promptText)
                .call()
                .entity(TicketAnalysis.class);
    }
}