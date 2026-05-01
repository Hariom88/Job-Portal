package com.jobportal.backend.service;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchService {

    public int calculateMatchScore(User user, Job job) {
        if (user.getSkills() == null || job.getRequiredSkills() == null) {
            return 0;
        }

        Set<String> userSkills = parseSkills(user.getSkills());
        Set<String> jobSkills = parseSkills(job.getRequiredSkills());

        if (jobSkills.isEmpty()) return 0;

        long matches = jobSkills.stream()
                .filter(userSkills::contains)
                .count();

        double score = ((double) matches / jobSkills.size()) * 100;
        
        // Add experience weight
        if (user.getExperience() != null && user.getExperience().contains(String.valueOf(job.getExperienceRequired()))) {
            score += 10;
        }

        return (int) Math.min(score, 100);
    }

    private Set<String> parseSkills(String skillsStr) {
        if (skillsStr == null) return new HashSet<>();
        return Arrays.stream(skillsStr.split("[,|\\s]+"))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }
}
