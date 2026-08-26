package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Checks server URLs defined in the spec.
 * Any http:// URL in production is a critical issue —
 * all traffic is transmitted in plaintext.
 */
@Component
public class MissingHTTPSRule implements SecurityRule {

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        List<String> insecureUrls = spec.getServerUrls().stream()
                .filter(url -> url.startsWith("http://"))
                .filter(url -> !isLocalhost(url))  // localhost http is fine
                .collect(Collectors.toList());

        // also flag localhost separately at LOW severity
        List<String> localhostUrls = spec.getServerUrls().stream()
                .filter(url -> url.startsWith("http://"))
                .filter(this::isLocalhost)
                .collect(Collectors.toList());

        if (!insecureUrls.isEmpty()) {
            findings.add(Finding.builder()
                    .endpoint("servers[]")
                    .method("N/A")
                    .severity(Severity.CRITICAL)
                    .title("Production Server Uses HTTP Instead of HTTPS")
                    .description(String.format(
                            "The spec defines non-localhost server URLs using HTTP: %s. " +
                                    "HTTP transmits all data in plaintext. " +
                                    "Attackers on the same network can intercept tokens, " +
                                    "passwords, and sensitive data through a man-in-the-middle attack.",
                            String.join(", ", insecureUrls)))
                    .fix(
                            "1. Change all server URLs from http:// to https://\n" +
                                    "2. Configure TLS/SSL on your server\n" +
                                    "3. Add HTTP → HTTPS redirect so old links still work\n" +
                                    "4. Set HSTS header: Strict-Transport-Security: " +
                                    "max-age=31536000; includeSubDomains\n" +
                                    "5. On Azure: TLS is handled by App Gateway or AKS Ingress " +
                                    "with cert-manager + Let's Encrypt")
                    .owaspCategory("OWASP API7 — Security Misconfiguration")
                    .detectedBy(getRuleName())
                    .build());
        }

        if (!localhostUrls.isEmpty()) {
            findings.add(Finding.builder()
                    .endpoint("servers[]")
                    .method("N/A")
                    .severity(Severity.LOW)
                    .title("Localhost HTTP Server URL Present in Spec")
                    .description(
                            "The spec contains localhost HTTP URLs. " +
                                    "This is fine for development but ensure production " +
                                    "server URLs use HTTPS before deploying.")
                    .fix(
                            "Add a separate server entry for production with https://. " +
                                    "Use OpenAPI server variables to manage " +
                                    "multiple environments cleanly.")
                    .owaspCategory("OWASP API7 — Security Misconfiguration")
                    .detectedBy(getRuleName())
                    .build());
        }

        return findings;
    }

    private boolean isLocalhost(String url) {
        return url.contains("localhost") || url.contains("127.0.0.1");
    }

    @Override
    public String getRuleName() {
        return "MissingHTTPSRule";
    }
}
