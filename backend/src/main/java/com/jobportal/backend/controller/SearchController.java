package com.jobportal.backend.controller;

import com.jobportal.backend.model.JobDocument;
import com.jobportal.backend.service.ElasticsearchSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ElasticsearchOperations elasticsearchOperations;
    private final ElasticsearchSyncService syncService;

    // Trigger full manual sync
    @PostMapping("/sync-all")
    public ResponseEntity<String> syncAll() {
        syncService.syncAllJobs();
        return ResponseEntity.ok("All MySQL jobs synced to Elasticsearch successfully.");
    }

    // Advanced Search API using Elasticsearch
    @GetMapping("/jobs")
    public ResponseEntity<List<JobDocument>> searchJobs(
            @RequestParam(required = false) String q, // Keyword
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Integer maxExperience) {

        Criteria criteria = new Criteria();

        // 1. Keyword full text search
        if (q != null && !q.trim().isEmpty()) {
            criteria = criteria.and(new Criteria("title").contains(q)
                    .or("description").contains(q)
                    .or("requiredSkills").contains(q)
                    .or("companyName").contains(q));
        }

        // 2. Exact match on location
        if (location != null && !location.trim().isEmpty()) {
            criteria = criteria.and(new Criteria("location").is(location));
        }

        // 3. Salary filter
        if (minSalary != null) {
            criteria = criteria.and(new Criteria("salaryMax").greaterThanEqual(minSalary));
        }

        // 4. Experience filter
        if (maxExperience != null) {
            criteria = criteria.and(new Criteria("experienceRequired").lessThanEqual(maxExperience));
        }
        
        // Only show OPEN jobs
        criteria = criteria.and(new Criteria("status").is("OPEN"));

        CriteriaQuery query = new CriteriaQuery(criteria);
        
        // Execute search
        SearchHits<JobDocument> searchHits = elasticsearchOperations.search(query, JobDocument.class);

        List<JobDocument> results = searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}
