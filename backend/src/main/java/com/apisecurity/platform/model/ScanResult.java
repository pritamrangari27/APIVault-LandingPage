package com.apisecurity.platform.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "scan_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which user uploaded this spec
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false, length = 255)
    private String specTitle;      // the "title" field from inside the OpenAPI spec

    @Column(nullable = false, length = 255)
    private String specVersion;    // the "version" field from inside the spec

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)   // stores "PENDING" or "COMPLETED" as text in DB
    @Builder.Default
    private ScanStatus status = ScanStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String filePath;       // where we stored the uploaded file

    @Column
    private Integer totalFindings;

    @Column
    private Integer criticalCount;

    @Column
    private Integer highCount;

    @Column
    private Integer mediumCount;

    @Column
    private Integer lowCount;

    @Column
    private Integer securityScore;  // 0-100

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // enum defined inside the same file — it belongs to ScanResult
    public enum ScanStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }
}
