package com.apisecurity.platform.service;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.ParsedSpec;
import com.apisecurity.platform.service.rules.SecurityRule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Orchestrates all security rules.
 * Runs every rule against the parsed spec and
 * returns a merged, sorted list of all findings.
 *
 * New rules are registered automatically by Spring
 * because each rule is a @Component and we inject
 * List<SecurityRule> — Spring collects all implementations.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SecurityRuleEngine {

    // Spring automatically injects ALL classes that implement SecurityRule
    // You never need to manually add new rules here — just create
    // a new @Component that implements SecurityRule and it's registered
    private final List<SecurityRule> rules;

    public SecurityReport analyze(ParsedSpec spec) {
        log.info("Starting security analysis. Rules loaded: {}. Endpoints: {}",
                rules.size(), spec.getEndpointCount());

        List<Finding> allFindings = new ArrayList<>();

        for (SecurityRule rule : rules) {
            try {
                List<Finding> findings = rule.check(spec);
                log.debug("Rule '{}' found {} issues",
                        rule.getRuleName(), findings.size());
                allFindings.addAll(findings);
            } catch (Exception e) {
                // one rule failing should not stop the others
                log.error("Rule '{}' threw an exception: {}",
                        rule.getRuleName(), e.getMessage(), e);
            }
        }

        // sort by severity: CRITICAL first, then HIGH, MEDIUM, LOW
        allFindings.sort(
                Comparator.comparingInt(f -> f.getSeverity().ordinal())
        );

        int score = calculateScore(allFindings);

        log.info("Analysis complete. Total findings: {}. Score: {}",
                allFindings.size(), score);

        return SecurityReport.builder()
                .specTitle(spec.getTitle())
                .specVersion(spec.getVersion())
                .totalEndpoints(spec.getEndpointCount())
                .findings(allFindings)
                .securityScore(score)
                .criticalCount(countBySeverity(allFindings, Finding.Severity.CRITICAL))
                .highCount(countBySeverity(allFindings, Finding.Severity.HIGH))
                .mediumCount(countBySeverity(allFindings, Finding.Severity.MEDIUM))
                .lowCount(countBySeverity(allFindings, Finding.Severity.LOW))
                .build();
    }

    /**
     * Score starts at 100 and deductions are made per finding.
     * CRITICAL = -20, HIGH = -10, MEDIUM = -5, LOW = -1
     * Minimum score is 0.
     */
    private int calculateScore(List<Finding> findings) {
        int score = 100;
        for (Finding f : findings) {
            score -= switch (f.getSeverity()) {
                case CRITICAL -> 20;
                case HIGH     -> 10;
                case MEDIUM   ->  5;
                case LOW      ->  1;
            };
        }
        return Math.max(0, score);
    }

    private int countBySeverity(List<Finding> findings, Finding.Severity severity) {
        return (int) findings.stream()
                .filter(f -> f.getSeverity() == severity)
                .count();
    }
}
