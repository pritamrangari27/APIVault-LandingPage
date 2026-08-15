package com.apisecurity.platform.controller;

import com.apisecurity.platform.model.ApiResponse;
import com.apisecurity.platform.model.dto.AnalysisResponse;
import com.apisecurity.platform.model.dto.ScanSummaryDto;
import com.apisecurity.platform.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller for API security analysis.
 *
 * All endpoints are under /api/v1 — versioning from day one
 * means you can add /api/v2 later without breaking existing clients.
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class AnalysisController {

    private final AnalysisService analysisService;

    /**
     * POST /api/v1/analyze
     *
     * Accepts a multipart file upload (the OpenAPI spec).
     * Returns a full security report.
     *
     * How to call this in Postman:
     * - Method: POST
     * - URL: http://localhost:8080/api/v1/analyze
     * - Body: form-data
     * - Key: file (type: File)
     * - Value: select your .yaml or .json file
     */
    @PostMapping(value = "/analyze")
    public ResponseEntity<ApiResponse<AnalysisResponse>> analyze(
            @RequestParam("file") MultipartFile file) {

        log.info("Received analyze request. File: {}, Size: {} bytes",
                file.getOriginalFilename(), file.getSize());

        try {
            AnalysisResponse response = analysisService.analyze(file);

            log.info("Analysis complete. Scan ID: {}, Score: {}, Grade: {}",
                    response.getScanId(),
                    response.getSecurityScore(),
                    response.getGrade());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success(
                            "Analysis complete", response));

        } catch (IllegalArgumentException ex) {
            // validation errors — return 400
            log.warn("Validation error: {}", ex.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(ex.getMessage()));

        } catch (Exception ex) {
            // unexpected errors — return 500
            log.error("Analysis failed: {}", ex.getMessage(), ex);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(
                            "Analysis failed. Please check your file and try again."));
        }
    }

    /**
     * GET /api/v1/scans/{id}
     *
     * Returns details of a specific past scan.
     */
    @GetMapping("/scans/{id}")
    public ResponseEntity<ApiResponse<AnalysisResponse>> getScan(
            @PathVariable Long id) {

        log.info("Fetching scan ID: {}", id);

        AnalysisResponse response = analysisService.getScanById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Scan retrieved", response));
    }

    /**
     * GET /api/v1/scans
     *
     * Returns all past scans (will be filtered by user in Phase 2).
     */
    @GetMapping("/scans")
    public ResponseEntity<ApiResponse<List<ScanSummaryDto>>> getAllScans() {

        List<ScanSummaryDto> scans = analysisService.getAllScans();
        return ResponseEntity.ok(
                ApiResponse.success("Found " + scans.size() + " scans", scans));
    }

    /**
     * GET /api/v1/health
     *
     * Simple health check. Returns 200 if the app is running.
     * Used by Kubernetes probes later.
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(
                ApiResponse.success("Service is running", "UP"));
    }
}
