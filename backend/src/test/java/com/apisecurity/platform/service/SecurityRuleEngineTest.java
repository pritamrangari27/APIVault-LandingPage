package com.apisecurity.platform.service;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.ParsedSpec;
import com.apisecurity.platform.service.rules.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class SecurityRuleEngineTest {

    private SecurityRuleEngine engine;
    private SpecParserService parserService;

    @BeforeEach
    void setUp() {
        parserService = new SpecParserService();

        // manually wire all rules — no Spring context needed in unit tests
        engine = new SecurityRuleEngine(List.of(
                new BrokenAuthRule(),
                new ExcessiveDataExposureRule(),
                new MissingRateLimitRule(),
                new SQLInjectionRiskRule(),
                new MassAssignmentRule(),
                new MissingHTTPSRule(),
                new BOLARule(),
                new WeakJWTRule()
        ));
    }

    @Test
    @DisplayName("Should detect multiple vulnerabilities in the vulnerable spec")
    void shouldDetectVulnerabilities() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        assertThat(report.getFindings()).isNotEmpty();
        assertThat(report.getCriticalCount()).isGreaterThan(0);
        assertThat(report.getSecurityScore()).isLessThan(50); // very insecure spec
    }

    @Test
    @DisplayName("Should detect broken auth on unauthenticated endpoint")
    void shouldDetectBrokenAuth() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        boolean hasBrokenAuth = report.getFindings().stream()
                .anyMatch(f -> f.getOwaspCategory()
                        .contains("Broken Authentication"));

        assertThat(hasBrokenAuth).isTrue();
    }

    @Test
    @DisplayName("Should detect sensitive data in response")
    void shouldDetectSensitiveData() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        boolean hasSensitiveData = report.getFindings().stream()
                .anyMatch(f -> f.getTitle()
                        .contains("Sensitive Data Exposure"));

        assertThat(hasSensitiveData).isTrue();
    }

    @Test
    @DisplayName("Should detect BOLA on endpoint with ID path param")
    void shouldDetectBOLA() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        boolean hasBOLA = report.getFindings().stream()
                .anyMatch(f -> f.getTitle().contains("BOLA"));

        assertThat(hasBOLA).isTrue();
    }

    @Test
    @DisplayName("Should detect mass assignment risk")
    void shouldDetectMassAssignment() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        boolean hasMassAssignment = report.getFindings().stream()
                .anyMatch(f -> f.getTitle().contains("Mass Assignment"));

        assertThat(hasMassAssignment).isTrue();
    }

    @Test
    @DisplayName("Should detect HTTP server URL")
    void shouldDetectHTTPServer() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        boolean hasHTTPIssue = report.getFindings().stream()
                .anyMatch(f -> f.getTitle().contains("HTTP"));

        assertThat(hasHTTPIssue).isTrue();
    }

    @Test
    @DisplayName("Findings should be sorted CRITICAL first")
    void findingsShouldBeSortedBySeverity() throws Exception {
        ParsedSpec spec = parseVulnerableSpec();

        SecurityReport report = engine.analyze(spec);

        List<Finding> findings = report.getFindings();
        if (findings.size() > 1) {
            // first finding should be CRITICAL or equal to or worse than last
            int firstOrdinal = findings.get(0).getSeverity().ordinal();
            int lastOrdinal  = findings.get(findings.size() - 1)
                    .getSeverity().ordinal();
            assertThat(firstOrdinal).isLessThanOrEqualTo(lastOrdinal);
        }
    }

    @Test
    @DisplayName("Score should be 100 for a spec with no issues")
    void shouldReturn100ForCleanSpec() {
        // build a clean spec with no endpoints
        ParsedSpec cleanSpec = ParsedSpec.builder()
                .title("Clean API")
                .version("1.0.0")
                .build();

        SecurityReport report = engine.analyze(cleanSpec);

        assertThat(report.getSecurityScore()).isEqualTo(100);
        assertThat(report.getFindings()).isEmpty();
        assertThat(report.getGrade()).isEqualTo("A");
    }

    private ParsedSpec parseVulnerableSpec() throws Exception {
        var url = getClass().getClassLoader()
                .getResource("samples/vulnerable-api.yml");
        String content = Files.readString(Paths.get(url.toURI()));
        return parserService.parseContent(content);
    }
}
