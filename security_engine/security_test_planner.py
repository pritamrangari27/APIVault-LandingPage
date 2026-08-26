"""Deterministic security test planner for apiVault."""

from __future__ import annotations

import json
from collections import defaultdict
from copy import deepcopy
from pathlib import Path
from typing import Any

try:  # pragma: no cover - supports direct script execution
    from .security_rules import run_static_rules
    from .test_definitions import DYNAMIC_NAME_TO_ID, STATIC_NAME_TO_ID
except ImportError:  # pragma: no cover
    from security_rules import run_static_rules
    from test_definitions import DYNAMIC_NAME_TO_ID, STATIC_NAME_TO_ID

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_INPUT_FILE = BASE_DIR / "demo_parser_output.json"
DEFAULT_OUTPUT_FILE = BASE_DIR / "test.json"

INPUT_FIELD_ERROR = (
    "Malformed parser output. Expected a ParsedSpec-style dictionary with an 'endpoints' list."
)


def _load_json_file(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Parser output file not found: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _normalize_parsed_api_data(parsed_api_data: Any) -> dict:
    if parsed_api_data is None:
        raise ValueError(INPUT_FIELD_ERROR)

    if hasattr(parsed_api_data, "model_dump"):
        parsed_api_data = parsed_api_data.model_dump()
    elif hasattr(parsed_api_data, "to_dict"):
        parsed_api_data = parsed_api_data.to_dict()
    elif hasattr(parsed_api_data, "__dict__") and not isinstance(parsed_api_data, dict):
        parsed_api_data = {
            key: value
            for key, value in vars(parsed_api_data).items()
            if not key.startswith("_")
        }

    if not isinstance(parsed_api_data, dict):
        raise ValueError(INPUT_FIELD_ERROR)

    endpoints = parsed_api_data.get("endpoints")
    if endpoints is None:
        raise ValueError("Malformed parser output. Missing 'endpoints' field.")
    if not isinstance(endpoints, list):
        raise ValueError("Malformed parser output. The 'endpoints' field must be a list.")

    normalized = deepcopy(parsed_api_data)
    normalized.setdefault("serverUrls", [])
    normalized.setdefault("securitySchemes", {})
    normalized.setdefault("globalSecurity", [])
    normalized.setdefault("endpoints", endpoints)
    return normalized


def _endpoint_key(endpoint: dict) -> tuple[str, str]:
    path = endpoint.get("path")
    method = endpoint.get("method")
    if not path or not method:
        raise ValueError("Each endpoint must contain both 'path' and 'method'.")
    return method.upper(), path


def _build_static_test(definition_name: str, endpoint: dict | None = None, extra: dict | None = None) -> dict:
    definition_id = STATIC_NAME_TO_ID[definition_name]
    test = {
        "id": definition_id,
        "category": {
            "missing_security_scheme": "authentication",
            "missing_endpoint_security": "authentication",
            "potential_sensitive_data_exposure": "data_exposure",
            "insecure_http_server": "transport",
            "missing_input_constraints": "schema",
            "sensitive_http_method": "method",
        }[definition_name],
        "test": definition_name,
        "severity": {
            "missing_security_scheme": "medium",
            "missing_endpoint_security": "medium",
            "potential_sensitive_data_exposure": "high",
            "insecure_http_server": "medium",
            "missing_input_constraints": "low",
            "sensitive_http_method": "medium",
        }[definition_name],
        "reason": "",
        "source": "openapi",
    }
    if endpoint:
        test["endpoint"] = endpoint.get("path")
        test["method"] = endpoint.get("method")
    if extra:
        test.update(extra)
    return test


def _build_dynamic_test(definition_name: str, endpoint: dict | None = None, extra: dict | None = None) -> dict:
    definition_id = DYNAMIC_NAME_TO_ID[definition_name]
    test = {
        "id": definition_id,
        "category": {
            "missing_authentication": "authentication",
            "invalid_authentication": "authentication",
            "invalid_parameter": "input_validation",
            "boundary_value": "input_validation",
            "schema_violation": "schema",
            "malformed_input": "input_validation",
            "missing_required_field": "input_validation",
            "unexpected_status_code": "response",
            "response_schema_validation": "response",
            "method_behavior": "method",
        }[definition_name],
        "test": definition_name,
        "severity": {
            "missing_authentication": "high",
            "invalid_authentication": "high",
            "invalid_parameter": "medium",
            "boundary_value": "medium",
            "schema_violation": "medium",
            "malformed_input": "medium",
            "missing_required_field": "medium",
            "unexpected_status_code": "low",
            "response_schema_validation": "medium",
            "method_behavior": "medium",
        }[definition_name],
        "executor": "schemathesis",
        "reason": "",
    }
    if endpoint:
        test["endpoint"] = endpoint.get("path")
        test["method"] = endpoint.get("method")
    if extra:
        test.update(extra)
    return test


def _parameter_tests(endpoint: dict) -> list[dict]:
    tests: list[dict] = []
    method = (endpoint.get("method") or "").upper()
    for parameter in endpoint.get("parameters") or []:
        if not isinstance(parameter, dict):
            continue
        location = parameter.get("location")
        name = parameter.get("name")
        if location not in {"path", "query", "header", "cookie"} or not name:
            continue

        tests.append(
            _build_dynamic_test(
                "invalid_parameter",
                endpoint,
                {
                    "parameter": name,
                    "parameter_location": location,
                    "reason": f"{location.title()} parameter is available for dynamic validation",
                },
            )
        )

        if parameter.get("type") in {"string", "integer", "number", "array"}:
            tests.append(
                _build_dynamic_test(
                    "boundary_value",
                    endpoint,
                    {
                        "parameter": name,
                        "parameter_location": location,
                        "reason": f"{location.title()} parameter supports boundary-value testing",
                    },
                )
            )

        if method in {"GET", "DELETE", "PATCH", "PUT", "POST"} and location == "path":
            tests.append(
                _build_dynamic_test(
                    "schema_violation",
                    endpoint,
                    {
                        "parameter": name,
                        "parameter_location": location,
                        "reason": "Path parameter can be probed with schema-violating values",
                    },
                )
            )
    return tests


def _body_tests(endpoint: dict) -> list[dict]:
    tests: list[dict] = []
    if not endpoint.get("hasRequestBody"):
        return tests

    tests.append(
        _build_dynamic_test(
            "schema_violation",
            endpoint,
            {"reason": "Request body is available for schema-based validation"},
        )
    )
    tests.append(
        _build_dynamic_test(
            "malformed_input",
            endpoint,
            {"reason": "Request body is available for malformed input testing"},
        )
    )
    tests.append(
        _build_dynamic_test(
            "missing_required_field",
            endpoint,
            {"reason": "Request body can be probed for missing required fields"},
        )
    )

    for field_name in endpoint.get("requestBodyFields") or []:
        if not isinstance(field_name, str):
            continue
        if field_name.lower() in {"password", "token", "secret", "api_key", "apikey"}:
            tests.append(
                _build_dynamic_test(
                    "schema_violation",
                    endpoint,
                    {
                        "field": field_name,
                        "reason": f"Request body field '{field_name}' should be included in schema-violation checks",
                    },
                )
            )
    return tests


def _response_tests(endpoint: dict) -> list[dict]:
    tests: list[dict] = []
    if endpoint.get("responses"):
        tests.append(
            _build_dynamic_test(
                "unexpected_status_code",
                endpoint,
                {"reason": "Declared responses allow status-code validation"},
            )
        )
        tests.append(
            _build_dynamic_test(
                "response_schema_validation",
                endpoint,
                {"reason": "Declared responses allow response schema validation"},
            )
        )
    return tests


def _method_tests(endpoint: dict) -> list[dict]:
    method = (endpoint.get("method") or "").upper()
    if method in {"POST", "PUT", "PATCH", "DELETE"}:
        return [
            _build_dynamic_test(
                "method_behavior",
                endpoint,
                {"reason": f"{method} endpoints should be checked for method-specific behavior"},
            )
        ]
    return []


def _authentication_tests(endpoint: dict) -> list[dict]:
    if endpoint.get("hasAuthentication") is not True:
        return []
    tests = [
        _build_dynamic_test(
            "missing_authentication",
            endpoint,
            {"reason": "Endpoint declares authentication and should be checked without credentials"},
        ),
        _build_dynamic_test(
            "invalid_authentication",
            endpoint,
            {"reason": "Endpoint declares authentication and should be checked with invalid credentials"},
        ),
    ]
    schemes = endpoint.get("securitySchemes") or []
    if schemes:
        tests[0]["security_schemes"] = list(schemes)
        tests[1]["security_schemes"] = list(schemes)
    return tests


def _deduplicate_tests(tests: list[dict]) -> list[dict]:
    unique: list[dict] = []
    seen: set[tuple[Any, ...]] = set()
    for test in tests:
        key = (
            test.get("endpoint"),
            test.get("method"),
            test.get("test"),
            test.get("parameter"),
            test.get("field"),
            test.get("server_url"),
            test.get("status_code"),
        )
        if key in seen:
            continue
        seen.add(key)
        unique.append(test)
    return unique


def _assign_ids(tests: list[dict], prefix: str) -> None:
    counters: defaultdict[str, int] = defaultdict(int)
    for test in tests:
        category = test["category"].upper()
        counters[category] += 1
        test["id"] = f"{prefix}-{category[:4] if category not in {'INPUT_VALIDATION', 'INPUT'} else 'INPUT'}-{counters[category]:03d}"


def _format_id_prefix(category: str) -> str:
    mapping = {
        "authentication": "AUTH",
        "data_exposure": "DATA",
        "transport": "TRANSPORT",
        "schema": "SCHEMA",
        "method": "METHOD",
        "input_validation": "PARAM",
        "response": "RESPONSE",
    }
    return mapping.get(category, category.upper())


def _renumber_tests(tests: list[dict], prefix: str) -> None:
    counters: defaultdict[str, int] = defaultdict(int)
    for test in tests:
        category = test["category"]
        counters[category] += 1
        test["id"] = f"{prefix}-{_format_id_prefix(category)}-{counters[category]:03d}"


def generate_test_plan(parsed_api_data: Any) -> dict:
    """Build a deterministic test plan from ParsedSpec-style parser output."""
    normalized = _normalize_parsed_api_data(parsed_api_data)
    endpoints = normalized.get("endpoints") or []

    for endpoint in endpoints:
        if not isinstance(endpoint, dict):
            raise ValueError("Each endpoint must be a dictionary")
        _endpoint_key(endpoint)

    static_tests = _deduplicate_tests(run_static_rules(normalized))
    dynamic_tests: list[dict] = []

    for endpoint in endpoints:
        dynamic_tests.extend(_authentication_tests(endpoint))
        dynamic_tests.extend(_parameter_tests(endpoint))
        dynamic_tests.extend(_body_tests(endpoint))
        dynamic_tests.extend(_response_tests(endpoint))
        dynamic_tests.extend(_method_tests(endpoint))

    dynamic_tests = _deduplicate_tests(dynamic_tests)

    _renumber_tests(static_tests, "STATIC")
    _renumber_tests(dynamic_tests, "DYNAMIC")

    plan = {
        "version": "1.0",
        "planner": "apivault-security-engine",
        "summary": {
            "total_endpoints": len(endpoints),
            "static_test_count": len(static_tests),
            "dynamic_test_count": len(dynamic_tests),
        },
        "static_tests": static_tests,
        "dynamic_tests": dynamic_tests,
    }

    with DEFAULT_OUTPUT_FILE.open("w", encoding="utf-8") as handle:
        json.dump(plan, handle, indent=2, sort_keys=False)
        handle.write("\n")

    return plan


def _print_summary(plan: dict) -> None:
    print("[+] Loaded parser output")
    print(f"[+] Endpoints analyzed: {plan['summary']['total_endpoints']}")
    print()
    print("[STATIC]")
    static_by_endpoint: dict[tuple[str | None, str | None], int] = defaultdict(int)
    for test in plan["static_tests"]:
        static_by_endpoint[(test.get("endpoint"), test.get("method"))] += 1
    for (endpoint, method), count in sorted(static_by_endpoint.items(), key=lambda item: ((item[0][0] or ""), (item[0][1] or ""))):
        print(f"  [+] {method} {endpoint} → {count} tests")
    print()
    print("[DYNAMIC]")
    dynamic_by_endpoint: dict[tuple[str | None, str | None], int] = defaultdict(int)
    for test in plan["dynamic_tests"]:
        dynamic_by_endpoint[(test.get("endpoint"), test.get("method"))] += 1
    for (endpoint, method), count in sorted(dynamic_by_endpoint.items(), key=lambda item: ((item[0][0] or ""), (item[0][1] or ""))):
        print(f"  [+] {method} {endpoint} → {count} tests")
    print()
    print(f"[+] Static tests: {plan['summary']['static_test_count']}")
    print(f"[+] Dynamic tests: {plan['summary']['dynamic_test_count']}")
    print("[+] Test plan written to:")
    print(f"    {DEFAULT_OUTPUT_FILE}")


def main() -> None:
    print("[+] Security Engine started")
    print("[+] Parsing planner input")
    parsed_api_data = _load_json_file(DEFAULT_INPUT_FILE)
    plan = generate_test_plan(parsed_api_data)
    _print_summary(plan)


if __name__ == "__main__":
    main()
