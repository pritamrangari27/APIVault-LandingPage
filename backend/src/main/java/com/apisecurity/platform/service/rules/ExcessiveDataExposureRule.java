package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import com.apisecurity.platform.model.EndpointInfo;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * OWASP API3 — Excessive Data Exposure
 *
 * APIs often return more data than the client needs,
 * trusting the frontend to filter. This is dangerous —
 * anyone with a REST client sees everything the server returns.
 *
 * We check response schemas for known sensitive field names.
 */
@Component
public class ExcessiveDataExposureRule implements SecurityRule {

    // field names that should never appear in API responses
    private static final Map<String, Severity> SENSITIVE_FIELDS = new LinkedHashMap<>();

    static {
        // CRITICAL — these should absolutely never be in a response
        SENSITIVE_FIELDS.put("password",         Severity.CRITICAL);
        SENSITIVE_FIELDS.put("passwordhash",     Severity.CRITICAL);
        SENSITIVE_FIELDS.put("password_hash",    Severity.CRITICAL);
        SENSITIVE_FIELDS.put("hashedpassword",   Severity.CRITICAL);
        SENSITIVE_FIELDS.put("passwordsalt",     Severity.CRITICAL);
        SENSITIVE_FIELDS.put("password_salt",    Severity.CRITICAL);
        SENSITIVE_FIELDS.put("salt",             Severity.CRITICAL);
        SENSITIVE_FIELDS.put("secret",           Severity.CRITICAL);
        SENSITIVE_FIELDS.put("secretkey",        Severity.CRITICAL);
        SENSITIVE_FIELDS.put("private_key",      Severity.CRITICAL);
        SENSITIVE_FIELDS.put("privatekey",       Severity.CRITICAL);
        SENSITIVE_FIELDS.put("apikey",           Severity.CRITICAL);
        SENSITIVE_FIELDS.put("api_key",          Severity.CRITICAL);

        // HIGH — very sensitive personal data
        SENSITIVE_FIELDS.put("ssn",              Severity.HIGH);
        SENSITIVE_FIELDS.put("socialsecurity",   Severity.HIGH);
        SENSITIVE_FIELDS.put("creditcard",       Severity.HIGH);
        SENSITIVE_FIELDS.put("credit_card",      Severity.HIGH);
        SENSITIVE_FIELDS.put("cardnumber",       Severity.HIGH);
        SENSITIVE_FIELDS.put("cvv",              Severity.HIGH);
        SENSITIVE_FIELDS.put("pin",              Severity.HIGH);
        SENSITIVE_FIELDS.put("bankaccount",      Severity.HIGH);
        SENSITIVE_FIELDS.put("bank_account",     Severity.HIGH);
        SENSITIVE_FIELDS.put("token",            Severity.HIGH);
        SENSITIVE_FIELDS.put("accesstoken",      Severity.HIGH);
        SENSITIVE_FIELDS.put("access_token",     Severity.HIGH);
        SENSITIVE_FIELDS.put("refreshtoken",     Severity.HIGH);
        SENSITIVE_FIELDS.put("refresh_token",    Severity.HIGH);
        SENSITIVE_FIELDS.put("authtoken",        Severity.HIGH);

        // MEDIUM — sensitive but sometimes needed
        SENSITIVE_FIELDS.put("dob",              Severity.MEDIUM);
        SENSITIVE_FIELDS.put("dateofbirth",      Severity.MEDIUM);
        SENSITIVE_FIELDS.put("date_of_birth",    Severity.MEDIUM);
        SENSITIVE_FIELDS.put("passport",         Severity.MEDIUM);
        SENSITIVE_FIELDS.put("drivinglicense",   Severity.MEDIUM);
        SENSITIVE_FIELDS.put("taxpayerid",       Severity.MEDIUM);
    }

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        for (var endpoint : spec.getEndpoints()) {
            for (var entry : endpoint.getResponses().entrySet()) {
                String statusCode = entry.getKey();
                EndpointInfo.ResponseInfo response = entry.getValue();

                // only check success responses — error responses
                // rarely expose sensitive data we care about
                if (!statusCode.startsWith("2")) continue;

                List<String> found = findSensitiveFields(
                        response.getFieldNames());

                if (!found.isEmpty()) {
                    Severity highestSeverity = found.stream()
                            .map(f -> SENSITIVE_FIELDS.get(f.toLowerCase()))
                            .filter(Objects::nonNull)
                            .max(Comparator.comparingInt(Enum::ordinal))
                            // ordinal: CRITICAL=0, HIGH=1, MEDIUM=2, LOW=3
                            // we want the most severe = lowest ordinal
                            .orElse(Severity.MEDIUM);

                    // correct — we want CRITICAL (ordinal 0) not LOW (ordinal 3)
                    Severity severity = found.stream()
                            .map(f -> SENSITIVE_FIELDS.get(f.toLowerCase()))
                            .filter(Objects::nonNull)
                            .min(Comparator.comparingInt(Enum::ordinal))
                            .orElse(Severity.MEDIUM);

                    findings.add(Finding.builder()
                            .endpoint(endpoint.getPath())
                            .method(endpoint.getMethod())
                            .severity(severity)
                            .title("Sensitive Data Exposure in Response")
                            .description(String.format(
                                    "Endpoint %s %s returns sensitive fields in the " +
                                            "%s response: [%s]. " +
                                            "These fields should never be returned to clients. " +
                                            "Attackers who intercept or access this endpoint " +
                                            "can harvest sensitive user data.",
                                    endpoint.getMethod(),
                                    endpoint.getPath(),
                                    statusCode,
                                    String.join(", ", found)))
                            .fix(String.format(
                                    "Create a DTO (Data Transfer Object) class that " +
                                            "only contains the fields clients actually need. " +
                                            "Remove these fields from the response: [%s]. " +
                                            "In Spring Boot: create UserResponseDto without " +
                                            "sensitive fields and use ModelMapper or MapStruct " +
                                            "to convert your entity to the DTO before returning.",
                                    String.join(", ", found)))
                            .owaspCategory("OWASP API3 — Excessive Data Exposure")
                            .detectedBy(getRuleName())
                            .build());
                }
            }
        }

        return findings;
    }

    private List<String> findSensitiveFields(List<String> fieldNames) {
        return fieldNames.stream()
                .filter(f -> SENSITIVE_FIELDS.containsKey(f.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public String getRuleName() {
        return "ExcessiveDataExposureRule";
    }
}
