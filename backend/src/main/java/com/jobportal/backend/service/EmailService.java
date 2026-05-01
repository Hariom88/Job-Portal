package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("noreply@primejobs.com");
        mailSender.send(message);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Your OTP for Account Verification";
        String body = "Welcome to Prime Jobs!\n\n" +
                      "Your OTP for account verification is: " + otp + "\n" +
                      "This OTP is valid for 10 minutes.\n\n" +
                      "If you didn't request this, please ignore this email.";
        sendEmail(to, subject, body);
    }

    public void sendInterviewInvite(String to, String candidateName, String jobTitle, String companyName, String dateStr, String meetingLink) {
        String subject = "Interview Scheduled: " + jobTitle + " at " + companyName;
        String body = "Hello " + candidateName + ",\n\n" +
                      "We are pleased to inform you that an interview has been scheduled for the " + jobTitle + " position.\n\n" +
                      "Details:\n" +
                      "Company: " + companyName + "\n" +
                      "Date & Time: " + dateStr + "\n" +
                      "Meeting Link: " + meetingLink + "\n\n" +
                      "Good luck!";
        sendEmail(to, subject, body);
    }
}
