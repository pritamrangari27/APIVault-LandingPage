import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from models import EndpointSpec, AnalysisResult

# Load environment variables (like GOOGLE_API_KEY)
load_dotenv()

# Initialize the Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)

# Use structured output to force Gemini to return JSON matching our Pydantic model
structured_llm = llm.with_structured_output(AnalysisResult)

SECURITY_PROMPT = ChatPromptTemplate.from_template("""
You are an expert API security auditor. Analyze this OpenAPI endpoint specification:

Endpoint: {method} {path}
Specification:
{spec_content}

Find any security vulnerabilities based on the OWASP API Security Top 10 (e.g., Broken Auth, SQL injection, Missing Rate Limits, BOLA, IDOR, sensitive data exposure).
Provide concrete code fixes in your response. 
""")

async def analyze_endpoint(endpoint: EndpointSpec) -> AnalysisResult:
    chain = SECURITY_PROMPT | structured_llm
    
    result = await chain.ainvoke({
        "method": endpoint.method,
        "path": endpoint.path,
        "spec_content": endpoint.spec_content
    })
    
    return result
