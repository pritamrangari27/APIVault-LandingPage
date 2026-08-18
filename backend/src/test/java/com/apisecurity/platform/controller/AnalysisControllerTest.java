package com.apisecurity.platform.controller;

import com.apisecurity.platform.model.dto.AnalysisResponse;
import com.apisecurity.platform.service.AnalysisService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalysisController.class)
public class AnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AnalysisService analysisService;

    @Test
    @DisplayName("GET /health should return 200 with UP status")
    void healthShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("UP"));
    }

    @Test
    @DisplayName("POST /analyze with valid YAML file should return 201")
    void analyzeShouldReturn201WithValidFile() throws Exception {

        // mock the service response
        AnalysisResponse mockResponse = AnalysisResponse.builder()
                .scanId(1L)
                .specTitle("Test API")
                .securityScore(60)
                .grade("C")
                .totalFindings(3)
                .criticalCount(1)
                .highCount(1)
                .mediumCount(1)
                .findings(List.of())
                .build();

        when(analysisService.analyze(any())).thenReturn(mockResponse);

        // create a fake YAML file
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-api.yaml",
                "application/x-yaml",
                "openapi: 3.0.0".getBytes()
        );

        mockMvc.perform(multipart("/api/v1/analyze").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.scanId").value(1))
                .andExpect(jsonPath("$.data.grade").value("C"))
                .andExpect(jsonPath("$.data.securityScore").value(60));
    }

    @Test
    @DisplayName("POST /analyze without file should return 400")
    void analyzeShouldReturn400WithoutFile() throws Exception {
        mockMvc.perform(post("/api/v1/analyze"))
                .andExpect(status().isBadRequest());
    }

}
