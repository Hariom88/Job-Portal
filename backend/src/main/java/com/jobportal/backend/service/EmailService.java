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
}
