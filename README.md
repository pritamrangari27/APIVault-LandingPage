# ApiVault — Smart API Security Testing Platform

Automatically detects security vulnerabilities in your OpenAPI/Swagger specs
using rule-based analysis and AI-powered fix suggestions.

## Quick Start (Backend)
```bash
cd backend
docker-compose up -d        # start MySQL
./mvnw spring-boot:run      # start the app
```

POST http://localhost:8080/api/v1/analyze
- Body: form-data, key=file, value=your-openapi-spec.yaml
