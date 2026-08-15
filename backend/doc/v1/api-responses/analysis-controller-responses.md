# V1 API Documentation

## Test 1 — Health check

### Endpoint

GET http://localhost:8080/api/v1/health

### Response

```json
{
    "success": true,
    "message": "Service is running",
    "data": "UP",
    "timestamp": "2026-08-15T13:52:54.4880896"
}
```

## Test 2 — Analyze the vulnerable spec

### Endpoint

POST http://localhost:8080/api/v1/analyze
Body: form-data
Key: file    Type: File
Value: [select your vulnerable-api.yaml from src/main/resources/samples/]

### Response

```json
{
  "success": true,
  "message": "Analysis complete",
  "data": {
    "scanId": 2,
    "specTitle": "Vulnerable Banking API",
    "specVersion": "1.0.0",
    "totalEndpoints": 4,
    "securityScore": 0,
    "grade": "F",
    "criticalCount": 7,
    "highCount": 3,
    "mediumCount": 4,
    "lowCount": 0,
    "totalFindings": 14,
    "findings": [
      {
        "endpoint": "/users/{id}",
        "method": "GET",
        "severity": "CRITICAL",
        "title": "Potential BOLA — Broken Object Level Authorization",
        "description": "Endpoint GET /users/{id} accepts {id} as a path parameter but there is no indication that the server verifies the requesting user owns or has permission to access the object with that ID. An attacker can enumerate IDs to access other users' data. This was the root cause of the Peloton breach (2021) and countless others.",
        "fix": "In your Spring Boot controller for GET /users/{id}:\n1. Get the currently authenticated user: Authentication auth = SecurityContextHolder.getContext().getAuthentication()\n2. Load the resource and verify ownership:\n   Resource resource = resourceRepo.findById(id)\n   if (!resource.getOwnerId().equals(currentUser.getId())) throw new AccessDeniedException()\n3. Add @PostAuthorize(\"returnObject.ownerId == principal.id\") for automatic enforcement\n4. In your spec, add to the description: \"Only returns data owned by the authenticated user\"",
        "owaspCategory": "OWASP API1 — Broken Object Level Authorization",
        "detectedBy": "BOLARule"
      },
      {
        "endpoint": "/users/{id}",
        "method": "GET",
        "severity": "CRITICAL",
        "title": "Missing Authentication",
        "description": "Endpoint GET /users/{id} has no authentication requirement. Any request — authenticated or not — can access this endpoint. This allows attackers to access data or perform actions without any identity verification.",
        "fix": "Add authentication to GET /users/{id}. In Spring Security, ensure this path is not in permitAll(). Add @PreAuthorize(\"isAuthenticated()\") to your controller method. In your OpenAPI spec, add a security requirement: security: [{ bearerAuth: [] }]",
        "owaspCategory": "OWASP API2 — Broken Authentication",
        "detectedBy": "BrokenAuthRule"
      },
      {
        "endpoint": "/users",
        "method": "POST",
        "severity": "CRITICAL",
        "title": "Missing Authentication",
        "description": "Endpoint POST /users has no authentication requirement. Any request — authenticated or not — can access this endpoint. This allows attackers to access data or perform actions without any identity verification.",
        "fix": "Add authentication to POST /users. In Spring Security, ensure this path is not in permitAll(). Add @PreAuthorize(\"isAuthenticated()\") to your controller method. In your OpenAPI spec, add a security requirement: security: [{ bearerAuth: [] }]",
        "owaspCategory": "OWASP API2 — Broken Authentication",
        "detectedBy": "BrokenAuthRule"
      },
      {
        "endpoint": "/admin/users",
        "method": "GET",
        "severity": "CRITICAL",
        "title": "Missing Authentication",
        "description": "Endpoint GET /admin/users has no authentication requirement. Any request — authenticated or not — can access this endpoint. This allows attackers to access data or perform actions without any identity verification.",
        "fix": "Add authentication to GET /admin/users. In Spring Security, ensure this path is not in permitAll(). Add @PreAuthorize(\"isAuthenticated()\") to your controller method. In your OpenAPI spec, add a security requirement: security: [{ bearerAuth: [] }]",
        "owaspCategory": "OWASP API2 — Broken Authentication",
        "detectedBy": "BrokenAuthRule"
      },
      {
        "endpoint": "/users/{id}",
        "method": "GET",
        "severity": "CRITICAL",
        "title": "Sensitive Data Exposure in Response",
        "description": "Endpoint GET /users/{id} returns sensitive fields in the 200 response: [password, passwordHash, ssn]. These fields should never be returned to clients. Attackers who intercept or access this endpoint can harvest sensitive user data.",
        "fix": "Create a DTO (Data Transfer Object) class that only contains the fields clients actually need. Remove these fields from the response: [password, passwordHash, ssn]. In Spring Boot: create UserResponseDto without sensitive fields and use ModelMapper or MapStruct to convert your entity to the DTO before returning.",
        "owaspCategory": "OWASP API3 — Excessive Data Exposure",
        "detectedBy": "ExcessiveDataExposureRule"
      },
      {
        "endpoint": "servers[]",
        "method": "N/A",
        "severity": "CRITICAL",
        "title": "Production Server Uses HTTP Instead of HTTPS",
        "description": "The spec defines non-localhost server URLs using HTTP: http://api.vulnerablebank.com. HTTP transmits all data in plaintext. Attackers on the same network can intercept tokens, passwords, and sensitive data through a man-in-the-middle attack.",
        "fix": "1. Change all server URLs from http:// to https://\n2. Configure TLS/SSL on your server\n3. Add HTTP → HTTPS redirect so old links still work\n4. Set HSTS header: Strict-Transport-Security: max-age=31536000; includeSubDomains\n5. On Azure: TLS is handled by App Gateway or AKS Ingress with cert-manager + Let's Encrypt",
        "owaspCategory": "OWASP API7 — Security Misconfiguration",
        "detectedBy": "MissingHTTPSRule"
      },
      {
        "endpoint": "/login",
        "method": "POST",
        "severity": "CRITICAL",
        "title": "Missing Rate Limiting",
        "description": "Endpoint POST /login has no rate limiting defined. Without rate limiting, attackers can send unlimited requests. This is a sensitive authentication endpoint — brute force attacks are especially dangerous here.",
        "fix": "Add rate limiting in multiple layers:\n1. In your OpenAPI spec, add extension: x-ratelimit: { requests: 10, period: '1m' }\n2. In Spring Boot, use Bucket4j with Redis: @RateLimiter annotation on the controller method\n3. At the infrastructure level, configure rate limits in Azure API Management or NGINX Ingress",
        "owaspCategory": "OWASP API4 — Lack of Resources and Rate Limiting",
        "detectedBy": "MissingRateLimitRule"
      },
      {
        "endpoint": "/users",
        "method": "POST",
        "severity": "HIGH",
        "title": "Mass Assignment Risk — Dangerous Fields in Request Body",
        "description": "Endpoint POST /users accepts potentially dangerous fields in the request body: [role, isAdmin]. If the backend maps this request directly to a database entity, attackers can manipulate fields they should not control — such as escalating their own role to admin.",
        "fix": "Remove or protect these fields: [role, isAdmin]\n1. Create a specific Request DTO that only contains fields users are allowed to set\n2. Never use @RequestBody User user — always use @RequestBody CreateUserRequest request\n3. In Spring Boot, use @JsonIgnore on entity fields that should never come from user input\n4. Set sensitive fields server-side only (e.g. role should default to USER and only admins can change it via a separate privileged endpoint)",
        "owaspCategory": "OWASP API6 — Mass Assignment",
        "detectedBy": "MassAssignmentRule"
      },
      {
        "endpoint": "/users",
        "method": "POST",
        "severity": "HIGH",
        "title": "Missing Rate Limiting",
        "description": "Endpoint POST /users has no rate limiting defined. Without rate limiting, attackers can send unlimited requests. This could be used for data scraping or denial-of-service attacks.",
        "fix": "Add rate limiting in multiple layers:\n1. In your OpenAPI spec, add extension: x-ratelimit: { requests: 10, period: '1m' }\n2. In Spring Boot, use Bucket4j with Redis: @RateLimiter annotation on the controller method\n3. At the infrastructure level, configure rate limits in Azure API Management or NGINX Ingress",
        "owaspCategory": "OWASP API4 — Lack of Resources and Rate Limiting",
        "detectedBy": "MissingRateLimitRule"
      },
      {
        "endpoint": "/users/{id}",
        "method": "GET",
        "severity": "HIGH",
        "title": "Potential SQL Injection Risk — Unvalidated String Parameter",
        "description": "Parameter 'id' (path) on GET /users/{id} is a raw string with no pattern validation or format constraint. If this parameter is used in a database query without parameterization, it is vulnerable to SQL injection attacks.",
        "fix": "For parameter 'id':\n1. Add pattern validation in the spec: pattern: '^[a-zA-Z0-9_-]+$' (adjust to your needs)\n2. Add format hint: format: uuid (if it's an ID)\n3. In Spring Boot, always use JPA/Hibernate or PreparedStatements — never string concatenation in queries\n4. Add @Pattern annotation on the controller method parameter",
        "owaspCategory": "OWASP API8 — Injection",
        "detectedBy": "SQLInjectionRiskRule"
      },
      {
        "endpoint": "/login",
        "method": "POST",
        "severity": "MEDIUM",
        "title": "Missing Authentication",
        "description": "Endpoint POST /login has no authentication. If this endpoint is intentionally public, document it explicitly. If not, add authentication immediately.",
        "fix": "Add authentication to POST /login. In Spring Security, ensure this path is not in permitAll(). Add @PreAuthorize(\"isAuthenticated()\") to your controller method. In your OpenAPI spec, add a security requirement: security: [{ bearerAuth: [] }]",
        "owaspCategory": "OWASP API2 — Broken Authentication",
        "detectedBy": "BrokenAuthRule"
      },
      {
        "endpoint": "/users/{id}",
        "method": "GET",
        "severity": "MEDIUM",
        "title": "Missing Rate Limiting",
        "description": "Endpoint GET /users/{id} has no rate limiting defined. Without rate limiting, attackers can send unlimited requests. This could be used for data scraping or denial-of-service attacks.",
        "fix": "Add rate limiting in multiple layers:\n1. In your OpenAPI spec, add extension: x-ratelimit: { requests: 10, period: '1m' }\n2. In Spring Boot, use Bucket4j with Redis: @RateLimiter annotation on the controller method\n3. At the infrastructure level, configure rate limits in Azure API Management or NGINX Ingress",
        "owaspCategory": "OWASP API4 — Lack of Resources and Rate Limiting",
        "detectedBy": "MissingRateLimitRule"
      },
      {
        "endpoint": "/admin/users",
        "method": "GET",
        "severity": "MEDIUM",
        "title": "Missing Rate Limiting",
        "description": "Endpoint GET /admin/users has no rate limiting defined. Without rate limiting, attackers can send unlimited requests. This could be used for data scraping or denial-of-service attacks.",
        "fix": "Add rate limiting in multiple layers:\n1. In your OpenAPI spec, add extension: x-ratelimit: { requests: 10, period: '1m' }\n2. In Spring Boot, use Bucket4j with Redis: @RateLimiter annotation on the controller method\n3. At the infrastructure level, configure rate limits in Azure API Management or NGINX Ingress",
        "owaspCategory": "OWASP API4 — Lack of Resources and Rate Limiting",
        "detectedBy": "MissingRateLimitRule"
      },
      {
        "endpoint": "components/securitySchemes/bearerAuth",
        "method": "N/A",
        "severity": "MEDIUM",
        "title": "JWT Security Scheme Needs Review",
        "description": "Security scheme 'bearerAuth' uses HTTP Bearer authentication. Verify that:\n- bearerFormat is set to JWT in your spec\n- Tokens are signed with RS256 or ES256 (not HS256 with a weak secret)\n- Token expiry is set (exp claim)\n- Tokens are validated on every request",
        "fix": "In your OpenAPI spec, ensure:\n  bearerAuth:\n    type: http\n    scheme: bearer\n    bearerFormat: JWT\n\nIn Spring Boot:\n- Use RS256 with a proper key pair\n- Set expiry to 15-60 minutes\n- Validate signature, expiry, and issuer on every request\n- Implement refresh token rotation",
        "owaspCategory": "OWASP API2 — Broken Authentication",
        "detectedBy": "WeakJWTRule"
      }
    ],
    "analyzedAt": "2026-08-15T13:52:24.7554383",
    "status": "COMPLETED"
  },
  "timestamp": "2026-08-15T13:52:25.1221194"
}

```

