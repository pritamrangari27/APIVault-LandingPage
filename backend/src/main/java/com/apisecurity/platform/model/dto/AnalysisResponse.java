package com.apisecurity.platform.model.dto;

import com.apisecurity.platform.model.Finding;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * What the client receives after analysis.
 * Clean DTO — never expose internal classes directly.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {

    // scan metadata
    private Long scanId;
    private String specTitle;
    private String specVersion;
    private int totalEndpoints;

    // score summary
    private int securityScore;   // 0-100
    private String grade;        // A, B, C, D, F

    // finding counts per severity
    private int criticalCount;
    private int highCount;
    private int mediumCount;
    private int lowCount;
    private int totalFindings;

    // the actual findings list
    private List<Finding> findings;

    // when was this analysed
    private LocalDateTime analyzedAt;

    // status of this scan
    private String status;
}
