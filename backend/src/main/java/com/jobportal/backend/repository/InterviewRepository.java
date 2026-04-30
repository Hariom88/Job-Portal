package com.jobportal.backend.repository;

import com.jobportal.backend.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    
    // For Employer Dashboard
    List<Interview> findByEmployerIdOrderByScheduledAtAsc(Long employerId);
    
    // For Candidate Dashboard
    List<Interview> findByApplicationCandidateIdOrderByScheduledAtAsc(Long candidateId);
    
    // Check if an application already has an interview
    boolean existsByApplicationId(Long applicationId);
}
