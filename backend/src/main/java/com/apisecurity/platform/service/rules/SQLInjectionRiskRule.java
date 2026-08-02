package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.EndpointInfo;
import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * OWASP API8 — Injection
 *
 * SQL injection risk is present when:
 * - A parameter is of type "string"
 * - It has no pattern validation (pattern: null)
 * - It has no format hint (e.g. "uuid", "email", "date")
 * - It appears in a path or query position
 *
 * We can't know if the parameter goes into a SQL query,
 * but unvalidated string inputs are the primary vector.
 * We flag them and let the developer verify.
 */
@Component
public class SQLInjectionRiskRule implements SecurityRule {

    // formats that imply the input is constrained
    // and less likely to be raw SQL-injectable
    private static final List<String> SAFE_FORMATS = List.of(
            "uuid", "email", "date", "date-time",
            "int32", "int64", "float", "double", "boolean"
    );

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        for (var endpoint : spec.getEndpoints()) {
            for (var param : endpoint.getParameters()) {

                // only check path and query params
                // headers and cookies are lower risk
                if (!isPathOrQuery(param.getLocation())) continue;

                // only unvalidated strings are risky
                if (!"string".equals(param.getType())) continue;

                // if pattern is set, input is constrained
                if (param.getPattern() != null
                        && !param.getPattern().isBlank()) continue;

                // if format is a known safe format, lower risk
                if (param.getFormat() != null
                        && SAFE_FORMATS.contains(
                        param.getFormat().toLowerCase())) continue;

                findings.add(Finding.builder()
                        .endpoint(endpoint.getPath())
                        .method(endpoint.getMethod())
                        .severity(Severity.HIGH)
                        .title("Potential SQL Injection Risk — Unvalidated String Parameter")
                        .description(String.format(
                                "Parameter '%s' (%s) on %s %s is a raw string " +
                                        "with no pattern validation or format constraint. " +
                                        "If this parameter is used in a database query " +
                                        "without parameterization, it is vulnerable to " +
                                        "SQL injection attacks.",
                                param.getName(),
                                param.getLocation(),
                                endpoint.getMethod(),
                                endpoint.getPath()))
                        .fix(String.format(
                                "For parameter '%s':\n" +
                                        "1. Add pattern validation in the spec: " +
                                        "pattern: '^[a-zA-Z0-9_-]+$' (adjust to your needs)\n" +
                                        "2. Add format hint: format: uuid (if it's an ID)\n" +
                                        "3. In Spring Boot, always use JPA/Hibernate or " +
                                        "PreparedStatements — never string concatenation in queries\n" +
                                        "4. Add @Pattern annotation on the controller method parameter",
                                param.getName()))
                        .owaspCategory("OWASP API8 — Injection")
                        .detectedBy(getRuleName())
                        .build());
            }
        }

        return findings;
    }

    private boolean isPathOrQuery(String location) {
        return "path".equals(location) || "query".equals(location);
    }

    @Override
    public String getRuleName() {
        return "SQLInjectionRiskRule";
    }
}
