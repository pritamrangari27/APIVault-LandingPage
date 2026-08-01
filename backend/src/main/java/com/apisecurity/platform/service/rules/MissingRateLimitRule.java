package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * OWASP API4 — Lack of Resources and Rate Limiting
 *
 * Without rate limiting, an attacker can:
 * - Brute-force login endpoints
 * - Enumerate user IDs
 * - Cause denial of service
 * - Mine data by calling list endpoints repeatedly
 *
 * We check for x-ratelimit extension on the operation,
 * and apply higher severity to sensitive endpoints
 * like login, auth, and search.
 */
@Component
public class MissingRateLimitRule implements SecurityRule {

    // these endpoints are highest risk without rate limiting
    private static final List<String> HIGH_RISK_PATHS = List.of(
            "/login", "/signin", "/auth",
            "/password", "/reset", "/verify",
            "/register", "/signup", "/token"
    );

    // these methods on any endpoint are high risk without rate limiting
    private static final List<String> HIGH_RISK_METHODS = List.of(
            "POST", "PUT", "PATCH", "DELETE"
    );

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        for (var endpoint : spec.getEndpoints()) {

            // already has rate limit defined — skip
            if (endpoint.isHasRateLimit()) {
                continue;
            }

            boolean isHighRiskPath = HIGH_RISK_PATHS.stream()
                    .anyMatch(p -> endpoint.getPath()
                            .toLowerCase().contains(p));

            boolean isHighRiskMethod = HIGH_RISK_METHODS
                    .contains(endpoint.getMethod().toUpperCase());

            // GET endpoints on non-sensitive paths are lower risk
            Severity severity;
            if (isHighRiskPath) {
                severity = Severity.CRITICAL;
            } else if (isHighRiskMethod) {
                severity = Severity.HIGH;
            } else {
                severity = Severity.MEDIUM;
            }

            findings.add(Finding.builder()
                    .endpoint(endpoint.getPath())
                    .method(endpoint.getMethod())
                    .severity(severity)
                    .title("Missing Rate Limiting")
                    .description(String.format(
                            "Endpoint %s %s has no rate limiting defined. " +
                                    "Without rate limiting, attackers can send unlimited " +
                                    "requests. %s",
                            endpoint.getMethod(),
                            endpoint.getPath(),
                            isHighRiskPath
                                    ? "This is a sensitive authentication endpoint — " +
                                    "brute force attacks are especially dangerous here."
                                    : "This could be used for data scraping or " +
                                    "denial-of-service attacks."))
                    .fix(
                            "Add rate limiting in multiple layers:\n" +
                                    "1. In your OpenAPI spec, add extension: " +
                                    "x-ratelimit: { requests: 10, period: '1m' }\n" +
                                    "2. In Spring Boot, use Bucket4j with Redis: " +
                                    "@RateLimiter annotation on the controller method\n" +
                                    "3. At the infrastructure level, configure rate limits " +
                                    "in Azure API Management or NGINX Ingress")
                    .owaspCategory("OWASP API4 — Lack of Resources and Rate Limiting")
                    .detectedBy(getRuleName())
                    .build());
        }

        return findings;
    }

    @Override
    public String getRuleName() {
        return "MissingRateLimitRule";
    }
}
