package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Checks JWT security scheme configuration.
 * Flags missing bearerFormat, or schemes that suggest
 * weak configuration.
 */
@Component
public class WeakJWTRule implements SecurityRule {

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        // check if HTTP bearer auth is defined without JWT format specified
        spec.getSecuritySchemes().forEach((name, type) -> {
            if ("http".equalsIgnoreCase(type)) {
                // bearerFormat not exposed in our current model
                // flag any http bearer scheme for manual review
                findings.add(Finding.builder()
                        .endpoint("components/securitySchemes/" + name)
                        .method("N/A")
                        .severity(Severity.MEDIUM)
                        .title("JWT Security Scheme Needs Review")
                        .description(String.format(
                                "Security scheme '%s' uses HTTP Bearer authentication. " +
                                        "Verify that:\n" +
                                        "- bearerFormat is set to JWT in your spec\n" +
                                        "- Tokens are signed with RS256 or ES256 (not HS256 " +
                                        "with a weak secret)\n" +
                                        "- Token expiry is set (exp claim)\n" +
                                        "- Tokens are validated on every request",
                                name))
                        .fix(
                                "In your OpenAPI spec, ensure:\n" +
                                        "  bearerAuth:\n" +
                                        "    type: http\n" +
                                        "    scheme: bearer\n" +
                                        "    bearerFormat: JWT\n\n" +
                                        "In Spring Boot:\n" +
                                        "- Use RS256 with a proper key pair\n" +
                                        "- Set expiry to 15-60 minutes\n" +
                                        "- Validate signature, expiry, and issuer on every request\n" +
                                        "- Implement refresh token rotation")
                        .owaspCategory("OWASP API2 — Broken Authentication")
                        .detectedBy(getRuleName())
                        .build());
            }
        });

        // flag if no security schemes are defined at all
        if (spec.getSecuritySchemes().isEmpty()
                && !spec.getEndpoints().isEmpty()) {
            findings.add(Finding.builder()
                    .endpoint("components/securitySchemes")
                    .method("N/A")
                    .severity(Severity.HIGH)
                    .title("No Security Schemes Defined")
                    .description(
                            "The spec defines endpoints but declares no security schemes. " +
                                    "This means no authentication mechanism is documented. " +
                                    "Either authentication is completely missing, or the spec " +
                                    "is incomplete.")
                    .fix(
                            "Add a security scheme to your spec under components:\n" +
                                    "  securitySchemes:\n" +
                                    "    bearerAuth:\n" +
                                    "      type: http\n" +
                                    "      scheme: bearer\n" +
                                    "      bearerFormat: JWT\n\n" +
                                    "Then apply it globally:\n" +
                                    "  security:\n" +
                                    "    - bearerAuth: []")
                    .owaspCategory("OWASP API2 — Broken Authentication")
                    .detectedBy(getRuleName())
                    .build());
        }

        return findings;
    }

    @Override
    public String getRuleName() {
        return "WeakJWTRule";
    }

}
