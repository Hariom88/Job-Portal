package com.jobportal.backend.service;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.JobDocument;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.JobSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElasticsearchSyncService {

    private final JobRepository jobRepository;
    private final JobSearchRepository jobSearchRepository;

    /**
     * Map MySQL Entity to ES Document
     */
    private JobDocument mapToDocument(Job job) {
        return JobDocument.builder()
                .mysqlJobId(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .experienceRequired(job.getExperienceRequired())
                .jobType(job.getJobType())
                .industry(job.getIndustry())
                .requiredSkills(job.getRequiredSkills())
                .companyName(job.getCompany() != null ? job.getCompany().getName() : null)
                .status(job.getStatus())
                .build();
    }

    /**
     * Syncs a single job (used when a job is created/updated)
     */
    public void syncJob(Job job) {
        JobDocument doc = mapToDocument(job);
        // If it exists, preserve the ES id
        jobSearchRepository.findByMysqlJobId(job.getId())
                .ifPresent(existingDoc -> doc.setId(existingDoc.getId()));
        jobSearchRepository.save(doc);
    }

    /**
     * Delete from ES (when deleted from MySQL)
     */
    public void deleteJob(Long mysqlJobId) {
        jobSearchRepository.findByMysqlJobId(mysqlJobId)
                .ifPresent(jobSearchRepository::delete);
    }

    /**
     * Initial sync of all existing records.
     * Can be run via a one-time script or a button in the Admin Panel.
     */
    @Transactional(readOnly = true)
    public void syncAllJobs() {
        List<Job> allJobs = jobRepository.findAll();
        List<JobDocument> docs = allJobs.stream()
                .map(job -> {
                    JobDocument doc = mapToDocument(job);
                    jobSearchRepository.findByMysqlJobId(job.getId())
                            .ifPresent(existingDoc -> doc.setId(existingDoc.getId()));
                    return doc;
                })
                .collect(Collectors.toList());
        jobSearchRepository.saveAll(docs);
    }
}
