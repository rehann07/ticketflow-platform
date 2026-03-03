package com.support.ticket.exception;

public class TicketUpdateNotAllowedException extends RuntimeException {

    public TicketUpdateNotAllowedException(String message) {
        super(message);
    }
}
