package com.jobportal.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    private String location;
    private Double salaryMin;
    private Double salaryMax;
    private Integer experienceRequired;
    private String jobType; // Full-time, Remote, etc.
    private String industry; // IT, Finance, Healthcare, etc.

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, OPEN, CLOSED
    private Integer viewsCount = 0;
    
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
