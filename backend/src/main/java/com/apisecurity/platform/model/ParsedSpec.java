package com.apisecurity.platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParsedSpec {

    // from info.title in the spec
    private String title;

    // from info.version in the spec
    private String version;

    // from info.description
    private String description;

    // server URLs defined in the spec e.g. ["https://api.example.com", "http://localhost:8080"]
    @Builder.Default
    private List<String> serverUrls = new ArrayList<>();

    // global security schemes defined in components.securitySchemes
    // key = scheme name, value = scheme type (e.g. "http", "apiKey", "oauth2")
    @Builder.Default
    private Map<String, String> securitySchemes = new HashMap<>();

    // global security requirements — applies to all endpoints unless overridden
    @Builder.Default
    private List<String> globalSecurity = new ArrayList<>();

    // every endpoint extracted from the spec
    @Builder.Default
    private List<EndpointInfo> endpoints = new ArrayList<>();

    // total count — useful for quick summary
    public int getEndpointCount() {
        return endpoints.size();
    }

    // helper: get only unauthenticated endpoints
    public List<EndpointInfo> getUnauthenticatedEndpoints() {
        return endpoints.stream()
                .filter(e -> Boolean.FALSE.equals(e.getHasAuthentication()))
                .toList();
    }
}
