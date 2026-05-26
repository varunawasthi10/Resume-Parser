import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Users, Trophy, Medal, Award, Zap } from 'lucide-react';
import api from '../utils/api';

const BatchScreeningPage = () => {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [filterSkill, setFilterSkill] = useState('');

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    if (jd.trim()) formData.append('jd', jd);

    try {
      const res = await api.post('/analyze/batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = results?.candidates?.filter(c => {
    if (!filterSkill) return true;
    return c.skills?.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()));
  }) || [];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-400" size={20} />;
    if (rank === 2) return <Medal className="text-slate-300" size={20} />;
    if (rank === 3) return <Award className="text-amber-600" size={20} />;
    return <span className="text-slate-500 font-bold text-sm">#{rank}</span>;
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Multi-Resume Screening</h1>
        <p className="text-slate-400 mt-1">Upload multiple resumes and rank candidates automatically</p>
      </div>

      {!results ? (
        <div className="max-w-3xl space-y-6">
          <div className="glass-card p-8 border-2 border-dashed border-white/20">
            <div className="flex flex-col items-center">
              <Users className="w-16 h-16 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Upload Multiple Resumes</h3>
              <p className="text-slate-400 text-sm mb-6">Select multiple PDF/DOCX files at once</p>
              <input type="file" id="batch-upload" className="hidden" multiple accept=".pdf,.docx"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  if (selectedFiles.length > 0) {
                    setFiles(prev => [...prev, ...selectedFiles]);
                  }
                  e.target.value = '';
                }} />
              <label htmlFor="batch-upload" className="btn-primary cursor-pointer">
                {files.length > 0 ? `${files.length} files selected` : 'Select Files'}
              </label>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-3">Job Description (Optional)</h3>
            <textarea value={jd} onChange={(e) => setJd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-32"
              placeholder="Paste JD to rank candidates by relevance..." />
          </div>

          <button onClick={handleUpload} disabled={files.length === 0 || loading}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Processing {files.length} resumes...</span></>
            ) : (
              <><Zap size={20} /><span>Screen All Candidates</span></>
            )}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Candidate Leaderboard</h2>
              <p className="text-sm text-slate-400">{results.total_processed} candidates ranked</p>
            </div>
            <div className="flex space-x-3">
              <input type="text" value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="Filter by skill..." />
              <button onClick={() => { setResults(null); setFiles([]); }}
                className="text-indigo-400 hover:text-indigo-300 text-sm px-4">
                ← New Screening
              </button>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-white/10">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">ATS Score</th>
                  <th className="p-4">JD Match</th>
                  <th className="p-4">Composite</th>
                  <th className="p-4">Top Skills</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">{getRankIcon(c.rank)}</td>
                    <td className="p-4">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${c.ats_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : c.ats_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {c.ats_score}%
                      </span>
                    </td>
                    <td className="p-4 text-sm">{c.jd_match}%</td>
                    <td className="p-4">
                      <span className="font-bold text-indigo-400">{c.composite_score}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(c.skills || []).slice(0, 3).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-xs text-slate-400">{s}</span>
                        ))}
                        {c.skills?.length > 3 && <span className="text-xs text-slate-500">+{c.skills.length - 3}</span>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BatchScreeningPage;
