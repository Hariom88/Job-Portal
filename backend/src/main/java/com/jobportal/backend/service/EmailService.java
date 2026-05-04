package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("✅ Email Service initialized. Sender: " + fromEmail);
    }

    @Async
    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        try {
            System.out.println("📧 Sending email to: " + to + " from: " + fromEmail);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, isHtml);
            helper.setFrom(fromEmail);
            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Email failed to: " + to + " | Error: " + e.getMessage());
            e.printStackTrace();
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
                "<p style='text-align: center; font-size: 12px; color: #cbd5e1; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;'>© 2026 PrimeJobs Ecosystem</p>" +
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
