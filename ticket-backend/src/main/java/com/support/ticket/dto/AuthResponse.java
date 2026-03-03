package com.support.ticket.dto;

import java.util.List;

public record AuthResponse(
        String token,
        Long id,
        String username,
        String fullName,
        String email,
        List<String> roles
) {}