package com.apisecurity.platform.service.rules;

import com.apisecurity.platform.model.Finding;
import com.apisecurity.platform.model.ParsedSpec;

import java.util.List;

/**
 * Every security rule implements this interface.
 * One rule = one OWASP vulnerability category.
 * Each rule is responsible for checking the entire spec
 * for its specific vulnerability type.
 */

public interface SecurityRule {

    /**
     * Run this rule against the parsed spec.
     * Returns empty list if no issues found — never returns null.
     *
     * @param spec the fully parsed OpenAPI spec
     * @return list of findings — empty if spec passes this check
     */
    List<Finding> check(ParsedSpec spec);

    /**
     * Human-readable name of this rule.
     * Used in logs and the detectedBy field of Finding.
     */
    String getRuleName();
}
