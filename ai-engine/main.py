from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import EndpointSpec, AnalysisResult
from analyzer import analyze_endpoint

app = FastAPI(title="API Security AI Engine")

# Configure CORS to allow the React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_api_endpoint(request: EndpointSpec):
    # This calls the LangChain logic to analyze the endpoint
    result = await analyze_endpoint(request)
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
