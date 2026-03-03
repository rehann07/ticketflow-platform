package com.support.ticket.constants;

public class EmailTemplate {

    // Private constructor to prevent instantiation
    private EmailTemplate() {}

    public static final String TICKET_CREATED_SUBJECT = "Ticket Received: %s";

    public static final String TICKET_CREATED_BODY = """
            Hello,
            
            We successfully received your ticket: '%s'.
            Current Status: %s
            
            Our support team will review it shortly.
            
            Best Regards,
            Ticket Support Team
            """;

    public static final String TICKET_RESOLVED_SUBJECT = "Ticket Resolved: %s";

    public static final String TICKET_RESOLVED_BODY = """
            Hello,
            
            Good news! Your ticket '%s' has been successfully marked as RESOLVED by %s.
            
            If you have any further questions or if the issue persists, please don't hesitate to reach out or create a new ticket.
            
            Thank you for your patience!
            
            Best Regards,
            Ticket Support Team
            """;
}