package com.jobportal.backend.service;

import com.jobportal.backend.model.Chat;
import com.jobportal.backend.model.ChatMessage;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ChatMessageRepository;
import com.jobportal.backend.repository.ChatRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Chat createOrGetChat(Long candidateId, Long employerId) {
        return chatRepository.findExistingChat(candidateId, employerId)
                .orElseGet(() -> {
                    User candidate = userRepository.findById(candidateId)
                            .orElseThrow(() -> new RuntimeException("Candidate not found"));
                    User employer = userRepository.findById(employerId)
                            .orElseThrow(() -> new RuntimeException("Employer not found"));
                    
                    Chat newChat = new Chat();
                    newChat.setCandidate(candidate);
                    newChat.setEmployer(employer);
                    return chatRepository.save(newChat);
                });
    }

    public List<Chat> getUserChats(Long userId) {
        return chatRepository.findChatsByUserId(userId);
    }

    public List<ChatMessage> getChatMessages(Long chatId) {
        return chatMessageRepository.findByChatIdOrderByTimestampAsc(chatId);
    }

    @Transactional
    public ChatMessage sendMessage(Long chatId, Long senderId, String content) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);
        message.setContent(content);
        
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat); // Update chat timestamp for sorting
        
        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Broadcast to WebSocket topic: /topic/chat/{chatId}
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, savedMessage);
        
        return savedMessage;
    }
}
