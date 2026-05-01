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
        User admin = userRepository.findByEmail("hariomdubey906@gmail.com").orElse(new User());
        if (admin.getEmail() == null) {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
            admin.setFullName("Hariom Dubey");
            admin.setEmail("hariomdubey906@gmail.com");
            admin.setRole(adminRole);
            admin.setPhone("8874000000");
            admin.setEnabled(true);
            admin.setVerified(true);
        }
        // Always reset password and ensure enabled
        admin.setEnabled(true);
        admin.setPassword(passwordEncoder.encode("Hariom@8874"));
        userRepository.save(admin);

        System.out.println("✅ ADMIN ACCOUNT READY: hariomdubey906@gmail.com / Hariom@8874");
    }

    private void initRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            roleRepository.save(new Role(null, roleName));
        }
    }
}
