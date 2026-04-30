package com.jobportal.backend.controller;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final JobRepository jobRepository;

    /**
     * Fallback search using MySQL LIKE queries.
     * Production-safe: works without Elasticsearch.
     * Can be upgraded to Elasticsearch later by swapping this implementation.
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Integer maxExperience) {

        List<Job> jobs = jobRepository.findAll();

        // Only show OPEN jobs (using String comparison)
        jobs = jobs.stream().filter(job -> "OPEN".equals(job.getStatus())).collect(Collectors.toList());

        // Filter keyword (title, description, skills)
        if (q != null && !q.trim().isEmpty()) {
            String keyword = q.toLowerCase().trim();
            jobs = jobs.stream().filter(job ->
                (job.getTitle() != null && job.getTitle().toLowerCase().contains(keyword)) ||
                (job.getDescription() != null && job.getDescription().toLowerCase().contains(keyword)) ||
                (job.getRequiredSkills() != null && job.getRequiredSkills().toLowerCase().contains(keyword)) ||
                (job.getCompany() != null && job.getCompany().getName() != null && job.getCompany().getName().toLowerCase().contains(keyword))
            ).collect(Collectors.toList());
        }

        // Filter by location
        if (location != null && !location.trim().isEmpty()) {
            String loc = location.toLowerCase().trim();
            jobs = jobs.stream().filter(job ->
                job.getLocation() != null && job.getLocation().toLowerCase().contains(loc)
            ).collect(Collectors.toList());
        }

        // Filter by minimum salary
        if (minSalary != null) {
            jobs = jobs.stream().filter(job ->
                job.getSalaryMax() != null && job.getSalaryMax() >= minSalary
            ).collect(Collectors.toList());
        }

        // Filter by max experience required
        if (maxExperience != null) {
            jobs = jobs.stream().filter(job ->
                job.getExperienceRequired() != null && job.getExperienceRequired() <= maxExperience
            ).collect(Collectors.toList());
        }

        return ResponseEntity.ok(jobs);
    }
}
