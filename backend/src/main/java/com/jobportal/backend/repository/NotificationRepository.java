package com.jobportal.backend.repository;

import com.jobportal.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Fetch notifications for a user, ordered by newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Count unread notifications
    long countByUserIdAndIsReadFalse(Long userId);

    // Mark all as read for a user
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    @org.springframework.data.jpa.repository.Modifying
    void markAllAsReadByUserId(@Param("userId") Long userId);
}
