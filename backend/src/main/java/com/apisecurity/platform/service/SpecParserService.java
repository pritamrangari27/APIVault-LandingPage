package com.apisecurity.platform.service;

import com.apisecurity.platform.model.EndpointInfo;
import com.apisecurity.platform.model.ParsedSpec;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.parser.OpenAPIV3Parser;
import io.swagger.v3.parser.core.models.ParseOptions;
import io.swagger.v3.parser.core.models.SwaggerParseResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@Slf4j
public class SpecParserService {

    /**
     * Main entry point — accepts the uploaded file, returns a ParsedSpec.
     * This is what the controller will call.
     */
    public ParsedSpec parse(MultipartFile file) throws Exception {
        log.info("Starting spec parse for file: {}", file.getOriginalFilename());

        // read the raw bytes and convert to a string
        String content = new String(file.getBytes(), StandardCharsets.UTF_8);

        return parseContent(content);
    }

    /**
     * Separated so we can also call this with a raw string in tests
     * without needing an actual MultipartFile.
     */
    public ParsedSpec parseContent(String content) throws Exception {

        // configure the parser — resolve $ref references inside the spec
        ParseOptions options = new ParseOptions();
        options.setResolve(true);      // follow $ref pointers
        options.setResolveFully(true); // resolve nested $refs too

        // parse the content string (works for both YAML and JSON)
        SwaggerParseResult result = new OpenAPIV3Parser()
                .readContents(content, null, options);

        // check for parse errors
        if (result.getOpenAPI() == null) {
            String errors = String.join(", ", result.getMessages());
            log.error("Failed to parse spec: {}", errors);
            throw new IllegalArgumentException(
                    "Invalid OpenAPI spec. Errors: " + errors
            );
        }

        OpenAPI openAPI = result.getOpenAPI();
        log.info("Spec parsed successfully. Title: {}, Paths: {}",
                openAPI.getInfo() != null ? openAPI.getInfo().getTitle() : "unknown",
                openAPI.getPaths() != null ? openAPI.getPaths().size() : 0);

        return buildParsedSpec(openAPI);
    }


    // ── private methods below — internal building blocks ──────────────────


    private ParsedSpec buildParsedSpec(OpenAPI openAPI) {

        ParsedSpec.ParsedSpecBuilder builder = ParsedSpec.builder();

        // extract top-level info
        if (openAPI.getInfo() != null) {
            builder.title(openAPI.getInfo().getTitle());
            builder.version(openAPI.getInfo().getVersion());
            builder.description(openAPI.getInfo().getDescription());
        }

        // extract server URLs
        if (openAPI.getServers() != null) {
            List<String> urls = openAPI.getServers().stream()
                    .map(s -> s.getUrl())
                    .filter(Objects::nonNull)
                    .toList();
            builder.serverUrls(urls);
        }

        // extract global security schemes
        Map<String, String> schemes = new HashMap<>();
        if (openAPI.getComponents() != null
                && openAPI.getComponents().getSecuritySchemes() != null) {
            openAPI.getComponents().getSecuritySchemes()
                    .forEach((name, scheme) -> {
                        String type = scheme.getType() != null
                                ? scheme.getType().toString() : "unknown";
                        schemes.put(name, type);
                    });
        }
        builder.securitySchemes(schemes);

        // extract global security requirements
        List<String> globalSecurity = new ArrayList<>();
        if (openAPI.getSecurity() != null) {
            openAPI.getSecurity().forEach(req ->
                    globalSecurity.addAll(req.keySet()));
        }
        builder.globalSecurity(globalSecurity);

        // extract all endpoints from all paths
        List<EndpointInfo> endpoints = new ArrayList<>();
        if (openAPI.getPaths() != null) {
            openAPI.getPaths().forEach((path, pathItem) -> {
                // each path can have multiple HTTP methods
                extractEndpointsFromPath(path, pathItem, globalSecurity, endpoints);
            });
        }
        builder.endpoints(endpoints);

        log.info("ParsedSpec built: {} endpoints extracted", endpoints.size());
        return builder.build();
    }


    private void extractEndpointsFromPath(
            String path,
            PathItem pathItem,
            List<String> globalSecurity,
            List<EndpointInfo> endpoints) {

        // build a map of method -> operation for all HTTP methods on this path
        Map<String, Operation> operations = new LinkedHashMap<>();

        if (pathItem.getGet()    != null) operations.put("GET",    pathItem.getGet());
        if (pathItem.getPost()   != null) operations.put("POST",   pathItem.getPost());
        if (pathItem.getPut()    != null) operations.put("PUT",    pathItem.getPut());
        if (pathItem.getDelete() != null) operations.put("DELETE", pathItem.getDelete());
        if (pathItem.getPatch()  != null) operations.put("PATCH",  pathItem.getPatch());

        operations.forEach((method, operation) -> {
            EndpointInfo endpoint = buildEndpointInfo(
                    path, method, operation, globalSecurity);
            endpoints.add(endpoint);
        });
    }


