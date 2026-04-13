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

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam JobApplication.ApplicationStatus status) {
        applicationService.updateStatus(id, status);
        return ResponseEntity.ok("Application marked as " + status);
    }
}
