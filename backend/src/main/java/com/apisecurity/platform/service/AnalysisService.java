package com.apisecurity.platform.service;

import com.apisecurity.platform.exception.ResourceNotFoundException;
import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.ParsedSpec;
import com.apisecurity.platform.model.ScanResult;
import com.apisecurity.platform.model.User;
import com.apisecurity.platform.model.dto.AnalysisResponse;
import com.apisecurity.platform.model.dto.ScanSummaryDto;
import com.apisecurity.platform.repository.ScanResultRepository;
import com.apisecurity.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalysisService {

    private final SpecParserService parserService;
    private final SecurityRuleEngine ruleEngine;
    private final ScanResultRepository scanResultRepository;
    private final UserRepository userRepository;

    // allowed file types
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "application/json",
            "application/x-yaml",
            "text/yaml",
            "text/x-yaml",
            "application/yaml"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /**
     * Full analysis pipeline:
     * 1. Validate the file
     * 2. Parse the spec
     * 3. Run all security rules
     * 4. Save result to DB
     * 5. Return response DTO
     */
    public AnalysisResponse analyze(MultipartFile file) throws Exception {

        // step 1 — validate
        validateFile(file);

        log.info("Starting analysis for file: {} ({} bytes)",
                file.getOriginalFilename(), file.getSize());

        // step 2 — parse the spec
        ParsedSpec parsedSpec = parserService.parse(file);

        // step 3 — run all security rules
        SecurityReport report = ruleEngine.analyze(parsedSpec);

        // step 4 — save to database
        // for now we use a placeholder user (auth comes in Phase 2)
        // we get or create a demo user so the DB save works
        User demoUser = getOrCreateDemoUser();

        ScanResult savedScan = saveScanResult(
                report, file.getOriginalFilename(), demoUser);

        // step 5 — build and return response DTO
        return buildResponse(savedScan, report);
    }

    /**
     * Get a single scan by ID.
     */
    public AnalysisResponse getScanById(Long scanId) {
        ScanResult scan = scanResultRepository.findById(scanId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scan not found with ID: " + scanId));

        // we need to re-run to get findings since we store counts not full findings
        // in Phase 2 we'll store findings in a separate table
        // for now return what we have in the DB
        return AnalysisResponse.builder()
                .scanId(scan.getId())
                .specTitle(scan.getSpecTitle())
                .specVersion(scan.getSpecVersion())
                .securityScore(scan.getSecurityScore())
                .criticalCount(scan.getCriticalCount())
                .highCount(scan.getHighCount())
                .mediumCount(scan.getMediumCount())
                .lowCount(scan.getLowCount())
                .totalFindings(scan.getTotalFindings())
                .status(scan.getStatus().name())
                .build();
    }

    /**
     * Get all scans — later this will be filtered by user.
     */
    public List<ScanSummaryDto> getAllScans() {
        return scanResultRepository.findAll()
                .stream()
                .map(ScanSummaryDto::from)
                .toList();
    }


    // ── private helpers ───────────────────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "No file provided. Please upload a YAML or JSON file.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File is too large. Maximum size is 5MB.");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null) {
            throw new IllegalArgumentException("File has no name.");
        }

        String lower = originalName.toLowerCase();
        boolean validExtension = lower.endsWith(".yaml")
                || lower.endsWith(".yml")
                || lower.endsWith(".json");

        if (!validExtension) {
            throw new IllegalArgumentException(
                    "Invalid file type. Only .yaml, .yml, and .json files are accepted.");
        }
    }

    private ScanResult saveScanResult(
            SecurityReport report,
            String filename,
            User user) {

        ScanResult scan = ScanResult.builder()
                .user(user)
                .specTitle(report.getSpecTitle() != null
                        ? report.getSpecTitle() : filename)
                .specVersion(report.getSpecVersion() != null
                        ? report.getSpecVersion() : "unknown")
                .status(ScanResult.ScanStatus.COMPLETED)
                .totalFindings(report.getTotalFindings())
                .criticalCount(report.getCriticalCount())
                .highCount(report.getHighCount())
                .mediumCount(report.getMediumCount())
                .lowCount(report.getLowCount())
                .securityScore(report.getSecurityScore())
                .build();

        ScanResult saved = scanResultRepository.save(scan);
        log.info("Scan saved to DB with ID: {}", saved.getId());
        return saved;
    }

    private AnalysisResponse buildResponse(
            ScanResult savedScan,
            SecurityReport report) {

        return AnalysisResponse.builder()
                .scanId(savedScan.getId())
                .specTitle(report.getSpecTitle())
                .specVersion(report.getSpecVersion())
                .totalEndpoints(report.getTotalEndpoints())
                .securityScore(report.getSecurityScore())
                .grade(report.getGrade())
                .criticalCount(report.getCriticalCount())
                .highCount(report.getHighCount())
                .mediumCount(report.getMediumCount())
                .lowCount(report.getLowCount())
                .totalFindings(report.getTotalFindings())
                .findings(report.getFindings())
                .analyzedAt(savedScan.getCreatedAt())
                .status(savedScan.getStatus().name())
                .build();
    }

    /**
     * Temporary placeholder until auth is added in Phase 2.
     * Gets or creates a demo user so scan results can be saved.
     */
    private User getOrCreateDemoUser() {
        return userRepository.findByEmail("demo@specguard.dev")
                .orElseGet(() -> {
                    log.info("Creating demo user for Phase 1");
                    return userRepository.save(User.builder()
                            .email("demo@specguard.dev")
                            .name("Demo User")
                            .password("placeholder-will-be-hashed-in-phase2")
                            .active(true)
                            .build());
                });
    }
}
