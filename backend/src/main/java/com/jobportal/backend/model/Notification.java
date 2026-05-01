package com.jobportal.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User recipient;

    private String title;
    private String message;
    private String type; // APPLICATION_UPDATE, INTERVIEW_SCHEDULED, SYSTEM
    private String link;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
