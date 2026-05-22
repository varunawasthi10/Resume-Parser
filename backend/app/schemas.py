from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Auth schemas
class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: str = ""

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Resume schemas
class ResumeResponse(BaseModel):
    id: int
    filename: str
    candidate_name: str
    email: str
    phone: str
    skills: list
    education: list
    experience: list
    certifications: list
    projects: list
    linkedin: str
    github: str
    ats_score: float
    ats_missing: list
    ats_suggestions: list
    jd_match_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class ATSResponse(BaseModel):
    score: float
    missing_fields: list
    suggestions: list

class AnalysisResponse(BaseModel):
    success: bool
    filename: str
    resume_data: dict
    ats_analysis: dict
    jd_match_score: float
    resume_id: int

class BatchResult(BaseModel):
    resumes: List[ResumeResponse]
    total: int
    avg_ats_score: float

class DashboardStats(BaseModel):
    total_resumes: int
    avg_ats_score: float
    top_candidate: Optional[dict]
    recent_uploads: list
    skill_distribution: dict
    score_distribution: list
