package com.jobportal.backend.controller;

import com.jobportal.backend.model.Notification;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(principal.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Principal principal) {
        return ResponseEntity.ok(notificationService.getUserNotifications(getUserId(principal)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        return ResponseEntity.ok(notificationService.getUnreadCount(getUserId(principal)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(getUserId(principal));
        return ResponseEntity.ok().build();
    }

    // Testing endpoint (Should be protected or removed in prod)
    @PostMapping("/test-send/{userId}")
    public ResponseEntity<?> testSendNotification(@PathVariable Long userId, @RequestParam String message) {
        notificationService.sendNotification(userId, "Test Alert", message, "INFO");
        return ResponseEntity.ok("Sent");
    }
}
