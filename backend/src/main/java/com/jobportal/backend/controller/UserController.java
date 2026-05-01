package com.jobportal.backend.controller;

import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.jobportal.backend.repository.JobRepository jobRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User profileData) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(profileData.getFullName());
        user.setPhone(profileData.getPhone());
        user.setBio(profileData.getBio());
        user.setSkills(profileData.getSkills());
        user.setExperience(profileData.getExperience());
        user.setEducation(profileData.getEducation());
        user.setProfilePicture(profileData.getProfilePicture());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/resume/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // For a real production app, upload to S3/Cloudinary here.
        // For now, we will store as a Base64 string (NOT RECOMMENDED for large files, but works for mock)
        // or simulate a successful upload.
        
        byte[] bytes = file.getBytes();
        String base64Resume = Base64.getEncoder().encodeToString(bytes);
        
        user.setResumeUrl("data:" + file.getContentType() + ";base64," + base64Resume);
        user.setResumeName(file.getOriginalFilename());
        
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "message", "Resume uploaded successfully",
            "resumeName", user.getResumeName()
        ));
    }

    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> saveJob(@PathVariable Long jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.jobportal.backend.model.Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        user.getSavedJobs().add(job);
        userRepository.save(user);
        return ResponseEntity.ok("Job saved successfully");
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> unsaveJob(@PathVariable Long jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getSavedJobs().removeIf(job -> job.getId().equals(jobId));
        userRepository.save(user);
        return ResponseEntity.ok("Job unsaved successfully");
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<?> getSavedJobs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getSavedJobs());
    }
}
