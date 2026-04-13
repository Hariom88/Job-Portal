package com.jobportal.backend.dto;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalUsers;
    private long totalJobs;
    private long totalCompanies;
    private long totalApplications;
    private List<User> recentUsers;
    private List<Job> recentJobs;
}
