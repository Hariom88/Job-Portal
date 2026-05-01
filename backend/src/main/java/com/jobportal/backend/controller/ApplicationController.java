package com.jobportal.backend.controller;

import com.jobportal.backend.model.JobApplication;
import com.jobportal.backend.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private com.jobportal.backend.service.NotificationService notificationService;

    @Autowired
    private com.jobportal.backend.repository.JobApplicationRepository applicationRepository;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<JobApplication> apply(@RequestBody JobApplication application) {
        return ResponseEntity.ok(applicationService.apply(application));
    }

    @GetMapping("/candidate/{userId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public List<JobApplication> getApplicationsForCandidate(@PathVariable Long userId) {
        return applicationService.getApplicationsByCandidate(userId);
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('COMPANY')")
    public List<JobApplication> getApplicationsForCompany(@PathVariable Long companyId) {
        return applicationService.getApplicationsByCompany(companyId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPANY', 'CANDIDATE', 'ADMIN')")
    public ResponseEntity<JobApplication> getApplicationById(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        boolean isCompany = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COMPANY"));

        // If company views it for the first time, notify candidate
        if (isCompany && !application.isSeen()) {
            application.setSeen(true);
            applicationRepository.save(application);

            notificationService.sendNotification(
                application.getCandidate(),
                "Resume Viewed",
                "Your resume for " + application.getJob().getTitle() + " was seen by " + application.getJob().getCompany().getName(),
                "RESUME_VIEWED",
                "/dashboard"
            );
        }

        return ResponseEntity.ok(application);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam JobApplication.ApplicationStatus status) {
        JobApplication application = applicationService.updateStatus(id, status);
        
        notificationService.sendNotification(
            application.getCandidate(),
            "Application Update",
            "Your application for " + application.getJob().getTitle() + " has been " + status,
            "APPLICATION_UPDATE",
            "/dashboard"
        );

        return ResponseEntity.ok("Application marked as " + status);
    }
}
