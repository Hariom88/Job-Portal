package com.jobportal.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewDTO {
    private Long applicationId;
    private LocalDateTime scheduledAt;
    private String meetingLink;
    private String notes;
}
