from __future__ import annotations

from security_engine.security_rules import (
    check_insecure_http_server,
    check_missing_endpoint_security,
    check_missing_input_constraints,
    check_missing_security,
    check_sensitive_methods,
    check_sensitive_response_fields,
    check_sensitive_request_fields,
)


def test_missing_security_scheme_is_detected() -> None:
    findings = check_missing_security({"securitySchemes": {}, "endpoints": []})

    assert len(findings) == 1
    assert findings[0]["test"] == "missing_security_scheme"
    assert findings[0]["category"] == "authentication"


def test_missing_endpoint_security_is_detected() -> None:
    findings = check_missing_endpoint_security({"hasAuthentication": False})

    assert len(findings) == 1
    assert findings[0]["test"] == "missing_endpoint_security"


def test_insecure_http_server_is_detected() -> None:
    findings = check_insecure_http_server({"serverUrls": ["http://example.invalid", "https://secure.invalid"]})

    assert len(findings) == 1
    assert findings[0]["server_url"] == "http://example.invalid"


def test_sensitive_fields_are_detected() -> None:
    endpoint = {
        "responses": {
            "200": {"fieldNames": ["id", "passwordHash", "ssn"]}
        },
        "requestBodyFields": ["username", "api_key"],
    }

    response_findings = check_sensitive_response_fields(endpoint)
    request_findings = check_sensitive_request_fields(endpoint)

    assert {finding["field"] for finding in response_findings} == {"passwordHash", "ssn"}
    assert request_findings[0]["field"] == "api_key"


def test_missing_input_constraints_are_detected() -> None:
    endpoint = {
        "parameters": [
            {"name": "id", "location": "path", "type": "string", "pattern": None, "format": None},
            {"name": "limit", "location": "query", "type": "integer", "pattern": None, "format": None},
            {"name": "status", "location": "query", "type": "string", "pattern": "^[a-z]+$", "format": None},
        ]
    }

    findings = check_missing_input_constraints(endpoint)

    assert {finding["parameter"] for finding in findings} == {"id", "limit"}


def test_sensitive_methods_are_detected() -> None:
    findings = check_sensitive_methods({"method": "DELETE"})

    assert len(findings) == 1
    assert findings[0]["severity"] == "high"
