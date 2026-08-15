# SpecParserService - Developer Guide

> **Module:** Parser
>
> **Purpose:** Parse an OpenAPI Specification (YAML/JSON) into an internal Java model (`ParsedSpec`) that can later be used by the Security Analyzer.

---

# 1. Purpose

`SpecParserService` is responsible for converting an OpenAPI specification into Java objects that the application understands.

Instead of analyzing the YAML file directly, the parser extracts all useful information into structured models such as:

- ParsedSpec
- EndpointInfo
- ParameterInfo
- ResponseInfo

These models become the foundation for all future security analysis.

---

# 2. Why this class exists

The security engine should never work directly with raw YAML or JSON.

Instead of repeatedly reading OpenAPI objects throughout the project, the parser converts everything into our own models.

```
OpenAPI YAML
      │
      ▼
Swagger Parser
      │
      ▼
OpenAPI Object
      │
      ▼
SpecParserService
      │
      ▼
ParsedSpec
      │
      ▼
Security Analyzer
```

This separation makes the project:

- easier to maintain
- easier to test
- independent from Swagger library changes
- easier to extend later

---

# 3. Overall Workflow

```
Uploaded File
      │
      ▼
parse(file)
      │
      ▼
Read file as UTF-8 String
      │
      ▼
parseContent(content)
      │
      ▼
OpenAPIV3Parser
      │
      ▼
OpenAPI Object
      │
      ▼
buildParsedSpec()
      │
      ▼
Extract Endpoints
      │
      ▼
buildEndpointInfo()
      │
      ▼
ParsedSpec
```

---

# 4. Architecture Diagram

```
                  Uploaded OpenAPI File
                           │
                           ▼
                  MultipartFile (Spring)
                           │
                           ▼
                     parse(file)
                           │
                           ▼
                 Convert bytes → String
                           │
                           ▼
                  parseContent(content)
                           │
                           ▼
                  OpenAPIV3Parser
                           │
                           ▼
                     OpenAPI Object
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
        Info            Components         Paths
                                              │
                                              ▼
                             extractEndpointsFromPath()
                                              │
                                              ▼
                                 buildEndpointInfo()
                                              │
          ┌───────────────┬────────────────┬──────────────┐
          ▼               ▼                ▼              ▼
      Parameters      Authentication   Responses    Request Body
                                              │
                                              ▼
                                        ParsedSpec
```

---

# 5. Method-by-Method Explanation

---

## parse()

### Responsibility

Acts as the entry point of the parser.

### Input

```
MultipartFile
```

### Processing

- Reads uploaded file
- Converts bytes into UTF-8 String
- Delegates parsing to `parseContent()`

### Why?

Separating file reading from parsing makes the parser easier to test.

Instead of mocking `MultipartFile`, we can directly call:

```java
parseContent(yamlString);
```

---

## parseContent()

### Responsibility

Converts the OpenAPI YAML/JSON text into an OpenAPI Java object.

### Processing

1. Configure parser options
2. Resolve `$ref`
3. Parse YAML
4. Validate parsing
5. Return OpenAPI object

### Why resolve references?

OpenAPI frequently uses

```yaml
$ref:
```

Without resolving references we would only receive pointers.

With

```java
setResolveFully(true)
```

the parser loads the complete schema automatically.

---

## buildParsedSpec()

### Responsibility

Builds the application's main model (`ParsedSpec`).

### Extracts

- API title
- version
- description
- server URLs
- security schemes
- global security
- endpoints

### Output

```
ParsedSpec
```

This method coordinates the parsing process but delegates endpoint extraction to another method.

---

## extractEndpointsFromPath()

### Responsibility

Processes one API path and extracts every HTTP operation.

Example

```
/users
    GET
    POST
    DELETE
```

becomes

```
GET /users

POST /users

DELETE /users
```

Each operation becomes one `EndpointInfo`.

---

## buildEndpointInfo()

### Responsibility

Creates one complete `EndpointInfo` object.

### Extracts

- Path
- HTTP Method
- Summary
- Description
- Tags
- Authentication
- Parameters
- Request Body
- Responses
- Rate Limit
- Deprecated Flag

### Output

```
EndpointInfo
```

This is the core method of the parser.

Almost every security-related piece of information is extracted here.

---