    private EndpointInfo buildEndpointInfo(
            String path,
            String method,
            Operation operation,
            List<String> globalSecurity) {

        EndpointInfo.EndpointInfoBuilder builder = EndpointInfo.builder()
                .path(path)
                .method(method)
                .summary(operation.getSummary())
                .description(operation.getDescription())
                .deprecated(Boolean.TRUE.equals(operation.getDeprecated()));

        // tags
        if (operation.getTags() != null) {
            builder.tags(operation.getTags());
        }

        // ── authentication detection ───────────────────────────────
        // security can be set at operation level OR globally
        // security: []  means explicitly NO auth (overrides global)
        // security: null means inherit from global
        List<SecurityRequirement> opSecurity = operation.getSecurity();

        if (opSecurity != null) {
            if (opSecurity.isEmpty()) {
                // explicitly set to empty = NO authentication required
                builder.hasAuthentication(false);
                builder.securitySchemes(new ArrayList<>());
            } else {
                // has operation-level security
                builder.hasAuthentication(true);
                List<String> schemes = new ArrayList<>();
                opSecurity.forEach(req -> schemes.addAll(req.keySet()));
                builder.securitySchemes(schemes);
            }
        } else {
            // no operation-level security — inherits global
            if (!globalSecurity.isEmpty()) {
                builder.hasAuthentication(true);
                builder.securitySchemes(new ArrayList<>(globalSecurity));
            } else {
                // no global security either — unauthenticated
                builder.hasAuthentication(false);
                builder.securitySchemes(new ArrayList<>());
            }
        }

        // ── parameters ────────────────────────────────────────────
        List<EndpointInfo.ParameterInfo> params = new ArrayList<>();
        if (operation.getParameters() != null) {
            operation.getParameters().forEach(p ->
                    params.add(buildParameterInfo(p)));
        }
        builder.parameters(params);

        // ── rate limit check ─────────────────────────────────────
        // check for x-ratelimit or x-rate-limit extension
        boolean hasRateLimit = false;
        if (operation.getExtensions() != null) {
            hasRateLimit = operation.getExtensions().keySet().stream()
                    .anyMatch(key -> key.toLowerCase()
                            .contains("ratelimit") ||
                            key.toLowerCase().contains("rate-limit") ||
                            key.toLowerCase().contains("throttl"));
        }
        builder.hasRateLimit(hasRateLimit);

        // ── request body ──────────────────────────────────────────
        List<String> requestBodyFields = new ArrayList<>();
        if (operation.getRequestBody() != null) {
            builder.hasRequestBody(true);
            extractRequestBodyFields(operation, requestBodyFields);
        }
        builder.requestBodyFields(requestBodyFields);

        // ── responses ─────────────────────────────────────────────
        Map<String, EndpointInfo.ResponseInfo> responses = new HashMap<>();
        if (operation.getResponses() != null) {
            operation.getResponses().forEach((statusCode, apiResponse) -> {
                EndpointInfo.ResponseInfo responseInfo =
                        buildResponseInfo(statusCode, apiResponse);
                responses.put(statusCode, responseInfo);
            });
        }
        builder.responses(responses);

        return builder.build();
    }


    private EndpointInfo.ParameterInfo buildParameterInfo(Parameter param) {
        String type = null;
        String pattern = null;
        String format = null;

        if (param.getSchema() != null) {
            type    = param.getSchema().getType();
            pattern = param.getSchema().getPattern();
            format  = param.getSchema().getFormat();
        }

        return EndpointInfo.ParameterInfo.builder()
                .name(param.getName())
                .location(param.getIn())       // "path", "query", "header", "cookie"
                .required(Boolean.TRUE.equals(param.getRequired()))
                .type(type)
                .pattern(pattern)
                .format(format)
                .build();
    }


    @SuppressWarnings("unchecked")
    private void extractRequestBodyFields(
            Operation operation,
            List<String> fields) {
        try {
            var content = operation.getRequestBody().getContent();
            if (content == null) return;

            // try JSON content type first, fall back to any content type
            var mediaType = content.get("application/json");
            if (mediaType == null && !content.isEmpty()) {
                mediaType = content.values().iterator().next();
            }
            if (mediaType == null || mediaType.getSchema() == null) return;

            Schema<?> schema = mediaType.getSchema();
            if (schema.getProperties() != null) {
                fields.addAll(schema.getProperties().keySet());
            }
        } catch (Exception e) {
            log.warn("Could not extract request body fields: {}", e.getMessage());
        }
    }


    @SuppressWarnings("unchecked")
    private EndpointInfo.ResponseInfo buildResponseInfo(
            String statusCode,
            ApiResponse apiResponse) {

        List<String> fieldNames   = new ArrayList<>();
        Map<String, String> types = new HashMap<>();

        try {
            if (apiResponse.getContent() != null) {
                var mediaType = apiResponse.getContent().get("application/json");
                if (mediaType == null && !apiResponse.getContent().isEmpty()) {
                    mediaType = apiResponse.getContent().values().iterator().next();
                }

                if (mediaType != null && mediaType.getSchema() != null) {
                    Schema<?> schema = mediaType.getSchema();
                    if (schema.getProperties() != null) {
                        schema.getProperties().forEach((fieldName, fieldSchema) -> {
                            fieldNames.add((String) fieldName);
                            Schema<?> fs = (Schema<?>) fieldSchema;
                            if (fs.getType() != null) {
                                types.put((String) fieldName, fs.getType());
                            }
                        });
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not extract response fields for {}: {}",
                    statusCode, e.getMessage());
        }

        return EndpointInfo.ResponseInfo.builder()
                .statusCode(statusCode)
                .fieldNames(fieldNames)
                .fieldTypes(types)
                .build();
    }
}