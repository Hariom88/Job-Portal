package com.jobportal.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String education;

    private String resumeUrl;

    private String resumeName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    private boolean isEnabled = false;

    private boolean isVerified = false;

    private String otpCode;

    private LocalDateTime otpExpiry;

    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
        name = "saved_jobs",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "job_id")
    )
    private java.util.Set<Job> savedJobs = new java.util.HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
