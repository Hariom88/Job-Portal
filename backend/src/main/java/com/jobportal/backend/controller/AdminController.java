package com.jobportal.backend.controller;

import com.jobportal.backend.dto.AdminReportsDTO;
import com.jobportal.backend.dto.AdminStatsDTO;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.CompanyRepository;
import com.jobportal.backend.repository.JobApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.JobService;
import com.jobportal.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private JobService jobService;

    @Autowired private UserRepository userRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private JobApplicationRepository jobApplicationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminStatsDTO> getDashboardStats() {
        AdminStatsDTO stats = new AdminStatsDTO(
            userRepository.count(),
            jobRepository.count(),
            companyRepository.count(),
            jobApplicationRepository.count(),
            userRepository.findTop5ByOrderByCreatedAtDesc(),
            jobRepository.findTop5ByOrderByCreatedAtDesc()
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<String> toggleBlock(@PathVariable Long id) {
        userService.toggleBlockUser(id);
        return ResponseEntity.ok("User status updated successfully");
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateRole(@PathVariable Long id, @RequestParam String role) {
        userService.updateUserRole(id, role);
        return ResponseEntity.ok("User role updated successfully");
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok("Job listing removed by admin");
    }

    // ─── Company Moderation ───────────────────────────────────────────────────
    @GetMapping("/companies")
    public List<com.jobportal.backend.model.Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @PutMapping("/companies/{id}/status")
    public ResponseEntity<String> updateCompanyStatus(@PathVariable Long id, @RequestParam String status) {
        com.jobportal.backend.model.Company company = companyRepository.findById(id).get();
        company.setStatus(status);
        companyRepository.save(company);
        return ResponseEntity.ok("Company status updated to " + status);
    }

    // ─── Job Moderation ───────────────────────────────────────────────────────
    @GetMapping("/jobs")
    public List<com.jobportal.backend.model.Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PutMapping("/jobs/{id}/status")
    public ResponseEntity<String> updateJobStatus(@PathVariable Long id, @RequestParam String status) {
        com.jobportal.backend.model.Job job = jobRepository.findById(id).get();
        job.setStatus(status);
        jobRepository.save(job);
        return ResponseEntity.ok("Job status updated to " + status);
    }

    // ─── Applications Management ──────────────────────────────────────────────
    @GetMapping("/applications")
    public List<com.jobportal.backend.model.JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    // ─── System Reports ───────────────────────────────────────────────────────
    @GetMapping("/reports/users-by-role")
    public ResponseEntity<java.util.Map<String, Long>> getUsersByRole() {
        java.util.Map<String, Long> aggregation = new java.util.HashMap<>();
        userRepository.countUsersByRole().forEach(obj -> {
            String role = (obj[0] != null) ? obj[0].toString() : "UNKNOWN";
            aggregation.put(role, (Long) obj[1]);
        });
        return ResponseEntity.ok(aggregation);
    }

    @GetMapping("/reports/jobs-by-industry")
    public ResponseEntity<java.util.Map<String, Long>> getJobsByIndustry() {
        java.util.Map<String, Long> aggregation = new java.util.HashMap<>();
        jobRepository.countJobsByIndustry().forEach(obj -> {
            String industry = (obj[0] != null) ? obj[0].toString() : "Other";
            aggregation.put(industry, (Long) obj[1]);
        });
        return ResponseEntity.ok(aggregation);
    }

    @GetMapping("/reports/applications-summary")
    public ResponseEntity<java.util.Map<String, Long>> getApplicationsSummary() {
        java.util.Map<String, Long> aggregation = new java.util.HashMap<>();
        jobApplicationRepository.countApplicationsByJob().forEach(obj -> {
            String jobTitle = (obj[0] != null) ? obj[0].toString() : "Deleted Job";
            aggregation.put(jobTitle, (Long) obj[1]);
        });
        return ResponseEntity.ok(aggregation);
    }

    @GetMapping("/reports")
    public ResponseEntity<AdminReportsDTO> getReports() {
        java.util.Map<String, Long> growthData = getUsersByRole().getBody();
        java.util.Map<String, Long> industryData = getJobsByIndustry().getBody();
        
        // Original expected status data for the DTO
        java.util.Map<String, Long> statusData = new java.util.HashMap<>();
        jobApplicationRepository.findAll().forEach(a -> {
            statusData.put(a.getStatus().name(), statusData.getOrDefault(a.getStatus().name(), 0L) + 1);
        });

        AdminReportsDTO reports = new AdminReportsDTO(growthData, industryData, statusData);
        return ResponseEntity.ok(reports);
    }
}
