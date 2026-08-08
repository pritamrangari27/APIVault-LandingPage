package com.apisecurity.platform.service;

import com.apisecurity.platform.model.Finding;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityReport {

    private String specTitle;
    private String specVersion;
    private int totalEndpoints;
    private List<Finding> findings;
    private int securityScore;      // 0-100

    private int criticalCount;
    private int highCount;
    private int mediumCount;
    private int lowCount;

    @Builder.Default
    private LocalDateTime analyzedAt = LocalDateTime.now();

    // letter grade based on score
    public String getGrade() {
        if (securityScore >= 90) return "A";
        if (securityScore >= 75) return "B";
        if (securityScore >= 60) return "C";
        if (securityScore >= 40) return "D";
        return "F";
    }

    public int getTotalFindings() {
        return findings != null ? findings.size() : 0;
    }
}
