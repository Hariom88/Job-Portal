package com.jobportal.backend.controller;

import com.jobportal.backend.dto.MatchResponseDTO;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class MatchController {

    private final ResumeMatchService resumeMatchService;
    private final UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) throw new RuntimeException("Unauthorized");
        return userRepository.findByEmail(principal.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/match/{jobId}")
    public ResponseEntity<MatchResponseDTO> getJobMatchScore(@PathVariable Long jobId, Principal principal) {
        Long userId = getUserId(principal);
        MatchResponseDTO matchResult = resumeMatchService.calculateJobMatch(userId, jobId);
        return ResponseEntity.ok(matchResult);
    }
}
