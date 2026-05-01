package com.jobportal.backend.service;

import com.jobportal.backend.model.Notification;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(User recipient, String title, String message, String type, String link) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type)
                .link(link)
                .isRead(false)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // Send real-time via WebSocket
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/queue/notifications",
                notification
        );
    }
}