## Test 3 — Get scan by ID

### Endpoint

GET http://localhost:8080/api/v1/scans/1

### Response

```json
{
  "success": true,
  "message": "Scan retrieved",
  "data": {
    "scanId": 1,
    "specTitle": "Vulnerable Banking API",
    "specVersion": "1.0.0",
    "totalEndpoints": 0,
    "securityScore": 0,
    "grade": null,
    "criticalCount": 7,
    "highCount": 3,
    "mediumCount": 4,
    "lowCount": 0,
    "totalFindings": 14,
    "findings": null,
    "analyzedAt": null,
    "status": "COMPLETED"
  },
  "timestamp": "2026-08-15T13:41:05.392925"
}

```

## Test 4 — Get all scans

### Endpoint

GET http://localhost:8080/api/v1/scans

### Response

```json
{
  "success": true,
  "message": "Found 1 scans",
  "data": [
    {
      "id": 1,
      "specTitle": "Vulnerable Banking API",
      "specVersion": "1.0.0",
      "securityScore": 0,
      "grade": "F",
      "totalFindings": 14,
      "criticalCount": 7,
      "highCount": 3,
      "mediumCount": 4,
      "lowCount": 0,
      "status": "COMPLETED",
      "createdAt": "2026-08-14T11:13:00.497796"
    }
  ],
  "timestamp": "2026-08-15T13:40:55.3943024"
}

```
