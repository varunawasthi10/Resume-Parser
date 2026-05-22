import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Zap, Lightbulb, Award, ExternalLink, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../utils/api';

const AnalyzePage = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    if (jd.trim()) formData.append('jd', jd);

    try {
      const res = await api.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setFile(null);
    setJd('');
    setError('');
  };

  const COLORS = ['#6366f1', '#1e293b'];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analyze Resume</h1>
        <p className="text-slate-400 mt-1">Upload a resume and get instant AI-powered analysis</p>
      </div>

      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl space-y-6">
            {/* Drag & Drop */}
            <div
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`glass-card p-16 border-dashed border-2 flex flex-col items-center justify-center transition-all cursor-pointer
                ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/20 hover:border-indigo-500/50'}`}
              onClick={() => document.getElementById('file-input').click()}
            >
              <Upload className={`w-16 h-16 mb-6 transition-colors ${dragActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <h2 className="text-2xl font-bold mb-2">
                {file ? file.name : 'Drop your resume here'}
              </h2>
              <p className="text-slate-400 text-center">
                {file ? `${(file.size / 1024).toFixed(1)} KB — Ready for analysis` : 'Supports PDF and DOCX • Max 5MB'}
              </p>
              <input id="file-input" type="file" className="hidden" accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])} />
              {file && (
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-4 text-red-400 hover:text-red-300 text-sm flex items-center space-x-1">
                  <X size={14} /><span>Remove file</span>
                </button>
              )}
            </div>

            {/* Optional JD */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-3">Job Description (Optional)</h3>
              <p className="text-sm text-slate-400 mb-3">Paste a job description to get a match score</p>
              <textarea
                value={jd} onChange={(e) => setJd(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none h-32"
                placeholder="Paste the job description here..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
            )}

            <button onClick={handleUpload} disabled={!file || isUploading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
              {isUploading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Analyzing with AI...</span></>
              ) : (
                <><Zap size={20} /><span>Start Analysis</span></>
              )}
            </button>

            {isUploading && (
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3 }} />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <button onClick={resetAnalysis} className="text-indigo-400 hover:text-indigo-300 text-sm">← Upload another resume</button>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 text-center">
                <div className="text-sm text-slate-400 mb-2">ATS Score</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  {analysis.ats_analysis?.score || 0}%
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    style={{ width: `${analysis.ats_analysis?.score || 0}%` }} />
                </div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-sm text-slate-400 mb-2">Skills Found</div>
                <div className="text-4xl font-bold text-emerald-400">{analysis.resume_data?.skills?.length || 0}</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-sm text-slate-400 mb-2">JD Match</div>
                <div className="text-4xl font-bold text-yellow-400">{analysis.jd_match_score || 0}%</div>
              </div>
            </div>

            {/* Profile + ATS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Info */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><FileText size={20} className="text-indigo-400" /><span>Extracted Profile</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Full Name" value={analysis.resume_data?.name} />
                    <InfoRow label="Email" value={analysis.resume_data?.email} />
                    <InfoRow label="Phone" value={analysis.resume_data?.phone} />
                    <InfoRow label="LinkedIn" value={analysis.resume_data?.linkedin} link />
                    <InfoRow label="GitHub" value={analysis.resume_data?.github} link />
                  </div>
                </div>

                {/* Skills */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.resume_data?.skills || []).map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {analysis.resume_data?.education?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4">Education</h3>
                    <div className="space-y-3">
                      {analysis.resume_data.education.map((edu, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm">{edu}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {analysis.resume_data?.experience?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4">Experience</h3>
                    <div className="space-y-2">
                      {analysis.resume_data.experience.map((exp, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm">{exp}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {analysis.resume_data?.projects?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4">Projects</h3>
                    <div className="space-y-2">
                      {analysis.resume_data.projects.map((proj, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm">{proj}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* ATS Donut */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 text-center">ATS Compatibility</h3>
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={[{ value: analysis.ats_analysis?.score || 0 }, { value: 100 - (analysis.ats_analysis?.score || 0) }]}
                          innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                          <Cell fill="#6366f1" /><Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{analysis.ats_analysis?.score || 0}</div>
                        <div className="text-xs text-slate-400">/ 100</div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  {analysis.ats_analysis?.breakdown && (
                    <div className="space-y-2 mt-4">
                      {Object.entries(analysis.ats_analysis.breakdown).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-400">{key}</span>
                          <span className="font-medium">{val} pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Missing */}
                {analysis.ats_analysis?.missing_fields?.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-3 text-red-400 flex items-center space-x-2"><AlertCircle size={18} /><span>Missing</span></h3>
                    <div className="space-y-2">
                      {analysis.ats_analysis.missing_fields.map((item, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" /><span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-3 text-yellow-400 flex items-center space-x-2"><Lightbulb size={18} /><span>AI Suggestions</span></h3>
                  <div className="space-y-2">
                    {(analysis.suggestions || []).map((tip, i) => (
                      <div key={i} className="flex items-start space-x-2 text-sm text-slate-300">
                        <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" /><span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoRow = ({ label, value, link }) => (
  <div className="flex flex-col">
    <span className="text-xs text-slate-500">{label}</span>
    {link && value ? (
      <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer"
        className="text-indigo-400 text-sm hover:underline flex items-center space-x-1 truncate">
        <span>{value}</span><ExternalLink size={12} />
      </a>
    ) : (
      <span className="text-sm font-medium truncate">{value || '—'}</span>
    )}
  </div>
);

export default AnalyzePage;
