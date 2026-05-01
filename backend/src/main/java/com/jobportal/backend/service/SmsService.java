package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SmsService {

    @Value("${two.factor.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtp(String phoneNumber, String otp) {
        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("2Factor API Key is missing! OTP for " + phoneNumber + " is: " + otp);
            return;
        }

        try {
            // 2Factor API format: https://2factor.in/API/V1/{api_key}/SMS/{phone_number}/{otp}/OTPSMS
            String url = String.format("https://2factor.in/API/V1/%s/SMS/%s/%s/OTPSMS", apiKey, phoneNumber, otp);
            restTemplate.getForEntity(url, String.class);
            System.out.println("OTP sent via 2Factor to: " + phoneNumber);
        } catch (Exception e) {
            System.err.println("Failed to send SMS via 2Factor: " + e.getMessage());
        }
    }
}
