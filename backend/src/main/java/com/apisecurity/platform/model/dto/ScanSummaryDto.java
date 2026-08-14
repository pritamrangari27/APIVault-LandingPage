package com.apisecurity.platform.model.dto;

import com.apisecurity.platform.model.ScanResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Clean DTO for scan list responses.
 * Never expose raw JPA entities — they carry
 * Hibernate proxies that break JSON serialization.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanSummaryDto {

    private Long id;
    private String specTitle;
    private String specVersion;
    private Integer securityScore;
    private String grade;
    private Integer totalFindings;
    private Integer criticalCount;
    private Integer highCount;
    private Integer mediumCount;
    private Integer lowCount;
    private String status;
    private LocalDateTime createdAt;

    // static factory — converts entity to DTO cleanly
    public static ScanSummaryDto from(ScanResult scan) {
        String grade = scoreToGrade(scan.getSecurityScore());
        return ScanSummaryDto.builder()
                .id(scan.getId())
                .specTitle(scan.getSpecTitle())
                .specVersion(scan.getSpecVersion())
                .securityScore(scan.getSecurityScore())
                .grade(grade)
                .totalFindings(scan.getTotalFindings())
                .criticalCount(scan.getCriticalCount())
                .highCount(scan.getHighCount())
                .mediumCount(scan.getMediumCount())
                .lowCount(scan.getLowCount())
                .status(scan.getStatus().name())
                .createdAt(scan.getCreatedAt())
                .build();
    }

    private static String scoreToGrade(Integer score) {
        if (score == null) return "N/A";
        if (score >= 90) return "A";
        if (score >= 75) return "B";
        if (score >= 60) return "C";
        if (score >= 40) return "D";
        return "F";
    }
}
