package com.jobportal.backend.controller;

import com.jobportal.backend.model.Chat;
import com.jobportal.backend.model.ChatMessage;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ChatService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(principal.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- REST APIs ---

    @PostMapping("/init")
    public ResponseEntity<Chat> initChat(Principal principal, @RequestParam Long targetUserId) {
        Long currentUserId = getUserId(principal);
        // Assuming current user is candidate and target is employer (or vice-versa).
        // createOrGetChat handles finding it irrespective of order.
        return ResponseEntity.ok(chatService.createOrGetChat(currentUserId, targetUserId));
    }

    @GetMapping("/my-chats")
    public ResponseEntity<List<Chat>> getMyChats(Principal principal) {
        return ResponseEntity.ok(chatService.getUserChats(getUserId(principal)));
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId));
    }

    // --- WebSocket Endpoint ---

    /**
     * This method handles messages sent from the client to: /app/chat/{chatId}/sendMessage
     * Requires the client to send JSON payload matching MessagePayload
     */
    @MessageMapping("/chat/{chatId}/sendMessage")
    public void receiveMessage(@DestinationVariable Long chatId, @Payload MessagePayload payload) {
        chatService.sendMessage(chatId, payload.getSenderId(), payload.getContent());
    }

    @Data
    public static class MessagePayload {
        private Long senderId;
        private String content;
    }
}
