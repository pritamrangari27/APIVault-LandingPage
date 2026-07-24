package com.apisecurity.platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EndpointInfo {

    // e.g. "/users/{id}"
    private String path;

    // e.g. "GET", "POST", "PUT", "DELETE"
    private String method;

    // e.g. "Get user by ID" — from the summary field in the spec
    private String summary;

    // full description if provided
    private String description;

    // list of tags e.g. ["users", "admin"]
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    // true if this endpoint has security defined
    // false if security: [] (empty = explicitly unauthenticated)
    // null if not specified at all (inherits from global)
    private Boolean hasAuthentication;

    // the names of security schemes applied e.g. ["bearerAuth", "apiKey"]
    @Builder.Default
    private List<String> securitySchemes = new ArrayList<>();

    // all parameters (path, query, header, cookie)
    @Builder.Default
    private List<ParameterInfo> parameters = new ArrayList<>();

    // response schemas per status code e.g. {"200": ResponseInfo, "404": ResponseInfo}
    @Builder.Default
    private Map<String, HttpResponse.ResponseInfo> responses = new java.util.HashMap<>();

    // request body schema field names (for mass assignment checks)
    @Builder.Default
    private List<String> requestBodyFields = new ArrayList<>();

    // true if this endpoint has a request body
    private boolean hasRequestBody;

    // rate limit related — checks x-ratelimit extension
    private boolean hasRateLimit;

    // whether the operation is marked deprecated
    private boolean deprecated;


    // ── nested classes live here — they belong to EndpointInfo ──

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParameterInfo {

        private String name;

        // "path", "query", "header", "cookie"
        private String location;

        private boolean required;

        // "string", "integer", "boolean", "array", "object"
        private String type;

        // regex pattern for validation — if null, no validation defined
        private String pattern;

        // format hint e.g. "email", "uuid", "date-time"
        private String format;
    }


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseInfo {

        // HTTP status code as string: "200", "401", "500"
        private String statusCode;

        // all field names in the response body
        @Builder.Default
        private List<String> fieldNames = new ArrayList<>();

        // field names with their types e.g. {"password": "string"}
        @Builder.Default
        private Map<String, String> fieldTypes = new java.util.HashMap<>();
    }
}
