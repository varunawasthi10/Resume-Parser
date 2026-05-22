import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Percent } from 'lucide-react';
import api from '../utils/api';

const JDMatchPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/resumes').then(res => setResumes(res.data.resumes || [])).catch(() => {});
  }, []);

  const handleMatch = async () => {
    if (!selectedResume || !jd.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume_id', selectedResume);
      formData.append('jd', jd);
      const res = await api.post('/match', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Job Description Matching</h1>
        <p className="text-slate-400 mt-1">Compare a resume against a specific job description</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Select Resume</h3>
            {resumes.length === 0 ? (
              <p className="text-slate-400 text-sm">No resumes found. Upload one first from the Analyze page.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {resumes.map(r => (
                  <div key={r.id}
                    onClick={() => setSelectedResume(r.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedResume === r.id
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'}`}>
                    <div className="font-medium text-sm">{r.candidate_name}</div>
                    <div className="text-xs text-slate-500">{r.filename} • ATS: {r.ats_score}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Job Description</h3>
            <textarea value={jd} onChange={(e) => setJd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-48"
              placeholder="Paste the full job description here..." />
          </div>

          <button onClick={handleMatch} disabled={!selectedResume || !jd.trim() || loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Search size={20} /><span>Match Now</span></>
            )}
          </button>
        </div>

        {/* Right: Results */}
        <div>
          {result ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Match Score */}
              <div className="glass-card p-8 text-center">
                <Percent className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  {result.match_score}%
                </div>
                <div className="text-slate-400 mt-2">Match Score</div>
                <div className="w-full h-3 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: `${result.match_score}%` }} />
                </div>
              </div>

              {/* Matched Skills */}
              {result.matched_skills?.matched_skills?.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-3 text-emerald-400 flex items-center space-x-2">
                    <CheckCircle size={18} /><span>Matched Skills ({result.matched_skills.matched_skills.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_skills.matched_skills.map(s => (
                      <span key={s} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {result.matched_skills?.missing_from_resume?.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-3 text-red-400 flex items-center space-x-2">
                    <XCircle size={18} /><span>Missing from Resume ({result.matched_skills.missing_from_resume.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_skills.missing_from_resume.map(s => (
                      <span key={s} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-sm text-red-400">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card p-16 flex flex-col items-center justify-center text-center h-full">
              <Search className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-500">No Match Yet</h3>
              <p className="text-slate-600 mt-2">Select a resume and paste a JD to see the match analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDMatchPage;
