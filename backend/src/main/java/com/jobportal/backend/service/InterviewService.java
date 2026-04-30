package com.jobportal.backend.service;

import com.jobportal.backend.dto.InterviewDTO;
import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Interview;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.InterviewRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Transactional
    public Interview scheduleInterview(Long employerId, InterviewDTO dto) {
        if (interviewRepository.existsByApplicationId(dto.getApplicationId())) {
            throw new RuntimeException("An interview is already scheduled for this application.");
        }

        Application application = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        User employer = userRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        // Verify employer owns the job
        if (!application.getJob().getCompany().getOwner().getId().equals(employerId)) {
            throw new RuntimeException("You are not authorized to schedule an interview for this job.");
        }

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setEmployer(employer);
        interview.setScheduledAt(dto.getScheduledAt());
        interview.setMeetingLink(dto.getMeetingLink());
        interview.setNotes(dto.getNotes());
        interview.setStatus("SCHEDULED");

        Interview saved = interviewRepository.save(interview);

        // Send Real-time Notification
        String dateStr = dto.getScheduledAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
        notificationService.sendNotification(
                application.getCandidate().getId(),
                "Interview Scheduled",
                "You have an interview for " + application.getJob().getTitle() + " on " + dateStr,
                "INFO"
        );

        // Send Email
        emailService.sendInterviewInvite(
                application.getCandidate().getEmail(),
                application.getCandidate().getFullName(),
                application.getJob().getTitle(),
                application.getJob().getCompany().getName(),
                dateStr,
                dto.getMeetingLink()
        );

        return saved;
    }

    public List<Interview> getEmployerInterviews(Long employerId) {
        return interviewRepository.findByEmployerIdOrderByScheduledAtAsc(employerId);
    }

    public List<Interview> getCandidateInterviews(Long candidateId) {
        return interviewRepository.findByApplicationCandidateIdOrderByScheduledAtAsc(candidateId);
    }

    @Transactional
    public void updateStatus(Long interviewId, String status) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        interview.setStatus(status);
        interviewRepository.save(interview);
    }
}
