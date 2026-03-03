package com.support.ticket.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tickets")
public class Ticket implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000) // Allow longer descriptions
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN; // Default status

    @Enumerated(EnumType.STRING)
    private TicketPriority priority = TicketPriority.MEDIUM; // Default priority

    private String category; // e.g., "Billing", "Technical" (AI will fill this )

    @Column(length = 500)
    private String aiSummary;

    @Column(length = 20)
    private String sentiment; // e.g., "Positive", "Angry", "Neutral"

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private static final long serialVersionUID = 1L;
}
