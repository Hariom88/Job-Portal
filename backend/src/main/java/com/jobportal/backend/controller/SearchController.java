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

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location) {

        List<Job> jobs = jobRepository.findAll();

        if (q != null && !q.trim().isEmpty()) {
            String keyword = q.toLowerCase().trim();
            jobs = jobs.stream().filter(job ->
                (job.getTitle() != null && job.getTitle().toLowerCase().contains(keyword)) ||
                (job.getDescription() != null && job.getDescription().toLowerCase().contains(keyword))
            ).collect(Collectors.toList());
        }

        if (location != null && !location.trim().isEmpty()) {
            String loc = location.toLowerCase().trim();
            jobs = jobs.stream().filter(job ->
                job.getLocation() != null && job.getLocation().toLowerCase().contains(loc)
            ).collect(Collectors.toList());
        }

        return ResponseEntity.ok(jobs);
    }
}
