import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from models import AnalysisDataInput, ReportResponse

# Load environment variables (like GOOGLE_API_KEY)
load_dotenv()

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)

# Use structured output to force Gemini to return JSON matching our Pydantic model
structured_llm = llm.with_structured_output(ReportResponse)

REPORT_GENERATOR_PROMPT = ChatPromptTemplate.from_template("""
You are an Expert Application Security Architect. Your task is to generate a comprehensive, executive-level security report based on the findings from static and dynamic analysis.

Project Name: {project_name}

=== STATIC ANALYSIS FINDINGS ===
{static_analysis}
================================

=== DYNAMIC ANALYSIS FINDINGS ===
{dynamic_analysis}
=================================

Instructions:
1. Synthesize the findings from both static and dynamic analysis.
2. Identify cross-cutting vulnerabilities and eliminate any obvious false positives.
3. Group findings by severity (Critical, High, Medium, Low).
4. Provide actionable remediation steps and architectural improvements.
5. Format your response clearly in professional Markdown format.

Your output must be a well-structured Markdown string.
""")

async def generate_comprehensive_report(data: AnalysisDataInput) -> ReportResponse:
    # Convert arbitrary JSON payload to formatted string for the prompt
    static_str = json.dumps(data.static_analysis, indent=2) if not isinstance(data.static_analysis, str) else data.static_analysis
    dynamic_str = json.dumps(data.dynamic_analysis, indent=2) if not isinstance(data.dynamic_analysis, str) else data.dynamic_analysis
    
    # Run the prompt through the structured LLM chain
    chain = REPORT_GENERATOR_PROMPT | structured_llm
    
    result = await chain.ainvoke({
        "project_name": data.project_name,
        "static_analysis": static_str,
        "dynamic_analysis": dynamic_str
    })
    
    return result
