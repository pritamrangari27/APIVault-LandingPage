package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.EndpointInfo;
import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.Finding.Severity;
import com.apisecurity.platform.model.ParsedSpec;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * OWASP API1 — Broken Object Level Authorization (BOLA)
 * Also known as IDOR — Insecure Direct Object Reference.
 *
 * This is the #1 API vulnerability in the world.
 *
 * Example: GET /users/{id}
 * User 1 is logged in. They change {id} to 2.
 * If the server returns User 2's data without checking
 * that User 1 is allowed to see User 2, that's BOLA.
 *
 * We flag any endpoint with an {id}-style path parameter
 * that doesn't have an ownership indicator in its description
 * or a specific x-ownership extension.
 */
@Component
public class BOLARule implements SecurityRule {

    // keywords in description that suggest ownership is checked
    private static final List<String> OWNERSHIP_KEYWORDS = List.of(
            "own", "owner", "authorized", "permission",
            "current user", "authenticated user", "belongs to"
    );

    @Override
    public List<Finding> check(ParsedSpec spec) {
        List<Finding> findings = new ArrayList<>();

        for (var endpoint : spec.getEndpoints()) {

            // only check endpoints with ID path parameters
            boolean hasIdParam = endpoint.getParameters().stream()
                    .anyMatch(p -> "path".equals(p.getLocation())
                            && (p.getName().equalsIgnoreCase("id")
                            || p.getName().toLowerCase().endsWith("id")
                            || p.getName().toLowerCase().endsWith("_id")));

            if (!hasIdParam) continue;

            // check if description mentions ownership verification
            String desc = endpoint.getDescription() != null
                    ? endpoint.getDescription().toLowerCase() : "";
            String summary = endpoint.getSummary() != null
                    ? endpoint.getSummary().toLowerCase() : "";

            boolean mentionsOwnership = OWNERSHIP_KEYWORDS.stream()
                    .anyMatch(kw -> desc.contains(kw)
                            || summary.contains(kw));

            if (mentionsOwnership) continue;

            // find the actual ID parameter name for the message
            String idParamName = endpoint.getParameters().stream()
                    .filter(p -> "path".equals(p.getLocation())
                            && (p.getName().equalsIgnoreCase("id")
                            || p.getName().toLowerCase().endsWith("id")
                            || p.getName().toLowerCase().endsWith("_id")))
                    .map(EndpointInfo.ParameterInfo::getName)
                    .findFirst()
                    .orElse("id");

            findings.add(Finding.builder()
                    .endpoint(endpoint.getPath())
                    .method(endpoint.getMethod())
                    .severity(Severity.CRITICAL)
                    .title("Potential BOLA — Broken Object Level Authorization")
                    .description(String.format(
                            "Endpoint %s %s accepts {%s} as a path parameter " +
                                    "but there is no indication that the server verifies " +
                                    "the requesting user owns or has permission to access " +
                                    "the object with that ID. " +
                                    "An attacker can enumerate IDs to access other users' data. " +
                                    "This was the root cause of the Peloton breach (2021) " +
                                    "and countless others.",
                            endpoint.getMethod(),
                            endpoint.getPath(),
                            idParamName))
                    .fix(String.format(
                            "In your Spring Boot controller for %s %s:\n" +
                                    "1. Get the currently authenticated user: " +
                                    "Authentication auth = SecurityContextHolder" +
                                    ".getContext().getAuthentication()\n" +
                                    "2. Load the resource and verify ownership:\n" +
                                    "   Resource resource = resourceRepo.findById(%s)\n" +
                                    "   if (!resource.getOwnerId().equals(currentUser.getId()))" +
                                    " throw new AccessDeniedException()\n" +
                                    "3. Add @PostAuthorize(\"returnObject.ownerId == " +
                                    "principal.id\") for automatic enforcement\n" +
                                    "4. In your spec, add to the description: " +
                                    "\"Only returns data owned by the authenticated user\"",
                            endpoint.getMethod(),
                            endpoint.getPath(),
                            idParamName))
                    .owaspCategory("OWASP API1 — Broken Object Level Authorization")
                    .detectedBy(getRuleName())
                    .build());
        }

        return findings;
    }

    @Override
    public String getRuleName() {
        return "BOLARule";
    }
}
