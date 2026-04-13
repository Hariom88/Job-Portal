package com.jobportal.backend.controller;

import com.jobportal.backend.model.Company;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.CompanyRepository;
import com.jobportal.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String title) {
        return jobService.searchJobs(title);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        Job job = jobService.getAllJobs().stream()
                .filter(j -> j.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return ResponseEntity.ok(job);
    }

    @PostMapping("/post")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Job> postJob(@RequestBody Job job, @RequestParam Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        job.setCompany(company);
        if (job.getIndustry() == null || job.getIndustry().isEmpty()) {
            job.setIndustry(company.getIndustry());
        }
        return ResponseEntity.ok(jobService.postJob(job));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job jobDetails) {
        return ResponseEntity.ok(jobService.updateJob(id, jobDetails));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok("Job deleted successfully");
    }

    @PostMapping("/{id}/view")
    public void incrementView(@PathVariable Long id) {
        jobService.incrementViews(id);
    }

    @GetMapping("/company/{companyId}")
    public List<Job> getJobsByCompany(@PathVariable Long companyId) {
        return jobService.getJobsByCompany(companyId);
    }
}
