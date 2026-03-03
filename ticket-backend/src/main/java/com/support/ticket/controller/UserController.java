package com.support.ticket.controller;

import com.support.ticket.dto.ChangePasswordRequest;
import com.support.ticket.dto.UpdateProfileRequest;
import com.support.ticket.dto.UserResponse;
import com.support.ticket.model.User;
import com.support.ticket.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    // 1️ Get My Profile
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                userService.getUserProfile(user)
        );
    }

    // 2️ Update Profile
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(
                userService.updateProfile(user, request)
        );
    }

    // 3️ Change Password
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        userService.changePassword(user, request);
        return ResponseEntity.ok("Password updated successfully");
    }
}