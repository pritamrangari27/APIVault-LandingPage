package com.apisecurity.platform.integration;

import com.apisecurity.platform.model.ScanResult;
import com.apisecurity.platform.repository.ScanResultRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full end-to-end integration test.
 *
 * @SpringBootTest starts the complete application context.
 * @ActiveProfiles("test") uses application-test.yml config.
 *
 * This test proves the entire Phase 1 pipeline works:
 * file upload → parser → rule engine → DB save → response
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AnalysisPipelineIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ScanResultRepository scanResultRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Full pipeline: upload vulnerable spec → get security report with findings")
    void fullPipeline_vulnerableSpec_returnsReportWithFindings() throws Exception {

        // load the real vulnerable spec from resources
        var specUrl = getClass().getClassLoader()
                .getResource("samples/vulnerable-api.yml");
        assertThat(specUrl).isNotNull();
        byte[] specBytes = Files.readAllBytes(Paths.get(specUrl.toURI()));

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "vulnerable-api.yml",
                "application/x-yml",
                specBytes
        );

        // call the real endpoint
        MvcResult result = mockMvc.perform(
                        multipart("/api/v1/analyze").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.scanId").exists())
                .andExpect(jsonPath("$.data.specTitle")
                        .value("Vulnerable Banking API"))
                .andExpect(jsonPath("$.data.findings").isArray())
                .andExpect(jsonPath("$.data.grade").exists())
                .andReturn();

        // parse the response
        String json = result.getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);
        JsonNode data = root.get("data");

        // assert score is low — this is a very insecure spec
        int score = data.get("securityScore").asInt();
        assertThat(score).isLessThan(50);

        // assert multiple findings were found
        int totalFindings = data.get("totalFindings").asInt();
        assertThat(totalFindings).isGreaterThan(5);

        // assert critical findings exist
        int criticalCount = data.get("criticalCount").asInt();
        assertThat(criticalCount).isGreaterThan(0);

        // assert the scan was saved to the real database
        Long scanId = data.get("scanId").asLong();
        assertThat(scanResultRepository.findById(scanId)).isPresent();

        ScanResult savedScan = scanResultRepository.findById(scanId).get();
        assertThat(savedScan.getStatus())
                .isEqualTo(ScanResult.ScanStatus.COMPLETED);
        assertThat(savedScan.getSecurityScore()).isEqualTo(score);
    }

    @Test
    @DisplayName("Upload invalid file type → returns 400 bad request")
    void uploadInvalidFileType_returns400() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "document.pdf",
                "application/pdf",
                "not a spec".getBytes()
        );

        mockMvc.perform(multipart("/api/v1/analyze").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Invalid file type. Only .yaml, " +
                                ".yml, and .json files are accepted."));
    }

    @Test
    @DisplayName("Upload empty file → returns 400 bad request")
    void uploadEmptyFile_returns400() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.yml",
                "application/x-yml",
                new byte[0]
        );

        mockMvc.perform(multipart("/api/v1/analyze").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("Upload garbage content → returns 400 with parse error")
    void uploadGarbageContent_returns400() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "garbage.yml",
                "application/x-yml",
                "this is not yaml !!!@@@###".getBytes()
        );

        mockMvc.perform(multipart("/api/v1/analyze").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /health returns 200 with UP")
    void healthCheck_returns200() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("UP"));
    }

    @Test
    @DisplayName("GET /scans returns list — possibly empty")
    void getScans_returns200() throws Exception {
        mockMvc.perform(get("/api/v1/scans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("GET /scans/{id} with nonexistent ID returns 404")
    void getScanByNonexistentId_returns404() throws Exception {
        mockMvc.perform(get("/api/v1/scans/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
