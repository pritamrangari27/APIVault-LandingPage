# Security Engine

This directory contains the deterministic Security Engine for apiVault.

## Purpose

The Security Engine consumes the existing ParsedSpec-style OpenAPI parser output and produces a deterministic security test plan in `security_engine/test.json`.

It does not execute tests, does not call Schemathesis, and does not contact any live API.

## Flow

OpenAPI Parser
      ↓
Security Engine
      ↓
security_engine/test.json
      ↓
Future apivault-agent
      ↓
Schemathesis
      ↓
Developer's local API
      ↓
Dynamic Results

## Input format

The planner expects a ParsedSpec-style dictionary with these top-level keys:

- `title`
- `version`
- `description`
- `serverUrls`
- `securitySchemes`
- `globalSecurity`
- `endpoints`

Each endpoint is expected to include:

- `path`
- `method`
- `summary`
- `description`
- `tags`
- `hasAuthentication`
- `securitySchemes`
- `parameters`
- `responses`
- `requestBodyFields`
- `hasRequestBody`
- `hasRateLimit`
- `deprecated`

## Static vs Dynamic

Static tests are created when the security property can be determined from the specification alone.

Examples include:

- missing security schemes
- missing endpoint security requirements
- insecure `http://` server URLs
- sensitive fields in request or response schemas
- missing input constraints on parameters
- sensitive HTTP methods such as `DELETE`, `PUT`, and `PATCH`

Dynamic tests are created when the API must be exercised at runtime.

Examples include:

- missing authentication checks
- invalid authentication
- invalid parameters
- boundary values
- malformed request bodies
- schema violations
- unexpected status codes
- response schema validation
- method behavior

## Deterministic planning

The planner uses generic properties from the parser output and stable IDs such as:

- `STATIC-AUTH-001`
- `STATIC-DATA-001`
- `STATIC-TRANSPORT-001`
- `DYNAMIC-PARAM-001`
- `DYNAMIC-RESPONSE-001`

The same input always produces the same `test.json`.

## `test.json` structure

```json
{
  "version": "1.0",
  "planner": "apivault-security-engine",
  "summary": {
    "total_endpoints": 0,
    "static_test_count": 0,
    "dynamic_test_count": 0
  },
  "static_tests": [],
  "dynamic_tests": []
}
```

Static tests describe specification-derived findings.
Dynamic tests describe request plans for Schemathesis.

## Schemathesis role

The Security Engine only annotates dynamic tests with:

- `executor: "schemathesis"`

A future `apivault-agent` will read `security_engine/test.json`, extract `dynamic_tests`, and run Schemathesis against a developer's local API.

## CLI

Run the planner from this directory or from the repository root:

```bash
python security_engine/security_test_planner.py
```

The script reads `security_engine/demo_parser_output.json`, writes `security_engine/test.json`, and prints a readable summary.