# 6. Builder Pattern Explanation

Instead of creating objects using constructors,

```java
new EndpointInfo(...)
```

the project uses Lombok's Builder Pattern.

Example

```java
EndpointInfo.builder()
        .path(path)
        .method(method)
        .summary(summary)
        .build();
```

## Advantages

- More readable
- Easier to maintain
- Optional fields become simple
- No huge constructors
- Easy to extend later

The builder is filled step-by-step until `build()` creates the final object.

---

# 7. Why I Used Streams

Streams make collection processing cleaner.

Instead of writing loops,

```java
for(Server s : servers){
    urls.add(s.getUrl());
}
```

I can write

```java
servers.stream()
       .map(Server::getUrl)
       .filter(Objects::nonNull)
       .toList();
```

Benefits

- Less code
- Better readability
- Easier transformations
- Functional style

Streams are mainly used for

- extracting server URLs
- processing security schemes
- filtering null values

---

# 8. Authentication Logic

Authentication follows OpenAPI inheritance rules.

There are three possible cases.

## Case 1

Operation defines security

```yaml
security:
  - bearerAuth: []
```

Result

```
Authentication = true
Scheme = bearerAuth
```

---

## Case 2

Operation explicitly disables security

```yaml
security: []
```

Result

```
Authentication = false
```

---

## Case 3

Operation has no security section

```
security omitted
```

The endpoint inherits global security.

If global security exists

```
Authentication = true
```

Otherwise

```
Authentication = false
```

This logic follows the OpenAPI specification correctly.

---

# 9. Response Extraction

Every response code is extracted.

Example

```yaml
responses:
  "200":
  "404":
  "500":
```

becomes

```
200 → ResponseInfo

404 → ResponseInfo

500 → ResponseInfo
```

Each `ResponseInfo` stores

- status code
- response field names
- response field types

These response models will later be useful for security checks such as

- Information Disclosure
- Sensitive Data Exposure
- Error Message Analysis

---

# 10. Design Decisions

## Separation of Concerns

Each method has one responsibility.

| Method | Responsibility |
|---------|----------------|
| parse() | Read uploaded file |
| parseContent() | Parse OpenAPI |
| buildParsedSpec() | Build ParsedSpec |
| extractEndpointsFromPath() | Extract operations |
| buildEndpointInfo() | Build EndpointInfo |

---

## Builder Pattern

Chosen because models contain many optional fields.

---

## Internal Models

Instead of exposing Swagger objects everywhere, the application converts everything into internal models.

Benefits

- Easier testing
- Better abstraction
- Independent of Swagger implementation

---

## Small Methods

Large tasks are broken into smaller methods.

Instead of one 1000-line parser, responsibilities are separated.

---

# 11. Things I Learned

While implementing this parser, I learned:

- How OpenAPI specifications are represented in Java.
- How Swagger Parser converts YAML into Java objects.
- How `$ref` resolution works.
- How Builder Pattern improves object construction.
- How Java Streams simplify collection processing.
- How authentication inheritance works in OpenAPI.
- How to model API metadata independently of external libraries.
- Why separating parsing from analysis makes the architecture cleaner.
- How to design methods with a single responsibility.
- The importance of null checks when parsing optional OpenAPI fields.

---

# 12. Future Improvements

Some ideas to improve the parser in the future:

- Support recursive schema traversal.
- Better handling of `oneOf`, `anyOf`, and `allOf`.
- Extract enums and default values.
- Parse examples from schemas.
- Support callbacks and webhooks.
- Detect circular schema references.
- Improve request/response schema flattening.
- Cache parsed specifications.
- Add parser metrics and timing.
- Improve validation and error reporting.
- Support OpenAPI 3.1-specific features.
- Generate richer metadata for the Security Analyzer.

---

# Summary

The responsibility of `SpecParserService` is to transform an OpenAPI specification into an application-specific model (`ParsedSpec`).

Instead of allowing the Security Analyzer to understand YAML or Swagger objects, the parser performs that work once and produces clean Java models.

The overall flow is:

```
OpenAPI File
      │
      ▼
SpecParserService
      │
      ▼
ParsedSpec
      │
      ▼
Security Analyzer
      │
      ▼
Security Findings
```

This design keeps parsing independent from security analysis, making the project easier to maintain, test, and extend.