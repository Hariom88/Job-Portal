package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    @org.springframework.scheduling.annotation.Async
    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        String cleanFrom = (fromEmail != null) ? fromEmail.trim() : null;
        
        if (cleanFrom == null || cleanFrom.isEmpty() || cleanFrom.contains("your-email")) {
            System.err.println("❌ SMTP ERROR: spring.mail.username is not configured correctly. Current value: " + cleanFrom);
            return;
        }

        try {
            System.out.println("📧 Attempting to send email to: " + to + " using " + cleanFrom);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, isHtml);
            helper.setFrom(cleanFrom); // Simplified From header
            
            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("❌ SMTP ERROR to " + to + ": " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("🔍 CAUSE: " + e.getCause().getMessage());
            }
            e.printStackTrace(); // Log full stack trace to Railway logs
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void sendOtpEmail(String to, String otp) {
        String subject = "Verify your PrimeJobs Account";
        String htmlContent = 
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; color: #1e293b;'>" +
                "<div style='text-align: center; margin-bottom: 30px;'>" +
                    "<div style='background: #2563eb; color: white; width: 40px; height: 40px; line-height: 40px; border-radius: 10px; display: inline-block; font-weight: bold; font-size: 24px;'>J</div>" +
                    "<h2 style='display: inline-block; margin-left: 10px; vertical-align: middle; color: #0f172a; font-weight: 900;'>PrimeJobs</h2>" +
                "</div>" +
                "<h3 style='color: #0f172a; font-weight: 800;'>Verify your account</h3>" +
                "<p style='font-size: 16px; line-height: 1.6; color: #64748b;'>Welcome to the PrimeJobs ecosystem! Use the code below to complete your registration. This code will expire in 10 minutes.</p>" +
                "<div style='background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #cbd5e1;'>" +
                    "<span style='font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #2563eb;'>" + otp + "</span>" +
                "</div>" +
                "<p style='font-size: 13px; color: #94a3b8;'>If you didn't request this code, you can safely ignore this email.</p>" +
                "<hr style='border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;'>" +
                "<p style='text-align: center; font-size: 12px; color: #cbd5e1; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>© 2026 PrimeJobs Ecosystem</p>" +
            "</div>";
            
        sendEmail(to, subject, htmlContent, true);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendInterviewInvite(String to, String candidateName, String jobTitle, String companyName, String dateStr, String meetingLink) {
        String subject = "Interview Scheduled: " + jobTitle;
        String htmlContent = 
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; color: #1e293b;'>" +
                "<h3 style='color: #0f172a;'>Hello " + candidateName + ",</h3>" +
                "<p>Great news! Your interview for <b>" + jobTitle + "</b> at <b>" + companyName + "</b> has been scheduled.</p>" +
                "<div style='background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0;'>" +
                    "<p style='margin: 0;'>📅 <b>Date:</b> " + dateStr + "</p>" +
                    "<p style='margin: 10px 0 0 0;'>🔗 <b>Link:</b> <a href='" + meetingLink + "' style='color: #0284c7;'>" + meetingLink + "</a></p>" +
                "</div>" +
                "<p>We wish you the best of luck!</p>" +
            "</div>";
        sendEmail(to, subject, htmlContent, true);
    }
}
