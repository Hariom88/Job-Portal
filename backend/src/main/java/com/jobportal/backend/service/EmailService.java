package com.jobportal.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendInterviewInvite(String toEmail, String candidateName, String jobTitle, String companyName, String scheduledTime, String meetingLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Interview Invitation: " + jobTitle + " at " + companyName);
        
        String body = String.format("Dear %s,\n\n" +
                "Congratulations! You have been invited for an interview for the position of %s at %s.\n\n" +
                "Date & Time: %s\n" +
                "Meeting Link: %s\n\n" +
                "Please make sure to join on time.\n\n" +
                "Best regards,\nPrimeJobs Team",
                candidateName, jobTitle, companyName, scheduledTime, meetingLink);

        message.setText(body);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
