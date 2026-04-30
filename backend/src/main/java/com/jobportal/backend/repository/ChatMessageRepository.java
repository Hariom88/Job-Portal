package com.jobportal.backend.repository;

import com.jobportal.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Fetch messages for a specific chat ordered by timestamp (oldest first for chronological display)
    List<ChatMessage> findByChatIdOrderByTimestampAsc(Long chatId);
}
