package com.jobportal.backend.controller;

import com.jobportal.backend.model.Role;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.RoleRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.util.JwtUtil;
import com.jobportal.backend.dto.SignupRequest;
import com.jobportal.backend.model.RefreshToken;
import com.jobportal.backend.service.EmailService;
import com.jobportal.backend.service.RateLimitingService;
import com.jobportal.backend.service.RefreshTokenService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RateLimitingService rateLimitingService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest request) {
        java.util.Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            if (existingUser.get().isVerified()) {
                return ResponseEntity.badRequest().body("Email already exists and is verified!");
            } else {
                // Resend OTP for unverified account
                String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
                User user = existingUser.get();
                user.setOtpCode(otp);
                user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
                userRepository.save(user);
                emailService.sendOtpEmail(user.getEmail(), otp);
                return ResponseEntity.ok("This email is already registered but not verified. A new OTP has been sent to your email.");
            }
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        String roleNameRaw = request.getRole();
        String roleName = (roleNameRaw != null) ? roleNameRaw.toUpperCase() : "CANDIDATE";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        user.setRole(role);
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        user.setEnabled(false); // Disabled until verified
        user.setVerified(false);

        userRepository.save(user);
        
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }

        return ResponseEntity.ok("User registered successfully! Please check your email for the OTP.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Account is already verified!");
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP!");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired! Please request a new one.");
        }

        user.setVerified(true);
        user.setEnabled(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account verified successfully! You can now login.");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("Account is already verified!");
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
        return ResponseEntity.ok("New OTP has been sent to your email.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
        userRepository.save(user);

        String resetLink = "https://job-portal-pied-rho.vercel.app/reset-password?token=" + token;
        emailService.sendEmail(user.getEmail(), "Password Reset Request", 
                "To reset your password, click the link below:\n" + resetLink + "\n\n" +
                "This link will expire in 1 hour.");

        return ResponseEntity.ok("Password reset link has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password has been reset successfully. You can now login.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        Bucket bucket = rateLimitingService.resolveBucket(ip);
        
        if (!bucket.tryConsume(1)) {
            return ResponseEntity.status(429).body("Too many login attempts. Please try again after a minute.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.get("email"), request.get("password"))
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            return ResponseEntity.status(403).body("Account is disabled. Please contact admin.");
        } catch (org.springframework.security.authentication.LockedException e) {
            return ResponseEntity.status(403).body("Account is locked.");
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.get("email"));
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(request.get("email"))
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.get("email"));

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("refreshToken", refreshToken.getToken());
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestRefreshToken = request.get("refreshToken");

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtil.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
                    Map<String, String> response = new HashMap<>();
                    response.put("token", token);
                    response.put("refreshToken", requestRefreshToken);
                    return ResponseEntity.ok(response);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
    
    @GetMapping("/reset-admin")
    public ResponseEntity<?> resetAdmin() {
        User admin = userRepository.findByEmail("admin@jobportal.com").orElse(new User());
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));
        
        admin.setEmail("admin@jobportal.com");
        admin.setFullName("Super Admin");
        admin.setRole(adminRole);
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEnabled(true);
        
        userRepository.save(admin);
        
        return ResponseEntity.ok("Admin account has been force-reset to: admin@jobportal.com / admin123");
    }

    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        Map<String, Object> status = new HashMap<>();
        status.put("message", "Backend is running!");
        status.put("database_connected", userRepository.count() >= 0);
        status.put("admin_exists", userRepository.findByEmail("admin@jobportal.com").isPresent());
        return ResponseEntity.ok(status);
    }
}
