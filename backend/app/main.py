from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional, List
import uvicorn
import os
import shutil
import json
import csv
import io
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from app.database import get_db, init_db
from app.models import User, Resume
from app.schemas import UserCreate, UserLogin, Token, ResumeResponse, DashboardStats
from app.auth import (
    register_user, authenticate_user, create_access_token,
    get_current_user
)
from app.parser import parse_resume, generate_suggestions, categorize_skills
from app.matcher import calculate_similarity, calculate_ats_score, find_matched_skills, rank_candidates

app = FastAPI(title="AI Resume Parser & ATS Screening API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize DB at module level for serverless (no startup event in Vercel)
init_db()

@app.on_event("startup")
def on_startup():
    init_db()

# ─── All routes on a router so we can mount at both "/" and "/api" ───
router = APIRouter()

# ─── Health Check ──────────────────────────────────────────
@router.get("/")
async def root():
    return {"message": "AI Resume Parser API v2.0", "status": "running"}

# ─── AUTH ROUTES ───────────────────────────────────────────
@router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_data.email, user_data.username, user_data.password, user_data.full_name)
    token = create_access_token(data={"sub": str(user.id)})
    return Token(
        access_token=token,
        token_type="bearer",
        user={
            "id": user.id, "email": user.email, "username": user.username,
            "full_name": user.full_name, "role": user.role, "created_at": user.created_at
        }
    )

@router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.email, user_data.password)
    token = create_access_token(data={"sub": str(user.id)})
    return Token(
        access_token=token,
        token_type="bearer",
        user={
            "id": user.id, "email": user.email, "username": user.username,
            "full_name": user.full_name, "role": user.role, "created_at": user.created_at
        }
    )

@router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "email": current_user.email,
        "username": current_user.username, "full_name": current_user.full_name,
        "role": current_user.role
    }

