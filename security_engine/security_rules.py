"""Deterministic static security rules for the apiVault security engine."""

from __future__ import annotations

from typing import Iterable

try:  # pragma: no cover - supports direct script execution
    from .test_definitions import STATIC_NAME_TO_ID
except ImportError:  # pragma: no cover
    from test_definitions import STATIC_NAME_TO_ID

SENSITIVE_FIELD_PATTERNS = (
    "password",
    "passwd",
    "token",
    "secret",
    "api_key",
    "apikey",
    "credit_card",
    "card_number",
    "ssn",
    "private_key",
)

SENSITIVE_METHODS = {"DELETE", "PUT", "PATCH"}


def _matches_sensitive_field(field_name: str) -> bool:
    lowered = field_name.lower()
    return any(pattern in lowered for pattern in SENSITIVE_FIELD_PATTERNS)


def _normalize_endpoint(endpoint: dict) -> dict:
    if not isinstance(endpoint, dict):
        raise ValueError("Each endpoint must be represented as a dictionary")
    return endpoint


def check_missing_security(parsed_api_data: dict) -> list[dict]:
    """Create a static finding when the specification declares no security schemes."""
    security_schemes = parsed_api_data.get("securitySchemes") or {}
    if security_schemes:
        return []

    reason = "No security schemes are declared in the OpenAPI specification"
    return [
        {
            "definition_id": STATIC_NAME_TO_ID["missing_security_scheme"],
            "test": "missing_security_scheme",
            "category": "authentication",
            "severity": "medium",
            "reason": reason,
            "source": "openapi",
            "scope": "spec",
        }
    ]


def check_insecure_http_server(parsed_api_data: dict) -> list[dict]:
    findings: list[dict] = []
    for server_url in parsed_api_data.get("serverUrls") or []:
        if isinstance(server_url, str) and server_url.lower().startswith("http://"):
            findings.append(
                {
                    "definition_id": STATIC_NAME_TO_ID["insecure_http_server"],
                    "test": "insecure_http_server",
                    "category": "transport",
                    "severity": "medium",
                    "reason": f"Server URL uses insecure HTTP transport: {server_url}",
                    "source": "openapi",
                    "server_url": server_url,
                }
            )
    return findings


def check_missing_endpoint_security(endpoint: dict) -> list[dict]:
    endpoint = _normalize_endpoint(endpoint)
    if endpoint.get("hasAuthentication") is True:
        return []

    return [
        {
            "definition_id": STATIC_NAME_TO_ID["missing_endpoint_security"],
            "test": "missing_endpoint_security",
            "category": "authentication",
            "severity": "medium",
            "reason": "Endpoint does not declare an OpenAPI security requirement",
            "source": "openapi",
            "endpoint": endpoint.get("path"),
            "method": endpoint.get("method"),
        }
    ]


def check_sensitive_response_fields(endpoint: dict) -> list[dict]:
    endpoint = _normalize_endpoint(endpoint)
    findings: list[dict] = []
    responses = endpoint.get("responses") or {}
    for status_code, response in responses.items():
        if not isinstance(response, dict):
            continue
        for field_name in response.get("fieldNames") or []:
            if not isinstance(field_name, str):
                continue
            if _matches_sensitive_field(field_name):
                findings.append(
                    {
                        "definition_id": STATIC_NAME_TO_ID["potential_sensitive_data_exposure"],
                        "test": "potential_sensitive_data_exposure",
                        "category": "data_exposure",
                        "severity": "high",
                        "reason": f"Response schema for status {status_code} includes potentially sensitive field '{field_name}'",
                        "source": "openapi",
                        "endpoint": endpoint.get("path"),
                        "method": endpoint.get("method"),
                        "status_code": str(status_code),
                        "field": field_name,
                    }
                )
    return findings


def check_sensitive_request_fields(endpoint: dict) -> list[dict]:
    endpoint = _normalize_endpoint(endpoint)
    findings: list[dict] = []
    for field_name in endpoint.get("requestBodyFields") or []:
        if not isinstance(field_name, str):
            continue
        if _matches_sensitive_field(field_name):
            findings.append(
                {
                    "definition_id": STATIC_NAME_TO_ID["potential_sensitive_data_exposure"],
                    "test": "potential_sensitive_data_exposure",
                    "category": "data_exposure",
                    "severity": "medium",
                    "reason": f"Request body includes potentially sensitive field '{field_name}'",
                    "source": "openapi",
                    "endpoint": endpoint.get("path"),
                    "method": endpoint.get("method"),
                    "field": field_name,
                }
            )
    return findings


def check_missing_input_constraints(endpoint: dict) -> list[dict]:
    endpoint = _normalize_endpoint(endpoint)
    findings: list[dict] = []
    for parameter in endpoint.get("parameters") or []:
        if not isinstance(parameter, dict):
            continue
        location = parameter.get("location")
        if location not in {"path", "query", "header", "cookie"}:
            continue
        param_type = parameter.get("type")
        pattern = parameter.get("pattern")
        format_hint = parameter.get("format")
        if param_type in {"string", "integer", "number", "array"} and not pattern and not format_hint:
            findings.append(
                {
                    "definition_id": STATIC_NAME_TO_ID["missing_input_constraints"],
                    "test": "missing_input_constraints",
                    "category": "schema",
                    "severity": "low",
                    "reason": (
                        f"Parameter '{parameter.get('name')}' in {location} lacks explicit validation constraints"
                    ),
                    "source": "openapi",
                    "endpoint": endpoint.get("path"),
                    "method": endpoint.get("method"),
                    "parameter": parameter.get("name"),
                    "parameter_location": location,
                }
            )
    return findings


def check_sensitive_methods(endpoint: dict) -> list[dict]:
    endpoint = _normalize_endpoint(endpoint)
    method = (endpoint.get("method") or "").upper()
    if method not in SENSITIVE_METHODS:
        return []

    severity = "high" if method == "DELETE" else "medium"
    return [
        {
            "definition_id": STATIC_NAME_TO_ID["sensitive_http_method"],
            "test": "sensitive_http_method",
            "category": "method",
            "severity": severity,
            "reason": f"{method} is a sensitive HTTP method that should be intentionally exposed",
            "source": "openapi",
            "endpoint": endpoint.get("path"),
            "method": endpoint.get("method"),
        }
    ]


def run_static_rules(parsed_api_data: dict) -> list[dict]:
    findings: list[dict] = []
    findings.extend(check_missing_security(parsed_api_data))
    findings.extend(check_insecure_http_server(parsed_api_data))

    for endpoint in parsed_api_data.get("endpoints") or []:
        findings.extend(check_missing_endpoint_security(endpoint))
        findings.extend(check_sensitive_response_fields(endpoint))
        findings.extend(check_sensitive_request_fields(endpoint))
        findings.extend(check_missing_input_constraints(endpoint))
        findings.extend(check_sensitive_methods(endpoint))

    return findings
