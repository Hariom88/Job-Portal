package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:hariomdubey906@gmail.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:PrimeJobs}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();

    @jakarta.annotation.PostConstruct
    public void init() {
        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            System.err.println("⚠️ WARNING: BREVO_API_KEY is not set! Emails will NOT be sent.");
        } else {
            System.out.println("✅ Email Service (Brevo) initialized. Sender: " + senderEmail);
        }
    }

    @Async
    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        if (brevoApiKey == null || brevoApiKey.isEmpty()) {
            System.err.println("❌ Email NOT sent: BREVO_API_KEY is missing.");
            return;
        }

        try {
            System.out.println("📧 Sending email via Brevo to: " + to);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", senderName);
            sender.put("email", senderEmail);

            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", to);

            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", sender);
            payload.put("to", List.of(recipient));
            payload.put("subject", subject);
            if (isHtml) {
                payload.put("htmlContent", body);
            } else {
                payload.put("textContent", body);
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.brevo.com/v3/smtp/email", request, String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Email sent successfully to: " + to);
            } else {
                System.err.println("❌ Brevo API error: " + response.getStatusCode() + " - " + response.getBody());
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("🔍 CAUSE: " + e.getCause().getMessage());
            }
        }
    }

    @Async
    public void sendOtpEmail(String to, String otp) {
        String subject = "Verify your PrimeJobs Account";
        String htmlContent =
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; color: #1e293b;'>" +
                "<div style='text-align: center; margin-bottom: 30px;'>" +
                    "<div style='background: #2563eb; color: white; width: 40px; height: 40px; line-height: 40px; border-radius: 10px; display: inline-block; font-weight: bold; font-size: 24px;'>J</div>" +
                    "<h2 style='display: inline-block; margin-left: 10px; vertical-align: middle; color: #0f172a; font-weight: 900;'>PrimeJobs</h2>" +
                "</div>" +
                "<h3 style='color: #0f172a; font-weight: 800;'>Verify your account</h3>" +
                "<p style='font-size: 16px; line-height: 1.6; color: #64748b;'>Use the code below to complete your registration. This code expires in 10 minutes.</p>" +
                "<div style='background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #cbd5e1;'>" +
                    "<span style='font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #2563eb;'>" + otp + "</span>" +
                "</div>" +
                "<p style='font-size: 13px; color: #94a3b8;'>If you didn't request this, ignore this email.</p>" +
                "<hr style='border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;'>" +
                "<p style='text-align: center; font-size: 12px; color: #cbd5e1; font-weight: bold; letter-spacing: 1px;'>© 2026 PrimeJobs Ecosystem</p>" +
            "</div>";
        sendEmail(to, subject, htmlContent, true);
    }

    @Async
    public void sendInterviewInvite(String to, String candidateName, String jobTitle, String companyName, String dateStr, String meetingLink) {
        String subject = "Interview Scheduled: " + jobTitle;
        String htmlContent =
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; color: #1e293b;'>" +
                "<h3 style='color: #0f172a;'>Hello " + candidateName + ",</h3>" +
                "<p>Your interview for <b>" + jobTitle + "</b> at <b>" + companyName + "</b> has been scheduled.</p>" +
                "<div style='background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;'>" +
                    "<p style='margin: 0;'>📅 <b>Date:</b> " + dateStr + "</p>" +
                    "<p style='margin: 10px 0 0 0;'>🔗 <b>Link:</b> <a href='" + meetingLink + "' style='color: #0284c7;'>" + meetingLink + "</a></p>" +
                "</div>" +
                "<p>Best of luck!</p>" +
            "</div>";
        sendEmail(to, subject, htmlContent, true);
    }
}
