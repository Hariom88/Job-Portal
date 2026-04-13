package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data
@AllArgsConstructor
public class AdminReportsDTO {
    private Map<String, Long> userGrowth; // Date/Month -> Count
    private Map<String, Long> jobsByIndustry;
    private Map<String, Long> applicationsStatus;
}
