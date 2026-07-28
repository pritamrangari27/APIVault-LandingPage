package com.apisecurity.platform.service;

import com.apisecurity.platform.model.EndpointInfo;
import com.apisecurity.platform.model.ParsedSpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Paths;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class SpecParserServiceTest {

    private SpecParserService parserService;

    @BeforeEach
    void setUp() {
        parserService = new SpecParserService();
    }

    @Test
    @DisplayName("Should parse valid spec and extract correct number of endpoints")
    void shouldParseValidSpec() throws Exception {
        String content = loadSampleSpec("vulnerable-api.yml");

        ParsedSpec result = parserService.parseContent(content);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Vulnerable Banking API");
        assertThat(result.getEndpoints()).hasSize(4);
    }

    @Test
    @DisplayName("Should detect endpoint with no authentication")
    void shouldDetectUnauthenticatedEndpoint() throws Exception {
        String content = loadSampleSpec("vulnerable-api.yml");

        ParsedSpec result = parserService.parseContent(content);

        // /users/{id} has security: [] — should be flagged as no auth
        EndpointInfo getUsersById = result.getEndpoints().stream()
                .filter(e -> e.getPath().equals("/users/{id}")
                        && e.getMethod().equals("GET"))
                .findFirst()
                .orElseThrow();

        assertThat(getUsersById.getHasAuthentication()).isFalse();
    }

    @Test
    @DisplayName("Should extract response field names including sensitive ones")
    void shouldExtractResponseFields() throws Exception {
        String content = loadSampleSpec("vulnerable-api.yml");

        ParsedSpec result = parserService.parseContent(content);

        EndpointInfo getUsersById = result.getEndpoints().stream()
                .filter(e -> e.getPath().equals("/users/{id}")
                        && e.getMethod().equals("GET"))
                .findFirst()
                .orElseThrow();

        var responseFields = getUsersById
                .getResponses().get("200").getFieldNames();

        assertThat(responseFields)
                .contains("password", "passwordHash", "ssn");
    }

    @Test
    @DisplayName("Should extract request body fields including dangerous ones")
    void shouldExtractRequestBodyFields() throws Exception {
        String content = loadSampleSpec("vulnerable-api.yml");

        ParsedSpec result = parserService.parseContent(content);

        EndpointInfo createUser = result.getEndpoints().stream()
                .filter(e -> e.getPath().equals("/users")
                        && e.getMethod().equals("POST"))
                .findFirst()
                .orElseThrow();

        assertThat(createUser.getRequestBodyFields())
                .contains("role", "isAdmin");
    }

    @Test
    @DisplayName("Should detect HTTP server URL")
    void shouldDetectHttpServerUrl() throws Exception {
        String content = loadSampleSpec("vulnerable-api.yml");

        ParsedSpec result = parserService.parseContent(content);

        assertThat(result.getServerUrls())
                .anyMatch(url -> url.startsWith("http://"));
    }

    @Test
    @DisplayName("Should throw exception for invalid spec content")
    void shouldThrowForInvalidSpec() {
        String garbage = "this is not a valid openapi spec !!@@##";

        assertThatThrownBy(() -> parserService.parseContent(garbage))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid OpenAPI spec");
    }

    // helper to load the sample file from resources
    private String loadSampleSpec(String filename) throws Exception {
        var url = getClass().getClassLoader()
                .getResource("samples/" + filename);
        assertThat(url).isNotNull();
        return Files.readString(Paths.get(url.toURI()));
    }
}
