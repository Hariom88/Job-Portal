package com.jobportal.backend.config;

import com.jobportal.backend.model.Role;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.RoleRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles if they don't exist
        initRole("ADMIN");
        initRole("COMPANY");
        initRole("CANDIDATE");

        // 2. Initialize Default Admin
        User admin = userRepository.findByEmail("admin@jobportal.com").orElse(new User());
        if (admin.getEmail() == null) {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
            admin.setFullName("Super Admin");
            admin.setEmail("admin@jobportal.com");
            admin.setRole(adminRole);
            admin.setPhone("0000000000");
            admin.setEnabled(true);
        }
        // Always reset password and ensure enabled
        admin.setEnabled(true);
        admin.setPassword(passwordEncoder.encode("admin@123"));
        userRepository.save(admin);

        // 3. Initialize Default Candidate for testing
        User testCandidate = userRepository.findByEmail("candidate@test.com").orElse(new User());
        if (testCandidate.getEmail() == null) {
            Role candRole = roleRepository.findByName("CANDIDATE")
                    .orElseThrow(() -> new RuntimeException("Error: Role CANDIDATE is not found."));
            testCandidate.setFullName("John Candidate");
            testCandidate.setEmail("candidate@test.com");
            testCandidate.setRole(candRole);
            testCandidate.setPhone("1234567890");
            testCandidate.setEnabled(true);
            testCandidate.setPassword(passwordEncoder.encode("pass123"));
            userRepository.save(testCandidate);
        }
        
        System.out.println("--------------------------------------------------");
        System.out.println("✅ ADMIN ACCOUNT READY: admin@jobportal.com / admin123");
        System.out.println("✅ TEST CANDIDATE READY: candidate@test.com / pass123");
        System.out.println("--------------------------------------------------");
    }

    private void initRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            roleRepository.save(new Role(null, roleName));
        }
    }
}
