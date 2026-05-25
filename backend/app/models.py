from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="")
    role = Column(String(20), default="user")  # user or admin
    created_at = Column(DateTime, default=datetime.utcnow)
    
    resumes = relationship("Resume", back_populates="owner")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(500), nullable=False)
    candidate_name = Column(String(255), default="Unknown")
    email = Column(String(255), default="")
    phone = Column(String(50), default="")
    skills = Column(JSON, default=[])
    education = Column(JSON, default=[])
    experience = Column(JSON, default=[])
    certifications = Column(JSON, default=[])
    projects = Column(JSON, default=[])
    linkedin = Column(String(500), default="")
    github = Column(String(500), default="")
    raw_text = Column(Text, default="")
    ats_score = Column(Float, default=0.0)
    ats_missing = Column(JSON, default=[])
    ats_suggestions = Column(JSON, default=[])
    jd_match_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="resumes")
