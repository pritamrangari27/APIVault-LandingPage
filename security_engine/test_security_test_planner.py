from __future__ import annotations

import json
from pathlib import Path

import pytest

from security_engine.security_test_planner import DEFAULT_INPUT_FILE, DEFAULT_OUTPUT_FILE, generate_test_plan


def load_demo_input() -> dict:
    with DEFAULT_INPUT_FILE.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def test_generate_test_plan_creates_valid_json_and_is_deterministic() -> None:
    parsed = load_demo_input()

    first_plan = generate_test_plan(parsed)
    second_plan = generate_test_plan(parsed)

    assert first_plan == second_plan
    assert DEFAULT_OUTPUT_FILE.exists()

    with DEFAULT_OUTPUT_FILE.open("r", encoding="utf-8") as handle:
        file_plan = json.load(handle)

    assert file_plan == first_plan
    assert first_plan["summary"]["total_endpoints"] == 8
    assert first_plan["summary"]["static_test_count"] == len(first_plan["static_tests"])
    assert first_plan["summary"]["dynamic_test_count"] == len(first_plan["dynamic_tests"])

    dynamic_keys = {
        (
            test.get("endpoint"),
            test.get("method"),
            test.get("test"),
            test.get("parameter"),
            test.get("field"),
            test.get("server_url"),
        )
        for test in first_plan["dynamic_tests"]
    }
    assert len(dynamic_keys) == len(first_plan["dynamic_tests"])

    static_keys = {
        (
            test.get("endpoint"),
            test.get("method"),
            test.get("test"),
            test.get("parameter"),
            test.get("field"),
            test.get("server_url"),
        )
        for test in first_plan["static_tests"]
    }
    assert len(static_keys) == len(first_plan["static_tests"])


def test_generate_test_plan_plans_endpoint_specific_dynamic_tests() -> None:
    parsed = load_demo_input()
    plan = generate_test_plan(parsed)

    users_get_dynamic = [
        test for test in plan["dynamic_tests"] if test["endpoint"] == "/users/{id}" and test["method"] == "GET"
    ]
    assert any(test["test"] == "invalid_parameter" for test in users_get_dynamic)
    assert any(test["test"] == "boundary_value" for test in users_get_dynamic)
    assert any(test["test"] == "response_schema_validation" for test in users_get_dynamic)
    assert any(test["test"] == "missing_authentication" for test in users_get_dynamic)

    post_users_dynamic = [test for test in plan["dynamic_tests"] if test["endpoint"] == "/users" and test["method"] == "POST"]
    assert any(test["test"] == "schema_violation" for test in post_users_dynamic)
    assert any(test["test"] == "missing_required_field" for test in post_users_dynamic)
    assert any(test["test"] == "method_behavior" for test in post_users_dynamic)

    login_dynamic = [test for test in plan["dynamic_tests"] if test["endpoint"] == "/login" and test["method"] == "POST"]
    assert any(test["test"] == "malformed_input" for test in login_dynamic)
    assert any(test["test"] == "response_schema_validation" for test in login_dynamic)


def test_generate_test_plan_detects_static_issues() -> None:
    parsed = load_demo_input()
    plan = generate_test_plan(parsed)

    assert any(test["test"] == "insecure_http_server" for test in plan["static_tests"])
    assert any(test["test"] == "potential_sensitive_data_exposure" for test in plan["static_tests"])
    assert any(test["test"] == "missing_input_constraints" for test in plan["static_tests"])
    assert any(test["test"] == "sensitive_http_method" for test in plan["static_tests"])
    assert any(test["test"] == "missing_endpoint_security" for test in plan["static_tests"])


def test_generate_test_plan_rejects_malformed_input() -> None:
    with pytest.raises(ValueError, match="Malformed parser output"):
        generate_test_plan({"not_endpoints": []})

    with pytest.raises(ValueError, match="Each endpoint must contain both 'path' and 'method'"):
        generate_test_plan({"endpoints": [{"path": "/broken"}]})
