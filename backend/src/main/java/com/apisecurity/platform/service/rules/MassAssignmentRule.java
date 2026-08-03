package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * OWASP API6 — Mass Assignment
 *
 * Mass assignment happens when an API accepts fields in the
 * request body that should not be user-controlled — like
 * role, isAdmin, accountBalance, verified.
 *
 * A user can send {"role": "admin"} and if the backend
 * blindly maps the request body to the entity, they escalate
 * their own privileges.
 */
@Component
public class MassAssignmentRule implements SecurityRule {

    private static final List<String> DANGEROUS_FIELDS = List.of(
            // privilege escalation fields
            "role", "roles", "isadmin", "is_admin",
            "admin", "superuser", "super_user",
            "permission", "permissions", "privilege",
            "accesslevel", "access_level",

            // account control fields
            "verified", "isverified", "is_verified",
            "active", "isactive", "is_active",
            "enabled", "locked", "banned",
            "status",

            // financial fields
            "balance", "credit", "accountbalance",
            "account_balance", "wallet",

            // ID manipulation
            "userid", "user_id",
            "ownerid", "owner_id",
            "tenantid", "tenant_id"
    );

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        for (var endpoint : spec.getEndpoints()) {
            if (!endpoint.isHasRequestBody()) continue;

            List<String> dangerousFound = endpoint.getRequestBodyFields()
                    .stream()
                    .filter(f -> DANGEROUS_FIELDS.contains(f.toLowerCase()))
                    .collect(Collectors.toList());

            if (!dangerousFound.isEmpty()) {
                findings.add(Finding.builder()
                        .endpoint(endpoint.getPath())
                        .method(endpoint.getMethod())
                        .severity(Severity.HIGH)
                        .title("Mass Assignment Risk — Dangerous Fields in Request Body")
                        .description(String.format(
                                "Endpoint %s %s accepts potentially dangerous fields " +
                                        "in the request body: [%s]. " +
                                        "If the backend maps this request directly to a " +
                                        "database entity, attackers can manipulate fields " +
                                        "they should not control — such as escalating their " +
                                        "own role to admin.",
                                endpoint.getMethod(),
                                endpoint.getPath(),
                                String.join(", ", dangerousFound)))
                        .fix(String.format(
                                "Remove or protect these fields: [%s]\n" +
                                        "1. Create a specific Request DTO that only contains " +
                                        "fields users are allowed to set\n" +
                                        "2. Never use @RequestBody User user — always use " +
                                        "@RequestBody CreateUserRequest request\n" +
                                        "3. In Spring Boot, use @JsonIgnore on entity fields " +
                                        "that should never come from user input\n" +
                                        "4. Set sensitive fields server-side only " +
                                        "(e.g. role should default to USER and only " +
                                        "admins can change it via a separate privileged endpoint)",
                                String.join(", ", dangerousFound)))
                        .owaspCategory("OWASP API6 — Mass Assignment")
                        .detectedBy(getRuleName())
                        .build());
            }
        }

        return findings;
    }

    @Override
    public String getRuleName() {
        return "MassAssignmentRule";
    }
}
