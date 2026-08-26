"""Supported security test definitions for the apiVault security engine."""

from __future__ import annotations

STATIC_TEST_DEFINITIONS = {
    "STATIC-AUTH-001": {
        "id": "STATIC-AUTH-001",
        "name": "missing_security_scheme",
        "category": "authentication",
        "type": "static",
        "severity": "medium",
        "source": "openapi",
    },
    "STATIC-AUTH-002": {
        "id": "STATIC-AUTH-002",
        "name": "missing_endpoint_security",
        "category": "authentication",
        "type": "static",
        "severity": "medium",
        "source": "openapi",
    },
    "STATIC-DATA-001": {
        "id": "STATIC-DATA-001",
        "name": "potential_sensitive_data_exposure",
        "category": "data_exposure",
        "type": "static",
        "severity": "high",
        "source": "openapi",
    },
    "STATIC-TRANSPORT-001": {
        "id": "STATIC-TRANSPORT-001",
        "name": "insecure_http_server",
        "category": "transport",
        "type": "static",
        "severity": "medium",
        "source": "openapi",
    },
    "STATIC-SCHEMA-001": {
        "id": "STATIC-SCHEMA-001",
        "name": "missing_input_constraints",
        "category": "schema",
        "type": "static",
        "severity": "low",
        "source": "openapi",
    },
    "STATIC-METHOD-001": {
        "id": "STATIC-METHOD-001",
        "name": "sensitive_http_method",
        "category": "method",
        "type": "static",
        "severity": "medium",
        "source": "openapi",
    },
}

DYNAMIC_TEST_DEFINITIONS = {
    "DYNAMIC-AUTH-001": {
        "id": "DYNAMIC-AUTH-001",
        "name": "missing_authentication",
        "category": "authentication",
        "type": "dynamic",
        "severity": "high",
        "executor": "schemathesis",
    },
    "DYNAMIC-AUTH-002": {
        "id": "DYNAMIC-AUTH-002",
        "name": "invalid_authentication",
        "category": "authentication",
        "type": "dynamic",
        "severity": "high",
        "executor": "schemathesis",
    },
    "DYNAMIC-PARAM-001": {
        "id": "DYNAMIC-PARAM-001",
        "name": "invalid_parameter",
        "category": "input_validation",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
    "DYNAMIC-PARAM-002": {
        "id": "DYNAMIC-PARAM-002",
        "name": "boundary_value",
        "category": "input_validation",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
    "DYNAMIC-SCHEMA-001": {
        "id": "DYNAMIC-SCHEMA-001",
        "name": "schema_violation",
        "category": "schema",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
    "DYNAMIC-INPUT-001": {
        "id": "DYNAMIC-INPUT-001",
        "name": "malformed_input",
        "category": "input_validation",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
    "DYNAMIC-INPUT-002": {
        "id": "DYNAMIC-INPUT-002",
        "name": "missing_required_field",
        "category": "input_validation",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
    "DYNAMIC-STATUS-001": {
        "id": "DYNAMIC-STATUS-001",
        "name": "unexpected_status_code",
        "category": "response",
        "type": "dynamic",
        "severity": "low",
        "executor": "schemathesis",
    },
    "DYNAMIC-RESPONSE-001": {
        "id": "DYNAMIC-RESPONSE-001",
        "name": "response_schema_validation",
        "category": "response",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
    "DYNAMIC-METHOD-001": {
        "id": "DYNAMIC-METHOD-001",
        "name": "method_behavior",
        "category": "method",
        "type": "dynamic",
        "severity": "medium",
        "executor": "schemathesis",
    },
}

STATIC_NAME_TO_ID = {definition["name"]: test_id for test_id, definition in STATIC_TEST_DEFINITIONS.items()}
DYNAMIC_NAME_TO_ID = {definition["name"]: test_id for test_id, definition in DYNAMIC_TEST_DEFINITIONS.items()}

TEST_NAME_TO_DEFINITION = {
    **{definition["name"]: definition for definition in STATIC_TEST_DEFINITIONS.values()},
    **{definition["name"]: definition for definition in DYNAMIC_TEST_DEFINITIONS.values()},
}


def get_definition_by_name(name: str) -> dict:
    try:
        return TEST_NAME_TO_DEFINITION[name]
    except KeyError as exc:
        raise KeyError(f"Unsupported test definition: {name}") from exc
