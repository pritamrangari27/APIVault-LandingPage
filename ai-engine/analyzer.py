import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from models import EndpointSpec, AnalysisResult
import json

# Load environment variables (like GOOGLE_API_KEY)
load_dotenv()

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0)

# Use structured output to force Gemini to return JSON matching our Pydantic model
structured_llm = llm.with_structured_output(AnalysisResult)

FINDER_PROMPT = ChatPromptTemplate.from_template("""
You are an expert API security auditor. Analyze this OpenAPI endpoint specification:

Endpoint: {method} {path}
Specification:
{spec_content}

Find any security vulnerabilities based on the OWASP API Security Top 10 (e.g., Broken Auth, SQL injection, Missing Rate Limits, BOLA, IDOR, sensitive data exposure).
Provide concrete code fixes in your response. 
""")

REVIEWER_PROMPT = ChatPromptTemplate.from_template("""
You are a Senior Security Reviewer. You are reviewing the findings of a junior auditor.
Here is the original endpoint:
Endpoint: {method} {path}
Specification:
{spec_content}

Here are the junior auditor's findings (in JSON format):
{finder_json}

Your job is to:
1. Remove any "false positive" vulnerabilities that are not actually issues.
2. Improve the fix code if it's incorrect or incomplete.
3. Improve the architectural suggestions.

Return the finalized analysis.
""")

async def analyze_endpoint(endpoint: EndpointSpec) -> AnalysisResult:
    # Agent 1: The Finder
    finder_chain = FINDER_PROMPT | structured_llm
    finder_result = await finder_chain.ainvoke({
        "method": endpoint.method,
        "path": endpoint.path,
        "spec_content": endpoint.spec_content
    })
    
    # We must serialize the finder_result back to JSON string to pass into the reviewer prompt
    finder_json_str = finder_result.model_dump_json()

    # Agent 2: The Reviewer
    reviewer_chain = REVIEWER_PROMPT | structured_llm
    final_result = await reviewer_chain.ainvoke({
        "method": endpoint.method,
        "path": endpoint.path,
        "spec_content": endpoint.spec_content,
        "finder_json": finder_json_str
    })
    
    return final_result
