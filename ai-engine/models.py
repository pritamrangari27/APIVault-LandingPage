from pydantic import BaseModel, Field
from typing import List, Optional

class EndpointSpec(BaseModel):
    path: str
    method: str
    spec_content: str
    
class Finding(BaseModel):
    vulnerability: str = Field(description="The name of the vulnerability (e.g., Broken Authentication)")
    severity: str = Field(description="Critical, High, Medium, or Low")
    fix_code: str = Field(description="Actionable code snippet to fix the issue")
    explanation: str = Field(description="Brief explanation of why this is a vulnerability")

class AnalysisResult(BaseModel):
    endpoint: str = Field(description="The endpoint method and path (e.g., GET /users)")
    findings: List[Finding] = Field(description="List of security vulnerabilities found")
    architecture_suggestions: Optional[str] = Field(description="Overall architectural improvements for this endpoint")

class ScanResponse(BaseModel):
    scan_id: int
    filename: str
    total_endpoints: int
    results: List[AnalysisResult]
