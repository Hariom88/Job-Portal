package com.jobportal.backend.service;

import com.jobportal.backend.model.JobApplication;
import com.jobportal.backend.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    public JobApplication apply(JobApplication application) {
        return applicationRepository.save(application);
    }

    public List<JobApplication> getApplicationsByCompany(Long companyId) {
        return applicationRepository.findByJob_Company_Id(companyId);
    }

    public List<JobApplication> getApplicationsByCandidate(Long userId) {
        return applicationRepository.findByCandidateId(userId);
    }

    public JobApplication updateStatus(Long id, JobApplication.ApplicationStatus status) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
