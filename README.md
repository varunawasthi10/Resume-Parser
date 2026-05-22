# 🚀 ResumeAI — AI-Powered Resume Parser & ATS Screening System

A professional, full-stack AI SaaS application for resume parsing, ATS scoring, job description matching, and candidate screening.

## ✨ Features

### Core
- **AI Resume Parsing** — Extract name, email, phone, skills, education, experience, projects, certifications, and social links from PDF/DOCX
- **ATS Score Checker** — Calculate compatibility score out of 100 with detailed breakdown
- **Job Description Matching** — Compare resumes against JDs using TF-IDF + Cosine Similarity
- **Multi-Resume Screening** — Batch upload and rank candidates automatically
- **Skill Analytics Dashboard** — Pie charts, bar charts, radar charts for skill distribution

### Advanced
- **AI Chatbot Assistant** — Get resume tips, ATS advice, and skill recommendations
- **Export to CSV** — Download all analysis data
- **JWT Authentication** — Secure login/signup with protected routes
- **Dark/Light Mode** — Toggle between themes

### UI/UX
- Glassmorphism cards with backdrop blur
- Framer Motion page transitions and hover animations
- Gradient backgrounds and glowing effects
- Responsive sidebar navigation
- Loading skeletons and empty states
- Professional Inter typography

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons |
| Backend | FastAPI, spaCy (NLP), scikit-learn, pdfplumber, python-docx |
| Database | SQLite + SQLAlchemy |
| Auth | JWT (python-jose + bcrypt) |

## 📁 Project Structure

```
resume-parser/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes (auth, analysis, batch, dashboard, chatbot, export)
│   │   ├── parser.py         # NLP resume parsing logic
│   │   ├── matcher.py        # ATS scoring + JD similarity + candidate ranking
│   │   ├── auth.py           # JWT authentication
│   │   ├── database.py       # SQLite setup
│   │   ├── models.py         # SQLAlchemy models (User, Resume)
│   │   └── schemas.py        # Pydantic schemas
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/            # 10 pages (Landing, Login, Signup, Dashboard, Analyze, etc.)
│   │   ├── components/       # Sidebar, LoadingSkeleton
│   │   ├── context/          # AuthContext, ThemeContext
│   │   ├── utils/            # API wrapper with JWT interceptor
│   │   └── App.jsx           # React Router with protected routes
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app/main.py
```
Backend runs at `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| POST | `/analyze` | Analyze single resume |
| POST | `/analyze/batch` | Batch screen multiple resumes |
| GET | `/resumes` | List all resumes |
| GET | `/resumes/{id}` | Get resume details |
| DELETE | `/resumes/{id}` | Delete resume |
| POST | `/match` | Match resume to JD |
| GET | `/dashboard/stats` | Dashboard analytics |
| GET | `/export/csv` | Export data to CSV |
| POST | `/chatbot` | AI assistant |

## 🎨 Design System (Stitch MCP)

UI designs were generated using Google's Stitch MCP and are available in the Stitch project:
- **Project**: ResumeAI - AI Resume Parser
- **Screens**: Landing Page, Admin Dashboard
- **Theme**: Deep Slate-950, Indigo-Purple gradients, Inter font, Glassmorphism

## 📄 License
MIT
