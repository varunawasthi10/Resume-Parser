import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, Download, Eye, Search } from 'lucide-react';
import api from '../utils/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    api.get('/resumes').then(res => setResumes(res.data.resumes || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) { console.error(err); }
  };

  const handleView = async (id) => {
    try {
      const res = await api.get(`/resumes/${id}`);
      setSelected(res.data);
    } catch (err) { console.error(err); }
  };

  const handleExport = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/export/csv`, '_blank');
  };

  const filtered = resumes.filter(r =>
    r.candidate_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.filename?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8"><LoadingSkeleton type="table" count={5} /></div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-slate-400 mt-1">{resumes.length} resumes analyzed</p>
        </div>
        <button onClick={handleExport} className="btn-primary flex items-center space-x-2 text-sm">
          <Download size={16} /><span>Export CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="Search by name or file..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume List */}
        <div className="lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-500">No resumes yet</h3>
              <p className="text-slate-600 mt-2">Upload your first resume from the Analyze page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-card p-4 flex items-center justify-between hover:border-indigo-500/30 transition-all cursor-pointer
                    ${selected?.id === r.id ? 'border-indigo-500/50 bg-indigo-500/5' : ''}`}
                  onClick={() => handleView(r.id)}>
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl">
                      <FileText size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-medium">{r.candidate_name}</div>
                      <div className="text-xs text-slate-500">{r.filename} • {r.created_at?.split('T')[0]}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${r.ats_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : r.ats_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.ats_score}%
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div>
          {selected ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 space-y-4 sticky top-8">
              <h3 className="text-lg font-bold">{selected.candidate_name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Email</span><span>{selected.email || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Phone</span><span>{selected.phone || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">ATS Score</span>
                  <span className="font-bold text-indigo-400">{selected.ats_score}%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">JD Match</span>
                  <span className="font-bold text-purple-400">{selected.jd_match_score}%</span></div>
              </div>

              {selected.skills?.length > 0 && (
                <div>
                  <div className="text-sm text-slate-400 mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-500/10 rounded text-xs text-indigo-400">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.ats_suggestions?.length > 0 && (
                <div>
                  <div className="text-sm text-slate-400 mb-2">Suggestions</div>
                  <div className="space-y-1">
                    {selected.ats_suggestions.slice(0, 4).map((s, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start space-x-1.5">
                        <span className="text-yellow-400 mt-0.5">•</span><span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Eye className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Select a resume to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumesPage;
