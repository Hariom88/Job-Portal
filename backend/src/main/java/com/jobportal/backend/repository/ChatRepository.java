package com.jobportal.backend.repository;

import com.jobportal.backend.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Find chats involving a specific user (either candidate or employer), ordered by recent activity
    @Query("SELECT c FROM Chat c WHERE c.candidate.id = :userId OR c.employer.id = :userId ORDER BY c.updatedAt DESC")
    List<Chat> findChatsByUserId(@Param("userId") Long userId);

    // Check if a chat already exists between two users
    @Query("SELECT c FROM Chat c WHERE (c.candidate.id = :cId AND c.employer.id = :eId) OR (c.candidate.id = :eId AND c.employer.id = :cId)")
    Optional<Chat> findExistingChat(@Param("cId") Long candidateId, @Param("eId") Long employerId);
}
