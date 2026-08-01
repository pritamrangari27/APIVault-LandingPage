import yaml
import io
import csv
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from models import EndpointSpec, AnalysisResult, ScanResponse
from analyzer import analyze_endpoint
from database import engine, Base, get_db
import db_models

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Security AI Engine")

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

@app.post("/scan/file", response_model=ScanResponse)
async def upload_and_scan_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    try:
        if file.filename.endswith(".json") or file.filename.endswith(".yaml") or file.filename.endswith(".yml"):
            parsed_spec = yaml.safe_load(content)
        else:
            raise HTTPException(status_code=400, detail="Only JSON and YAML files are supported")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse OpenAPI file: {str(e)}")

    if "paths" not in parsed_spec:
        raise HTTPException(status_code=400, detail="No 'paths' found in OpenAPI specification")

    # Create Scan entry in DB
    db_scan = db_models.Scan(filename=file.filename)
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    analysis_results = []
    
    for path, path_item in parsed_spec.get("paths", {}).items():
        for method, operation in path_item.items():
            if method.lower() not in ["get", "post", "put", "delete", "patch"]:
                continue
            
            # Format the spec content for the LLM
            spec_content = yaml.dump(operation)
            endpoint_spec = EndpointSpec(path=path, method=method.upper(), spec_content=spec_content)
            
            # Run AI analysis
            try:
                result = await analyze_endpoint(endpoint_spec)
            except Exception as e:
                # If Gemini fails on one endpoint, we shouldn't crash the whole scan
                print(f"Failed to analyze {method} {path}: {e}")
                continue
                
            analysis_results.append(result)

            # Save to DB
            db_endpoint = db_models.EndpointAnalysis(
                scan_id=db_scan.id,
                method=method.upper(),
                path=path,
                architecture_suggestions=result.architecture_suggestions
            )
            db.add(db_endpoint)
            db.commit()
            db.refresh(db_endpoint)

            for finding in result.findings:
                db_finding = db_models.Vulnerability(
                    endpoint_analysis_id=db_endpoint.id,
                    vulnerability=finding.vulnerability,
                    severity=finding.severity,
                    fix_code=finding.fix_code,
                    explanation=finding.explanation
                )
                db.add(db_finding)
            db.commit()

    return ScanResponse(
        scan_id=db_scan.id,
        filename=file.filename,
        total_endpoints=len(analysis_results),
        results=analysis_results
    )

@app.get("/scans/{scan_id}/report/csv")
async def download_csv_report(scan_id: int, db: Session = Depends(get_db)):
    db_scan = db.query(db_models.Scan).filter(db_models.Scan.id == scan_id).first()
    if not db_scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Scan ID", "Filename", "Endpoint Method", "Endpoint Path", "Vulnerability", "Severity", "Explanation", "Fix Code"])

    for endpoint in db_scan.endpoints:
        if not endpoint.findings:
            writer.writerow([db_scan.id, db_scan.filename, endpoint.method, endpoint.path, "None Found", "Safe", "", ""])
        for finding in endpoint.findings:
            writer.writerow([
                db_scan.id, 
                db_scan.filename, 
                endpoint.method, 
                endpoint.path, 
                finding.vulnerability, 
                finding.severity, 
                finding.explanation, 
                finding.fix_code
            ])
            
    csv_content = output.getvalue()
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=scan_{scan_id}_report.csv"}
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
