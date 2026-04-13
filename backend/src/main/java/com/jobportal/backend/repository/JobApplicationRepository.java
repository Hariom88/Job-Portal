package com.jobportal.backend.repository;

import com.jobportal.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidateId(Long userId);
    List<JobApplication> findByJob_Company_Id(Long companyId);

    @org.springframework.data.jpa.repository.Query("SELECT ja.job.title, COUNT(ja) FROM JobApplication ja GROUP BY ja.job.title")
    List<Object[]> countApplicationsByJob();
}
