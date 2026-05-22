import re
import pdfplumber
import docx
from typing import Dict, List, Any

# spaCy removed — exceeds Vercel's 250MB serverless function size limit
# Name extraction uses regex fallback below

# Expanded skill database organized by category
SKILL_CATEGORIES = {
    "Programming Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust",
        "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Dart"
    ],
    "Frontend": [
        "React", "Angular", "Vue.js", "Next.js", "Svelte", "HTML", "CSS", "SASS",
        "Tailwind CSS", "Bootstrap", "jQuery", "Redux", "Webpack", "Vite"
    ],
    "Backend": [
        "Node.js", "Express", "FastAPI", "Flask", "Django", "Spring Boot",
        "ASP.NET", "Laravel", "Rails", "NestJS", "GraphQL", "REST API"
    ],
    "Database": [
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Firebase",
        "Cassandra", "DynamoDB", "Elasticsearch", "Oracle", "NoSQL"
    ],
    "DevOps & Cloud": [
        "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins",
        "GitHub Actions", "Terraform", "Ansible", "Linux", "Nginx", "Apache"
    ],
    "AI/ML": [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow",
        "PyTorch", "Keras", "scikit-learn", "Pandas", "NumPy", "OpenCV",
        "Data Science", "Data Analysis", "LLM", "Generative AI"
    ],
    "Tools": [
        "Git", "GitHub", "GitLab", "Jira", "Figma", "VS Code", "Postman",
        "Swagger", "Notion", "Slack", "Trello"
    ],
    "Soft Skills": [
        "Leadership", "Communication", "Teamwork", "Problem Solving",
        "Project Management", "Agile", "Scrum", "Critical Thinking"
    ]
}

ALL_SKILLS = []
for cat_skills in SKILL_CATEGORIES.values():
    ALL_SKILLS.extend(cat_skills)

EDUCATION_KEYWORDS = [
    "B.Tech", "B.E.", "B.Sc", "M.Tech", "M.E.", "M.Sc", "MBA", "Ph.D", "PhD",
    "Bachelor", "Master", "Diploma", "HSC", "SSC", "12th", "10th",
    "Computer Science", "Information Technology", "Engineering",
    "University", "College", "Institute", "School"
]

CERTIFICATION_KEYWORDS = [
    "AWS Certified", "Google Cloud", "Azure", "Certified", "Certificate",
    "Coursera", "Udemy", "edX", "LinkedIn Learning", "HackerRank",
    "CompTIA", "PMP", "CISSP", "Scrum Master", "ITIL"
]

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(docx_path: str) -> str:
    doc = docx.Document(docx_path)
    text = "\n".join([p.text for p in doc.paragraphs])
    return text

def extract_contact_info(text: str) -> Dict[str, str]:
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+'
    github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[a-zA-Z0-9_-]+'
    
    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    linkedin = re.findall(linkedin_pattern, text)
    github = re.findall(github_pattern, text)
    
    return {
        "email": emails[0] if emails else "",
        "phone": phones[0] if phones else "",
        "linkedin": linkedin[0] if linkedin else "",
        "github": github[0] if github else ""
    }

def extract_name(text: str) -> str:
    # Use first non-empty line that looks like a name (no digits, no @, under 50 chars)
    for line in text.split("\n"):
        line = line.strip()
        if line and len(line) < 50 and not re.search(r'[@\d]', line):
            return line
    return "Unknown"

def extract_skills(text: str) -> List[str]:
    found = []
    text_lower = text.lower()
    for skill in ALL_SKILLS:
        if skill.lower() in text_lower:
            found.append(skill)
    return list(set(found))

def categorize_skills(skills: List[str]) -> Dict[str, List[str]]:
    result = {}
    for category, cat_skills in SKILL_CATEGORIES.items():
        matched = [s for s in skills if s in cat_skills]
        if matched:
            result[category] = matched
    return result

