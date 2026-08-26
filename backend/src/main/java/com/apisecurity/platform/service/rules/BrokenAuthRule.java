package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * OWASP API2 — Broken Authentication
 *
 * Checks for endpoints that have no authentication requirement.
 * An endpoint with security: [] is explicitly unauthenticated.
 * An endpoint with no security and no global security is also unauthenticated.
 *
 * Some endpoints are legitimately public (login, register, health check).
 * We flag everything and let the developer decide — false positives
 * are better than missed vulnerabilities in security tooling.
 */
@Component
public class BrokenAuthRule implements SecurityRule{

    // these paths are typically intentionally public
    // we still flag them but at MEDIUM instead of CRITICAL
    private static final List<String> TYPICALLY_PUBLIC_PATHS = List.of(
            "/login", "/signin", "/auth", "/register",
            "/signup", "/health", "/ping", "/public"
    );

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        for (var endpoint : spec.getEndpoints()) {

            // skip if authentication is present
            if (Boolean.TRUE.equals(endpoint.getHasAuthentication())) {
                continue;
            }

            boolean isTypicallyPublic = TYPICALLY_PUBLIC_PATHS.stream()
                    .anyMatch(p -> endpoint.getPath()
                            .toLowerCase().contains(p));

            Severity severity = isTypicallyPublic ? Severity.MEDIUM : Severity.CRITICAL;

            String description = isTypicallyPublic
                    ? String.format(
                    "Endpoint %s %s has no authentication. " +
                            "If this endpoint is intentionally public, " +
                            "document it explicitly. If not, add authentication immediately.",
                    endpoint.getMethod(), endpoint.getPath())
                    : String.format(
                    "Endpoint %s %s has no authentication requirement. " +
                            "Any request — authenticated or not — can access this endpoint. " +
                            "This allows attackers to access data or perform actions " +
                            "without any identity verification.",
                    endpoint.getMethod(), endpoint.getPath());

            findings.add(Finding.builder()
                    .endpoint(endpoint.getPath())
                    .method(endpoint.getMethod())
                    .severity(severity)
                    .title("Missing Authentication")
                    .description(description)
                    .fix(buildFix(endpoint.getPath(), endpoint.getMethod()))
                    .owaspCategory("OWASP API2 — Broken Authentication")
                    .detectedBy(getRuleName())
                    .build());
        }

        return findings;
    }

    private String buildFix(String path, String method) {
        return String.format(
                "Add authentication to %s %s. " +
                        "In Spring Security, ensure this path is not in permitAll(). " +
                        "Add @PreAuthorize(\"isAuthenticated()\") to your controller method. " +
                        "In your OpenAPI spec, add a security requirement: " +
                        "security: [{ bearerAuth: [] }]",
                method, path);
    }

    @Override
    public String getRuleName() {
        return "BrokenAuthRule";
    }


}
