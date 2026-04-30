from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import spacy
import pdfplumber
import re
import io
import uvicorn
from typing import List

# Load English NLP model (requires running: python -m spacy download en_core_web_sm)
nlp = spacy.load("en_core_web_sm")

app = FastAPI(title="Resume Parser API", description="AI service for parsing resumes and matching jobs")

class JobMatchRequest(BaseModel):
    resume_text: str
    required_skills: List[str]
    experience_required: int

class MatchResponse(BaseModel):
    match_percentage: float
    extracted_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]

# Simple Hardcoded Tech Skill Dictionary for extraction
TECH_SKILLS = {"python", "java", "react", "spring boot", "sql", "mysql", "javascript", 
               "aws", "docker", "kubernetes", "node.js", "c++", "c#", "html", "css", 
               "angular", "vue", "fastapi", "django"}

def extract_text_from_pdf(file_bytes):
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

def extract_skills(text: str) -> List[str]:
    doc = nlp(text.lower())
    extracted = set()
    
    # Simple extraction logic based on predefined dictionary
    # In a real SaaS, this would use NER (Named Entity Recognition) trained on Resumes
    for token in doc:
        if token.text in TECH_SKILLS:
            extracted.add(token.text)
    
    # Also check for multi-word skills (like "spring boot")
    for skill in TECH_SKILLS:
        if " " in skill and skill in text.lower():
            extracted.add(skill)
            
    return list(extracted)

@app.post("/api/v1/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Extracts text and skills directly from an uploaded PDF resume."""
    contents = await file.read()
    if file.filename.endswith('.pdf'):
        text = extract_text_from_pdf(contents)
    else:
        text = contents.decode("utf-8") # Fallback for txt
        
    skills = extract_skills(text)
    
    return {
        "filename": file.filename,
        "extracted_skills": skills,
        "raw_text": text[:500] + "..." # return preview
    }

@app.post("/api/v1/match", response_model=MatchResponse)
async def match_job(req: JobMatchRequest):
    """Matches parsed resume text against job requirements and returns a score."""
    candidate_skills = extract_skills(req.resume_text)
    
    req_skills_lower = [s.lower().strip() for s in req.required_skills]
    
    matched = [s for s in req_skills_lower if s in candidate_skills]
    missing = [s for s in req_skills_lower if s not in candidate_skills]
    
    score = 0.0
    if len(req_skills_lower) > 0:
        score = (len(matched) / len(req_skills_lower)) * 100.0
        
    # In a production system, we'd also parse years of experience and weigh it here.
    # For now, it's a pure skill keyword match.
    
    return MatchResponse(
        match_percentage=round(score, 2),
        extracted_skills=candidate_skills,
        matched_skills=matched,
        missing_skills=missing
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
