package com.support.ticket.service;

import com.support.ticket.constants.Roles;
import com.support.ticket.dto.ChangePasswordRequest;
import com.support.ticket.dto.RegisterRequest;
import com.support.ticket.dto.UpdateProfileRequest;
import com.support.ticket.dto.UserResponse;
import com.support.ticket.event.UserDeletedEvent;
import com.support.ticket.exception.UserAlreadyExistsException;
import com.support.ticket.exception.UserNotFoundException;
import com.support.ticket.redis.TicketProducer;
import com.support.ticket.model.User;
import com.support.ticket.repository.TicketRepository;
import com.support.ticket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Bean from SecurityConfig
    private final TicketRepository ticketRepository;

    private final TicketProducer ticketProducer;

    // 1. Register Normal User
    public void registerUser(RegisterRequest request) {
        validateUserUniqueness(request);
        userRepository.save(buildUser(request, List.of(Roles.ROLE_USER)));
    }

    // 2. Register Admin (For internal use)
    public void registerAdmin(RegisterRequest request) {
        validateUserUniqueness(request);
        userRepository.save(buildUser(request, List.of(Roles.ROLE_USER, Roles.ROLE_ADMIN)));
    }

    // 3. Find by Username (NEEDED for Login & Profile)
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->new UserNotFoundException("User not found: " + username));

    }

    // 4. Get Single User Profile (Safe DTO)
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRoles()
        );
    }

    // 5. Update Profile
    @Transactional
    public UserResponse updateProfile(User user, UpdateProfileRequest request) {
        user.setFullName(request.fullName());
        User updatedUser = userRepository.save(user);
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRoles()
        );
    }

    // 6. Change Password
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {

        // 1️⃣ Verify current password matches
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // 2️⃣ Prevent reusing same password
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        // 3️⃣ Encode and update
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    // 7. Admin Features
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRoles()
                ))
                .toList();
    }

    @Transactional
    public void deleteUser(Long id, User currentUser) {

        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot delete yourself.");
        }

        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userToDelete.getRoles().contains("ROLE_ADMIN")) {
            throw new RuntimeException("Cannot delete another admin.");
        }

        String deletedUsername = userToDelete.getUsername();

        ticketRepository.deleteByUserId(id);

        userRepository.delete(userToDelete);

        ticketProducer.sendEvent("ticket_notifications", new UserDeletedEvent(deletedUsername));
    }

    // --- Helper Method ---
    private void validateUserUniqueness(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email is already in use");
        }
    }
    private User buildUser(RegisterRequest request, List<String> roles) {
        User user = new User();
        user.setFullName(request.fullName());
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRoles(roles);
        return user;
    }
}