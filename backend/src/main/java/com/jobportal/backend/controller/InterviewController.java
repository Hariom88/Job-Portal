package com.jobportal.backend.controller;

import com.jobportal.backend.dto.InterviewDTO;
import com.jobportal.backend.model.Interview;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(principal.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Interview> scheduleInterview(@RequestBody InterviewDTO dto, Principal principal) {
        return ResponseEntity.ok(interviewService.scheduleInterview(getUserId(principal), dto));
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Interview>> getEmployerInterviews(Principal principal) {
        return ResponseEntity.ok(interviewService.getEmployerInterviews(getUserId(principal)));
    }

    @GetMapping("/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<Interview>> getCandidateInterviews(Principal principal) {
        return ResponseEntity.ok(interviewService.getCandidateInterviews(getUserId(principal)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        interviewService.updateStatus(id, status);
        return ResponseEntity.ok("Status updated");
    }
}