def extract_education(text: str) -> List[str]:
    found = []
    lines = text.split("\n")
    for i, line in enumerate(lines):
        for keyword in EDUCATION_KEYWORDS:
            if keyword.lower() in line.lower():
                # Grab the line and maybe the next one for context
                entry = line.strip()
                if i + 1 < len(lines) and lines[i + 1].strip():
                    entry += " | " + lines[i + 1].strip()
                if entry not in found and len(entry) < 200:
                    found.append(entry)
                break
    return found[:5]  # Max 5 education entries

def extract_certifications(text: str) -> List[str]:
    found = []
    lines = text.split("\n")
    for line in lines:
        for keyword in CERTIFICATION_KEYWORDS:
            if keyword.lower() in line.lower():
                entry = line.strip()
                if entry and entry not in found and len(entry) < 150:
                    found.append(entry)
                break
    return found[:10]

def extract_experience_sections(text: str) -> List[str]:
    experience_headers = ["experience", "work experience", "professional experience", "employment"]
    lines = text.split("\n")
    entries = []
    in_section = False
    
    for line in lines:
        line_stripped = line.strip().lower()
        if any(header in line_stripped for header in experience_headers):
            in_section = True
            continue
        if in_section:
            # Stop if we hit another major section
            if line_stripped in ["education", "skills", "projects", "certifications", "awards", "references"]:
                break
            if line.strip():
                entries.append(line.strip())
    
    return entries[:15]  # Max 15 lines

def extract_projects(text: str) -> List[str]:
    project_headers = ["projects", "personal projects", "academic projects", "key projects"]
    lines = text.split("\n")
    entries = []
    in_section = False
    
    for line in lines:
        line_stripped = line.strip().lower()
        if any(header in line_stripped for header in project_headers):
            in_section = True
            continue
        if in_section:
            if line_stripped in ["experience", "education", "skills", "certifications", "awards"]:
                break
            if line.strip():
                entries.append(line.strip())
    
    return entries[:10]

def generate_suggestions(resume_data: Dict, ats_score: float) -> List[str]:
    suggestions = []
    
    if not resume_data.get("linkedin"):
        suggestions.append("Add your LinkedIn profile URL to increase visibility")
    if not resume_data.get("github"):
        suggestions.append("Include a GitHub profile to showcase your projects")
    if len(resume_data.get("skills", [])) < 8:
        suggestions.append("Add more technical skills — aim for at least 8-10 relevant keywords")
    if not resume_data.get("certifications"):
        suggestions.append("Consider adding relevant certifications (AWS, Google Cloud, etc.)")
    if len(resume_data.get("projects", [])) < 2:
        suggestions.append("Include at least 2-3 projects to demonstrate practical experience")
    if ats_score < 70:
        suggestions.append("Use more action verbs: 'Developed', 'Implemented', 'Designed', 'Optimized'")
        suggestions.append("Quantify achievements with numbers (e.g., 'Reduced load time by 40%')")
    
    suggestions.append("Use a clean, single-column format for better ATS readability")
    suggestions.append("Tailor your resume keywords to match each job description")
    
    return suggestions

def parse_resume(file_path: str, extension: str) -> Dict[str, Any]:
    if extension == ".pdf":
        text = extract_text_from_pdf(file_path)
    elif extension == ".docx":
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")

    if not text.strip():
        raise ValueError("Could not extract text from file. It may be scanned/image-based.")

    contact = extract_contact_info(text)
    skills = extract_skills(text)
    name = extract_name(text)
    education = extract_education(text)
    certifications = extract_certifications(text)
    experience = extract_experience_sections(text)
    projects = extract_projects(text)
    skill_categories = categorize_skills(skills)

    return {
        "name": name,
        "email": contact["email"],
        "phone": contact["phone"],
        "linkedin": contact["linkedin"],
        "github": contact["github"],
        "skills": skills,
        "skill_categories": skill_categories,
        "education": education,
        "certifications": certifications,
        "experience": experience,
        "projects": projects,
        "raw_text": text
    }
