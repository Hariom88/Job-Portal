package com.jobportal.backend.service;

import com.jobportal.backend.dto.MatchResponseDTO;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeMatchService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final RestTemplate restTemplate;

    // Default to localhost:8000 if not set in properties
    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public MatchResponseDTO calculateJobMatch(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // In a real scenario, user.getResumeText() would be used. 
        // We'll use user.getSkills() + user.getExperience() + user.getEducation() as a proxy for resume text.
        String resumeText = String.format("%s %s %s", 
                user.getSkills() != null ? user.getSkills() : "",
                user.getExperience() != null ? user.getExperience() : "",
                user.getEducation() != null ? user.getEducation() : "");

        List<String> requiredSkills = Arrays.asList();
        if (job.getRequiredSkills() != null && !job.getRequiredSkills().isEmpty()) {
            requiredSkills = Arrays.stream(job.getRequiredSkills().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        // Construct request body for Python API
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("resume_text", resumeText);
        requestBody.put("required_skills", requiredSkills);
        requestBody.put("experience_required", job.getExperienceRequired() != null ? job.getExperienceRequired() : 0);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Call Python AI Microservice
            ResponseEntity<MatchResponseDTO> response = restTemplate.postForEntity(
                    aiServiceUrl + "/api/v1/match",
                    entity,
                    MatchResponseDTO.class
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Failed to reach AI matching service: " + e.getMessage());
            // Fallback response if Python service is down
            MatchResponseDTO fallback = new MatchResponseDTO();
            fallback.setMatch_percentage(0.0);
            return fallback;
        }
    }
}
