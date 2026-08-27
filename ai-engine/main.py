from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from models import AnalysisDataInput, ReportResponse
from analyzer import generate_comprehensive_report

app = FastAPI(title="API Vault - Security AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-report", response_model=ReportResponse)
async def generate_report_endpoint(request: AnalysisDataInput):
    """
    Accepts static and dynamic analysis findings and generates a comprehensive Markdown security report using an LLM.
    """
    try:
        result = await generate_comprehensive_report(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
