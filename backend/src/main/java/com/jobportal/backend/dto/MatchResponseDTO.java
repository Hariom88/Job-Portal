package com.jobportal.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class MatchResponseDTO {
    private Double match_percentage;
    private List<String> extracted_skills;
    private List<String> matched_skills;
    private List<String> missing_skills;
}
