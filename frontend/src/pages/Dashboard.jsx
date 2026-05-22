import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Zap, FileText, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {
        // Demo data fallback
        setStats({
          total_resumes: 24,
          avg_ats_score: 72.5,
          top_candidate: { name: 'Sarah Chen', score: 95, email: 'sarah@example.com' },
          recent_uploads: [
            { id: 1, filename: 'sarah_resume.pdf', candidate_name: 'Sarah Chen', ats_score: 95, created_at: '2024-01-15' },
            { id: 2, filename: 'alex_cv.docx', candidate_name: 'Alex Rivera', ats_score: 88, created_at: '2024-01-14' },
            { id: 3, filename: 'priya_resume.pdf', candidate_name: 'Priya Patel', ats_score: 82, created_at: '2024-01-13' },
          ],
          skill_distribution: { Python: 18, React: 15, SQL: 12, Docker: 10, AWS: 8, 'Node.js': 7, TypeScript: 6, Java: 5 },
          score_distribution: [
            { range: '0-20', count: 1 }, { range: '21-40', count: 3 },
            { range: '41-60', count: 5 }, { range: '61-80', count: 9 },
            { range: '81-100', count: 6 }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8"><LoadingSkeleton type="card" count={4} /></div>;

  const skillChartData = stats?.skill_distribution
    ? Object.entries(stats.skill_distribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of all resume analytics</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FileText className="text-indigo-400" />} label="Total Resumes" value={stats?.total_resumes || 0} color="indigo" />
        <StatCard icon={<Zap className="text-yellow-400" />} label="Avg ATS Score" value={`${stats?.avg_ats_score || 0}%`} color="yellow" />
        <StatCard icon={<Award className="text-emerald-400" />} label="Top Candidate" value={stats?.top_candidate?.name || '—'} sub={stats?.top_candidate ? `Score: ${stats.top_candidate.score}%` : ''} color="emerald" />
        <StatCard icon={<TrendingUp className="text-purple-400" />} label="Skills Tracked" value={Object.keys(stats?.skill_distribution || {}).length} color="purple" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.score_distribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Top Skills Across Candidates</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={skillChartData.slice(0, 6)} innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {skillChartData.slice(0, 6).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Uploads */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">Recent Uploads</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-white/10">
                <th className="pb-3 pr-4">Candidate</th>
                <th className="pb-3 pr-4">File</th>
                <th className="pb-3 pr-4">ATS Score</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recent_uploads || []).map((r, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 font-medium">{r.candidate_name}</td>
                  <td className="py-3 pr-4 text-slate-400 text-sm">{r.filename}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${r.ats_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : r.ats_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.ats_score}%
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 text-sm">{r.created_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <motion.div whileHover={{ y: -4 }} className="glass-card p-6 hover:border-indigo-500/30 transition-all">
    <div className="flex items-center space-x-3 mb-3">
      <div className="p-2.5 bg-white/5 rounded-xl">{icon}</div>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </motion.div>
);

export default Dashboard;
