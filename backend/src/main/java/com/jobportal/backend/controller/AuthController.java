package com.jobportal.backend.controller;

import com.jobportal.backend.model.Role;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.RoleRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        if (userRepository.findByEmail(request.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        User user = new User();
        user.setEmail(request.get("email"));
        user.setPassword(passwordEncoder.encode(request.get("password")));
        user.setFullName(request.get("fullName"));
        user.setPhone(request.get("phone"));

        String roleNameRaw = request.get("role");
        String roleName = (roleNameRaw != null) ? roleNameRaw.toUpperCase() : "CANDIDATE";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        user.setRole(role);
        user.setEnabled(true);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.get("email"), request.get("password"))
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            return ResponseEntity.status(403).body("Account is disabled. Please contact admin.");
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.get("email"));
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(request.get("email")).get();

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);

        return ResponseEntity.ok(response);
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
