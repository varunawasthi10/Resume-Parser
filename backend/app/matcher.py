from typing import List, Dict, Any
import re
import math
from collections import Counter


def _tokenize(text: str) -> List[str]:
    """Simple whitespace + punctuation tokenizer, lowercased."""
    return re.findall(r'\b[a-z][a-z+#.]{1,}\b', text.lower())


# Basic English stop words
_STOP_WORDS = frozenset([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "must",
    "not", "no", "so", "if", "as", "it", "its", "this", "that", "these",
    "those", "then", "than", "we", "he", "she", "they", "you", "me",
    "him", "her", "us", "them", "my", "your", "his", "our", "their",
    "what", "which", "who", "whom", "how", "when", "where", "why",
    "all", "each", "every", "both", "few", "more", "most", "other",
    "some", "such", "only", "own", "same", "also", "just", "about",
    "into", "over", "after", "before", "between", "under", "above",
    "very", "too", "any", "up", "out",
])


def _term_frequencies(tokens: List[str]) -> Dict[str, float]:
    """Compute normalized term frequency for a token list, ignoring stop words."""
    filtered = [t for t in tokens if t not in _STOP_WORDS]
    counts = Counter(filtered)
    total = len(filtered) or 1
    return {word: count / total for word, count in counts.items()}


def calculate_similarity(resume_text: str, jd_text: str) -> float:
    """Calculate cosine similarity between resume and JD using TF word vectors."""
    if not resume_text or not jd_text:
        return 0.0

    tf_resume = _term_frequencies(_tokenize(resume_text))
    tf_jd = _term_frequencies(_tokenize(jd_text))

    # Build the shared vocabulary
    vocab = set(tf_resume.keys()) | set(tf_jd.keys())
    if not vocab:
        return 0.0

    # Cosine similarity
    dot = sum(tf_resume.get(w, 0) * tf_jd.get(w, 0) for w in vocab)
    mag_a = math.sqrt(sum(v * v for v in tf_resume.values()))
    mag_b = math.sqrt(sum(v * v for v in tf_jd.values()))

    if mag_a == 0 or mag_b == 0:
        return 0.0

    similarity = dot / (mag_a * mag_b)
    return round(similarity * 100, 2)


def find_matched_skills(resume_skills: List[str], jd_text: str) -> Dict[str, List[str]]:
    jd_lower = jd_text.lower()
    matched = []
    missing = []

    for skill in resume_skills:
        if skill.lower() in jd_lower:
            matched.append(skill)
        else:
            missing.append(skill)

    # Find keywords in JD that aren't in resume
    from app.parser import ALL_SKILLS
    jd_required = []
    for skill in ALL_SKILLS:
        if skill.lower() in jd_lower and skill not in resume_skills:
            jd_required.append(skill)

    return {
        "matched_skills": matched,
        "resume_only_skills": missing,
        "missing_from_resume": jd_required
    }


def calculate_ats_score(resume_data: Dict[str, Any]) -> Dict[str, Any]:
    score = 0
    max_score = 100
    missing_fields = []
    breakdown = {}

    # Contact info (15 pts)
    contact_score = 0
    if resume_data.get("name") and resume_data["name"] != "Unknown":
        contact_score += 5
    else:
        missing_fields.append("Full Name")
    if resume_data.get("email"):
        contact_score += 5
    else:
        missing_fields.append("Email Address")
    if resume_data.get("phone"):
        contact_score += 5
    else:
        missing_fields.append("Phone Number")
    breakdown["Contact Info"] = contact_score
    score += contact_score

    # Skills (30 pts)
    skills_count = len(resume_data.get("skills", []))
    if skills_count >= 12:
        skills_score = 30
    elif skills_count >= 8:
        skills_score = 25
    elif skills_count >= 5:
        skills_score = 18
    elif skills_count >= 3:
        skills_score = 10
    else:
        skills_score = 5
        missing_fields.append("More Technical Skills")
    breakdown["Skills"] = skills_score
    score += skills_score

    # Experience (20 pts)
    exp_count = len(resume_data.get("experience", []))
    if exp_count >= 5:
        exp_score = 20
    elif exp_count >= 3:
        exp_score = 15
    elif exp_count >= 1:
        exp_score = 10
    else:
        exp_score = 0
        missing_fields.append("Work Experience")
    breakdown["Experience"] = exp_score
    score += exp_score

    # Education (15 pts)
    edu_count = len(resume_data.get("education", []))
    if edu_count >= 1:
        edu_score = 15
    else:
        edu_score = 0
        missing_fields.append("Education Details")
    breakdown["Education"] = edu_score
    score += edu_score

    # Projects (10 pts)
    proj_count = len(resume_data.get("projects", []))
    if proj_count >= 2:
        proj_score = 10
    elif proj_count >= 1:
        proj_score = 7
    else:
        proj_score = 0
        missing_fields.append("Projects Section")
    breakdown["Projects"] = proj_score
    score += proj_score

    # Links & Certifications (10 pts)
    extra_score = 0
    if resume_data.get("linkedin"):
        extra_score += 3
    else:
        missing_fields.append("LinkedIn Profile")
    if resume_data.get("github"):
        extra_score += 3
    else:
        missing_fields.append("GitHub Profile")
    if resume_data.get("certifications"):
        extra_score += 4
    else:
        missing_fields.append("Certifications")
    breakdown["Links & Certs"] = extra_score
    score += extra_score

    # Suggestions based on gaps
    suggestions = []
    if score < 50:
        suggestions.append("Your resume needs significant improvement for ATS systems")
    if "More Technical Skills" in missing_fields:
        suggestions.append("Add more industry-relevant technical keywords")
    if "Work Experience" in missing_fields:
        suggestions.append("Include your work experience with clear job titles and dates")
    if "LinkedIn Profile" in missing_fields:
        suggestions.append("Add your LinkedIn URL for better professional visibility")
    if "GitHub Profile" in missing_fields:
        suggestions.append("Link your GitHub to showcase your coding projects")
    suggestions.append("Use action verbs: 'Developed', 'Implemented', 'Designed'")
    suggestions.append("Quantify achievements with metrics where possible")
    suggestions.append("Match your resume keywords to the target job description")

    return {
        "score": min(score, max_score),
        "breakdown": breakdown,
        "missing_fields": missing_fields,
        "suggestions": suggestions
    }


def rank_candidates(resumes_data: List[Dict], jd_text: str = "") -> List[Dict]:
    """Rank multiple candidates by ATS score and JD match."""
    ranked = []
    for resume in resumes_data:
        ats = calculate_ats_score(resume)
        match_score = 0.0
        if jd_text:
            match_score = calculate_similarity(resume.get("raw_text", ""), jd_text)

        composite = (ats["score"] * 0.6) + (match_score * 0.4) if jd_text else ats["score"]
        ranked.append({
            "name": resume.get("name", "Unknown"),
            "email": resume.get("email", ""),
            "skills": resume.get("skills", []),
            "ats_score": ats["score"],
            "jd_match": match_score,
            "composite_score": round(composite, 2),
            "ats_data": ats
        })

    ranked.sort(key=lambda x: x["composite_score"], reverse=True)
    for i, r in enumerate(ranked):
        r["rank"] = i + 1
    return ranked
