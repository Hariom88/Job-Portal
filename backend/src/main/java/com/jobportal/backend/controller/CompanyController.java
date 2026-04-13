package com.jobportal.backend.controller;

import com.jobportal.backend.model.Company;
import com.jobportal.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping("/setup")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Company> setupProfile(@RequestBody Company company) {
        return ResponseEntity.ok(companyRepository.save(company));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getProfile(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/owner/{userId}")
    public ResponseEntity<Company> getProfileByOwner(@PathVariable Long userId) {
        return companyRepository.findByOwnerId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
