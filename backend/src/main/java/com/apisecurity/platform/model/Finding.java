package com.apisecurity.platform.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Finding {

    // which endpoint this finding is about
    private String endpoint;     // e.g. "/users/{id}"
    private String method;       // e.g. "GET"

    // severity levels — used for sorting and scoring
    private Severity severity;

    // short name of the vulnerability
    private String title;

    // detailed explanation of what the problem is
    private String description;

    // concrete advice on how to fix it
    private String fix;

    // which OWASP category this belongs to
    private String owaspCategory;

    // which rule detected this
    private String detectedBy;

    public enum Severity {
        CRITICAL,   // must fix before going live
        HIGH,       // should fix very soon
        MEDIUM,     // fix in next sprint
        LOW         // good to fix eventually
    }
}