# ─── SINGLE RESUME ANALYSIS ──────────────────────────────
@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    jd: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx"]:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        resume_data = parse_resume(file_path, ext)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    ats_data = calculate_ats_score(resume_data)
    suggestions = generate_suggestions(resume_data, ats_data["score"])
    
    match_score = 0.0
    matched_skills_data = {}
    if jd:
        match_score = calculate_similarity(resume_data["raw_text"], jd)
        matched_skills_data = find_matched_skills(resume_data["skills"], jd)
    
    # Save to DB
    db_resume = Resume(
        filename=file.filename,
        candidate_name=resume_data["name"],
        email=resume_data["email"],
        phone=resume_data["phone"],
        skills=resume_data["skills"],
        education=resume_data["education"],
        experience=resume_data["experience"],
        certifications=resume_data["certifications"],
        projects=resume_data["projects"],
        linkedin=resume_data["linkedin"],
        github=resume_data["github"],
        raw_text=resume_data["raw_text"][:5000],
        ats_score=ats_data["score"],
        ats_missing=ats_data["missing_fields"],
        ats_suggestions=suggestions,
        jd_match_score=match_score,
        owner_id=current_user.id
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return {
        "success": True,
        "resume_id": db_resume.id,
        "filename": file.filename,
        "resume_data": {
            "name": resume_data["name"],
            "email": resume_data["email"],
            "phone": resume_data["phone"],
            "linkedin": resume_data["linkedin"],
            "github": resume_data["github"],
            "skills": resume_data["skills"],
            "skill_categories": resume_data.get("skill_categories", {}),
            "education": resume_data["education"],
            "experience": resume_data["experience"],
            "certifications": resume_data["certifications"],
            "projects": resume_data["projects"],
        },
        "ats_analysis": ats_data,
        "suggestions": suggestions,
        "jd_match_score": match_score,
        "matched_skills": matched_skills_data
    }

# ─── BATCH SCREENING ─────────────────────────────────────
@router.post("/analyze/batch")
async def analyze_batch(
    files: List[UploadFile] = File(...),
    jd: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = []
    all_resume_data = []
    
    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".pdf", ".docx"]:
            continue
        
        file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        try:
            resume_data = parse_resume(file_path, ext)
            all_resume_data.append(resume_data)
            
            ats_data = calculate_ats_score(resume_data)
            match_score = calculate_similarity(resume_data["raw_text"], jd) if jd else 0.0
            
            db_resume = Resume(
                filename=file.filename,
                candidate_name=resume_data["name"],
                email=resume_data["email"],
                phone=resume_data["phone"],
                skills=resume_data["skills"],
                education=resume_data["education"],
                experience=resume_data["experience"],
                certifications=resume_data["certifications"],
                projects=resume_data["projects"],
                linkedin=resume_data["linkedin"],
                github=resume_data["github"],
                raw_text=resume_data["raw_text"][:5000],
                ats_score=ats_data["score"],
                ats_missing=ats_data["missing_fields"],
                ats_suggestions=ats_data["suggestions"],
                jd_match_score=match_score,
                owner_id=current_user.id
            )
            db.add(db_resume)
            db.commit()
            db.refresh(db_resume)
        except:
            continue
    
    ranked = rank_candidates(all_resume_data, jd or "")
    
    return {
        "success": True,
        "total_processed": len(ranked),
        "candidates": ranked
    }

# ─── GET RESUMES ──────────────────────────────────────────
@router.get("/resumes")
async def get_resumes(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resumes = db.query(Resume).filter(Resume.owner_id == current_user.id)\
        .order_by(Resume.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(Resume).filter(Resume.owner_id == current_user.id).count()
    
    return {
        "resumes": [{
            "id": r.id, "filename": r.filename, "candidate_name": r.candidate_name,
            "email": r.email, "skills": r.skills, "ats_score": r.ats_score,
            "jd_match_score": r.jd_match_score, "created_at": str(r.created_at)
        } for r in resumes],
        "total": total
    }

@router.get("/resumes/{resume_id}")
async def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.owner_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id": resume.id, "filename": resume.filename,
        "candidate_name": resume.candidate_name, "email": resume.email,
        "phone": resume.phone, "skills": resume.skills,
        "education": resume.education, "experience": resume.experience,
        "certifications": resume.certifications, "projects": resume.projects,
        "linkedin": resume.linkedin, "github": resume.github,
        "ats_score": resume.ats_score, "ats_missing": resume.ats_missing,
        "ats_suggestions": resume.ats_suggestions,
        "jd_match_score": resume.jd_match_score,
        "created_at": str(resume.created_at)
    }

@router.delete("/resumes/{resume_id}")
async def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.owner_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted"}

# ─── JD MATCH ENDPOINT ───────────────────────────────────
@router.post("/match")
async def match_jd(
    resume_id: int = Form(...),
    jd: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.owner_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    match_score = calculate_similarity(resume.raw_text, jd)
    matched_skills = find_matched_skills(resume.skills, jd)
    
    resume.jd_match_score = match_score
    db.commit()
    
    return {
        "match_score": match_score,
        "matched_skills": matched_skills
    }

# ─── DASHBOARD STATS ─────────────────────────────────────
@router.get("/dashboard/stats")
async def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resumes = db.query(Resume).filter(Resume.owner_id == current_user.id).all()
    total = len(resumes)
    
    if total == 0:
        return {
            "total_resumes": 0, "avg_ats_score": 0,
            "top_candidate": None, "recent_uploads": [],
            "skill_distribution": {}, "score_distribution": []
        }
    
    avg_score = sum(r.ats_score for r in resumes) / total
    top = max(resumes, key=lambda r: r.ats_score)
    
    # Skill frequency
    skill_freq = {}
    for r in resumes:
        for s in (r.skills or []):
            skill_freq[s] = skill_freq.get(s, 0) + 1
    
    # Score distribution (buckets)
    buckets = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    for r in resumes:
        s = r.ats_score
        if s <= 20: buckets["0-20"] += 1
        elif s <= 40: buckets["21-40"] += 1
        elif s <= 60: buckets["41-60"] += 1
        elif s <= 80: buckets["61-80"] += 1
        else: buckets["81-100"] += 1
    
    recent = sorted(resumes, key=lambda r: r.created_at, reverse=True)[:5]
    
    return {
        "total_resumes": total,
        "avg_ats_score": round(avg_score, 1),
        "top_candidate": {
            "name": top.candidate_name, "score": top.ats_score,
            "email": top.email
        },
        "recent_uploads": [{
            "id": r.id, "filename": r.filename, "candidate_name": r.candidate_name,
            "ats_score": r.ats_score, "created_at": str(r.created_at)
        } for r in recent],
        "skill_distribution": dict(sorted(skill_freq.items(), key=lambda x: x[1], reverse=True)[:15]),
        "score_distribution": [{"range": k, "count": v} for k, v in buckets.items()]
    }

# ─── EXPORT CSV ───────────────────────────────────────────
@router.get("/export/csv")
async def export_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resumes = db.query(Resume).filter(Resume.owner_id == current_user.id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Phone", "Skills", "ATS Score", "JD Match", "Date"])
    
    for r in resumes:
        writer.writerow([
            r.candidate_name, r.email, r.phone,
            "; ".join(r.skills or []), r.ats_score,
            r.jd_match_score, str(r.created_at)
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=resume_analysis.csv"}
    )

# ─── AI CHATBOT ───────────────────────────────────────────
@router.post("/chatbot")
async def chatbot(
    message: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    msg = message.lower()
    
    if any(w in msg for w in ["improve", "better", "tip", "suggestion"]):
        return {"response": "Here are some tips to improve your resume:\n\n1. **Use action verbs** like 'Developed', 'Implemented', 'Led'\n2. **Quantify achievements** with numbers and percentages\n3. **Tailor keywords** to each job description\n4. **Keep it concise** — ideally 1-2 pages\n5. **Add a professional summary** at the top\n6. **Include relevant certifications** and continuous learning"}
    elif any(w in msg for w in ["ats", "score", "compatibility"]):
        return {"response": "ATS (Applicant Tracking System) tips:\n\n1. Use a **simple, clean format** — avoid tables and graphics\n2. Include **exact keywords** from the job description\n3. Use **standard section headings** (Experience, Education, Skills)\n4. Save as **PDF** unless told otherwise\n5. Avoid headers/footers — ATS often can't read them\n6. Spell out abbreviations at least once"}
    elif any(w in msg for w in ["skill", "learn", "technology"]):
        return {"response": "Top in-demand skills for 2024-25:\n\n🔥 **AI/ML**: Python, TensorFlow, LLMs, Prompt Engineering\n☁️ **Cloud**: AWS, Azure, GCP, Kubernetes\n💻 **Full-Stack**: React, Next.js, Node.js, TypeScript\n📊 **Data**: SQL, Pandas, Power BI, Tableau\n🔒 **Security**: CISSP, DevSecOps, Penetration Testing\n📱 **Mobile**: Flutter, React Native, Swift"}
    elif any(w in msg for w in ["format", "template", "layout"]):
        return {"response": "Resume format best practices:\n\n1. Use **reverse chronological** order\n2. Font: **Inter, Calibri, or Arial** (10-12pt)\n3. Margins: **0.5-1 inch** all sides\n4. Include: Contact → Summary → Experience → Education → Skills\n5. Use **bullet points** not paragraphs\n6. **Bold** job titles and company names"}
    else:
        return {"response": f"I'm your AI Resume Assistant! I can help with:\n\n• **Resume improvement tips** — ask 'How to improve my resume?'\n• **ATS optimization** — ask 'How to beat ATS?'\n• **Skill recommendations** — ask 'What skills should I learn?'\n• **Format advice** — ask 'Best resume format?'\n\nJust type your question and I'll guide you! 🚀"}

# Mount the router at both "/" (for local dev) and "/api" (for Vercel production)
app.include_router(router)
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
