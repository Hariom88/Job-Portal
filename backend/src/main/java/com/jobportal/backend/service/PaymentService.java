package com.jobportal.backend.service;

import com.jobportal.backend.model.Company;
import com.jobportal.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private CompanyRepository companyRepository;

    public Map<String, String> processSubscription(Long companyId, String planType) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Simulate Razorpay/Stripe API call
        // String paymentId = "PAY_" + java.util.UUID.randomUUID().toString();
        
        int credits = 0;
        if (planType.equals("PREMIUM")) credits = 50;
        else if (planType.equals("ENTERPRISE")) credits = 500;
        else credits = 5;

        company.setPlan(planType);
        company.setJobCredits(company.getJobCredits() + credits);
        company.setSubscriptionExpiry(LocalDateTime.now().plusMonths(1));
        
        companyRepository.save(company);

        return Map.of(
            "status", "SUCCESS",
            "message", "Subscription updated to " + planType,
            "newCredits", String.valueOf(company.getJobCredits())
        );
    }
}
