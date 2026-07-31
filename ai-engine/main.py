from fastapi import FastAPI
from models import EndpointSpec, AnalysisResult
from analyzer import analyze_endpoint

app = FastAPI(title="API Security AI Engine")

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_api_endpoint(request: EndpointSpec):
    # This calls the LangChain logic to analyze the endpoint
    result = await analyze_endpoint(request)
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
