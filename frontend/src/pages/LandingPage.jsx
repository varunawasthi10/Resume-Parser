import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, FileText, Shield, Target, Users, BarChart3, Bot,
  Upload, Play, CheckCircle, Star, Zap, TrendingUp, Award, Clock,
  Brain, ChevronRight, Mail, Globe,
  GraduationCap, Briefcase, Code, Database, LineChart, PieChart,
  Menu, X, ExternalLink, Download, BookOpen, Cpu, Layers
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart as RechartsLineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Area, AreaChart
} from 'recharts';

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const slideLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const slideRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

/* ============================================================
   ANIMATED COUNTER HOOK
   ============================================================ */
const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return [ref, count];
};

/* ============================================================
   RECHARTS DATA
   ============================================================ */
const skillsDistData = [
  { name: 'Frontend', value: 35, color: '#4F46E5' },
  { name: 'Backend', value: 25, color: '#7C3AED' },
  { name: 'AI/ML', value: 20, color: '#06B6D4' },
  { name: 'DevOps', value: 12, color: '#10B981' },
  { name: 'Design', value: 8, color: '#F59E0B' },
];

const candidateCompData = [
  { name: 'John D.', ats: 92, jd: 88, skills: 34 },
  { name: 'Sarah C.', ats: 87, jd: 91, skills: 29 },
  { name: 'Mike R.', ats: 78, jd: 72, skills: 22 },
  { name: 'Lisa W.', ats: 95, jd: 85, skills: 38 },
  { name: 'Alex P.', ats: 83, jd: 79, skills: 27 },
];

const atsImprovementData = [
  { month: 'Jan', score: 62 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 71 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 82 },
  { month: 'Jun', score: 88 },
  { month: 'Jul', score: 92 },
];

/* ============================================================
   MAIN LANDING PAGE
   ============================================================ */
const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], ['rgba(8,9,10,0)', 'rgba(8,9,10,0.85)']);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-1" style={{ top: '-10%', left: '-10%' }} />
      <div className="orb orb-2" style={{ top: '30%', right: '-5%' }} />
      <div className="orb orb-3" style={{ bottom: '10%', left: '20%' }} />

      {/* ========== NAVBAR ========== */}
      <motion.nav
        style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/[0.04]"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ResumeAI</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="nav-link text-sm font-medium">Features</a>
            <a href="#ats-score" className="nav-link text-sm font-medium">ATS Scanner</a>
            <a href="#analytics" className="nav-link text-sm font-medium">Analytics</a>
            <a href="#about" className="nav-link text-sm font-medium">About</a>
            <a href="#contact" className="nav-link text-sm font-medium">Contact</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2.5 border border-white/15 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-slate-300 hover:text-white">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-[#08090A]/95 backdrop-blur-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white transition-colors">Features</a>
                <a href="#ats-score" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white transition-colors">ATS Scanner</a>
                <a href="#analytics" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white transition-colors">Analytics</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white transition-colors">About</a>
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Link to="/login" className="flex-1 text-center py-2.5 border border-white/15 rounded-xl text-sm font-medium text-slate-300">Sign In</Link>
                  <Link to="/signup" className="flex-1 btn-primary text-sm text-center py-2.5">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ========== 1. HERO SECTION ========== */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32">
        {/* Hero grid background */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-8">
              <Zap size={14} className="text-indigo-400" />
              <span>AI-Powered Resume Intelligence</span>
              <ChevronRight size={14} />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-7 tracking-tight" style={{ lineHeight: '1.15' }}>
              Transform Resumes{' '}
              <br className="hidden md:block" />
              Into{' '}
              <span className="gradient-text-animated">
                Actionable Insights
              </span>
            </h1>

            {/* Sub heading */}
            <p className="text-base md:text-lg text-slate-400 mb-10 max-w-xl" style={{ lineHeight: '1.75' }}>
              ResumeAI uses Artificial Intelligence and NLP to parse resumes, calculate ATS scores, 
              match candidates with job descriptions, and streamline recruitment workflows.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/signup" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                <Upload size={18} /> Upload Resume
              </Link>
              <a href="#demo" className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
                <Play size={18} /> Watch Demo
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>Free to try</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-400" />
                <span>Instant results</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Hero Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="glass-card p-8 relative z-10 animate-float">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">AI</div>
                  <div>
                    <div className="font-semibold text-sm">Resume Analysis</div>
                    <div className="text-xs text-slate-500">Real-time Processing</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                  ● Live
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <HeroStatCard label="ATS Score" value="92%" icon={<Shield size={16} />} color="indigo" />
                <HeroStatCard label="Skills Extracted" value="34" icon={<Code size={16} />} color="purple" />
                <HeroStatCard label="Job Match Score" value="88%" icon={<Target size={16} />} color="cyan" />
                <HeroStatCard label="Candidate Ranking" value="#1" icon={<Award size={16} />} color="emerald" />
              </div>

              {/* Mini Progress */}
              <div className="flex flex-col gap-3">
                <MiniProgress label="Parsing Complete" value={100} />
                <MiniProgress label="ATS Analysis" value={92} />
                <MiniProgress label="JD Matching" value={88} />
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 glass-card px-4 py-3 z-20 glow-indigo"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={14} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Improvement</div>
                  <div className="text-sm font-bold text-emerald-400">+23%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-6 glass-card px-4 py-3 z-20 glow-purple"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Brain size={14} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">AI Confidence</div>
                  <div className="text-sm font-bold text-purple-300">97.5%</div>
                </div>
              </div>
            </motion.div>

            {/* Background glows */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-600/15 blur-3xl rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-600/15 blur-3xl rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ========== 2. TRUSTED BY / STATS MARQUEE ========== */}
      <section className="py-16 border-y border-white/[0.04]">
        <div className="marquee-container">
          <div className="marquee-track">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-8 px-4">
                <MarqueeCard value="50,000+" label="Resumes Analyzed" icon={<FileText size={20} />} />
                <MarqueeCard value="95%" label="Parsing Accuracy" icon={<Target size={20} />} />
                <MarqueeCard value="88%" label="Average ATS Improvement" icon={<TrendingUp size={20} />} />
                <MarqueeCard value="10,000+" label="Skills Detected" icon={<Code size={20} />} />
                <MarqueeCard value="50,000+" label="Resumes Analyzed" icon={<FileText size={20} />} />
                <MarqueeCard value="95%" label="Parsing Accuracy" icon={<Target size={20} />} />
                <MarqueeCard value="88%" label="Average ATS Improvement" icon={<TrendingUp size={20} />} />
                <MarqueeCard value="10,000+" label="Skills Detected" icon={<Code size={20} />} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 3. FEATURES SECTION ========== */}
      <section id="features" className="py-28 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
              <Layers size={14} /> Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
              Everything You Need For{' '}
              <span className="gradient-text">Intelligent Resume Screening</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              A complete AI toolkit for modern recruitment — from parsing to ranking.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard
              num="01"
              icon={<FileText size={24} />}
              title="Resume Parsing"
              desc="Extract Name, Skills, Experience, Education, and Certifications from PDF/DOCX in seconds."
              color="indigo"
              tags={['NLP', 'spaCy', 'PDF/DOCX']}
            />
            <FeatureCard
              num="02"
              icon={<Shield size={24} />}
              title="ATS Score Checker"
              desc="Get ATS Score, Keyword Optimization tips, and Missing Skill Detection instantly."
              color="blue"
              tags={['ATS Score', 'Keywords', 'Optimization']}
            />
            <FeatureCard
              num="03"
              icon={<Target size={24} />}
              title="Job Description Matching"
              desc="TF-IDF Similarity, Match Percentage, and Skill Gap Analysis for every resume."
              color="cyan"
              tags={['TF-IDF', 'Cosine Similarity', 'Gap Analysis']}
            />
            <FeatureCard
              num="04"
              icon={<Users size={24} />}
              title="Multi Candidate Screening"
              desc="Rank Candidates, Compare Resumes, and get Hiring Analytics for batch uploads."
              color="purple"
              tags={['Batch Upload', 'Ranking', 'Comparison']}
            />
            <FeatureCard
              num="05"
              icon={<Bot size={24} />}
              title="AI Resume Assistant"
              desc="Get Resume Suggestions, Career Advice, and Improvement Recommendations from AI."
              color="pink"
              tags={['AI Chat', 'Suggestions', 'Career Tips']}
            />
            <FeatureCard
              num="06"
              icon={<BarChart3 size={24} />}
              title="Analytics Dashboard"
              desc="Interactive Charts, Trends, and Hiring Metrics to make data-driven decisions."
              color="emerald"
              tags={['Charts', 'Trends', 'Metrics']}
            />
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== 4. ATS SCORE SHOWCASE ========== */}
      <section id="ats-score" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
              <Shield size={14} /> ATS Compatibility
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
              Real-Time{' '}
              <span className="gradient-text">ATS Score Analysis</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Instant breakdown of your resume's compatibility with applicant tracking systems.
            </p>
          </motion.div>

          <motion.div {...scaleUp} className="max-w-4xl mx-auto">
            <div className="glass-card p-10 relative overflow-hidden glass-card-glow">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 blur-3xl rounded-full" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Circular Score */}
                <div className="flex flex-col items-center">
                  <ATSCircularScore score={92} />
                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold mb-1">Excellent Score</div>
                    <p className="text-sm text-slate-400">Your resume is highly optimized for ATS systems</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="flex flex-col gap-5">
                  <ATSBreakdownBar label="Skills Match" value={94} color="#4F46E5" />
                  <ATSBreakdownBar label="Experience Match" value={89} color="#7C3AED" />
                  <ATSBreakdownBar label="Education Match" value={90} color="#06B6D4" />
                  <ATSBreakdownBar label="Keyword Optimization" value={95} color="#10B981" />
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span>All critical keywords detected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span>ATS-friendly formatting confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== 5. RESUME PARSER SHOWCASE ========== */}
      <section id="demo" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
              <FileText size={14} /> Resume Parsing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
              AI-Powered{' '}
              <span className="gradient-text">Resume Extraction</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Upload → Parse → Extract — watch AI break down any resume in seconds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: Upload Interface */}
            <motion.div {...slideLeft}>
              <div className="glass-card p-8 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <Upload size={18} className="text-indigo-400" />
                  <h3 className="text-lg font-semibold">Upload Resume</h3>
                </div>
                <div className="drag-drop-zone rounded-xl p-12 flex flex-col items-center justify-center text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Upload size={28} className="text-indigo-400" />
                  </div>
                  <p className="text-slate-300 font-medium mb-1">Drag & Drop your resume</p>
                  <p className="text-sm text-slate-500">or click to browse</p>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-slate-400 border border-white/5">PDF</span>
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-slate-400 border border-white/5">DOCX</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                  <FileText size={16} className="text-indigo-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">resume_john_doe.pdf</div>
                    <div className="text-xs text-slate-500">245 KB</div>
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">Uploaded</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Parsed Output */}
            <motion.div {...slideRight}>
              <div className="glass-card p-8 h-full glass-card-glow">
                <div className="flex items-center gap-2 mb-6">
                  <Brain size={18} className="text-purple-400" />
                  <h3 className="text-lg font-semibold">Parsed Output</h3>
                  <div className="ml-auto px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs rounded-full">AI Extracted</div>
                </div>
                <div className="flex flex-col gap-4">
                  <ParsedField icon={<Users size={14} />} label="Name" value="John Doe" />
                  <ParsedField icon={<Mail size={14} />} label="Email" value="john.doe@email.com" />
                  <ParsedField icon={<Code size={14} />} label="Skills" value="React, Python, FastAPI, NLP, TensorFlow, Docker" isTag />
                  <ParsedField icon={<Briefcase size={14} />} label="Experience" value="3 Years — Full Stack Developer" />
                  <ParsedField icon={<GraduationCap size={14} />} label="Education" value="B.Tech Computer Science — MIT" />
                  <ParsedField icon={<Award size={14} />} label="Certifications" value="AWS Solutions Architect, Google ML" />
                  <ParsedField icon={<Globe size={14} />} label="LinkedIn" value="linkedin.com/in/johndoe" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== 6. AI ANALYTICS DASHBOARD ========== */}
      <section id="analytics" className="py-28 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
              <BarChart3 size={14} /> Analytics
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
              AI Analytics{' '}
              <span className="gradient-text">Dashboard Preview</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Powerful visualizations to drive smarter hiring decisions.
            </p>
          </motion.div>

          <motion.div {...scaleUp}>
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold">Hiring Analytics Overview</h3>
                  <p className="text-sm text-slate-500">Last 30 days • 127 resumes analyzed</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-lg border border-indigo-500/20">This Month</span>
                  <span className="px-3 py-1.5 bg-white/5 text-slate-400 text-xs font-medium rounded-lg border border-white/5">All Time</span>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Pie Chart */}
                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <PieChart size={14} className="text-indigo-400" /> Skills Distribution
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={skillsDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {skillsDistData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {skillsDistData.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className="text-purple-400" /> Candidate Comparison
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={candidateCompData} barSize={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}
                      />
                      <Bar dataKey="ats" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="jd" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" /> ATS Score
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-purple-500" /> JD Match
                    </div>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <LineChart size={14} className="text-cyan-400" /> ATS Improvement
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={atsImprovementData}>
                      <defs>
                        <linearGradient id="atsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#4F46E5" fill="url(#atsGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white/[0.02] rounded-xl p-5 border border-white/5">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <Award size={14} className="text-yellow-400" /> Top Candidates Leaderboard
                </h4>
                <div className="flex flex-col gap-3">
                  <LeaderboardRow rank={1} name="Lisa Wang" ats={95} jd={85} skills={38} />
                  <LeaderboardRow rank={2} name="John Doe" ats={92} jd={88} skills={34} />
                  <LeaderboardRow rank={3} name="Sarah Chen" ats={87} jd={91} skills={29} />
                  <LeaderboardRow rank={4} name="Alex Park" ats={83} jd={79} skills={27} />
                  <LeaderboardRow rank={5} name="Mike Russo" ats={78} jd={72} skills={22} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== 7. INTERNSHIP PROJECT SHOWCASE ========== */}
      <section id="about" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
              <GraduationCap size={14} /> Internship Project
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
              Built During{' '}
              <span className="gradient-text">Pinnacle Labs</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Artificial Intelligence Internship 2026
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Timeline Card */}
            <motion.div {...slideLeft}>
              <div className="glass-card p-8 glass-card-glow h-full">
                {/* Internship Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl border border-indigo-500/20 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Pinnacle Labs</div>
                    <div className="text-xs text-slate-400">AI Internship Certificate — 2026</div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-8">
                  <div className="text-sm text-slate-500 mb-1">Project Name</div>
                  <div className="text-2xl font-bold gradient-text mb-4">ResumeAI</div>
                  <div className="text-sm text-slate-500 mb-1">Duration</div>
                  <div className="text-base text-slate-300 mb-6">Internship Project — Full Development Cycle</div>
                </div>

                {/* Focus Areas */}
                <div className="mb-6">
                  <div className="text-sm text-slate-500 mb-3">Focus Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {['NLP', 'Artificial Intelligence', 'Full Stack Development', 'ATS Automation', 'Data Analytics'].map((area, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-xs text-slate-300 font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-4 mt-8">
                  <TimelineItem step="01" title="Research & Design" desc="NLP models, ATS algorithms, UI/UX design" />
                  <TimelineItem step="02" title="Backend Development" desc="FastAPI, spaCy NLP, SQLite, JWT Auth" />
                  <TimelineItem step="03" title="Frontend Development" desc="React, Tailwind CSS, Framer Motion, Recharts" />
                  <TimelineItem step="04" title="Testing & Deployment" desc="End-to-end testing, performance optimization" />
                </div>
              </div>
            </motion.div>

            {/* Architecture Diagram */}
            <motion.div {...slideRight}>
              <div className="glass-card p-8 h-full">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Layers size={18} className="text-cyan-400" /> Project Architecture
                </h3>
                <div className="flex flex-col gap-6">
                  {/* Frontend Layer */}
                  <ArchLayer
                    title="Frontend"
                    color="indigo"
                    items={['React 19', 'Tailwind CSS v4', 'Framer Motion', 'Recharts', 'Lucide Icons']}
                    icon={<Globe size={16} />}
                  />
                  {/* API Layer */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500" />
                  </div>
                  <ArchLayer
                    title="Backend API"
                    color="purple"
                    items={['FastAPI', 'JWT Auth', 'REST Endpoints', 'File Upload', 'CORS']}
                    icon={<Database size={16} />}
                  />
                  {/* Processing Layer */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-cyan-500" />
                  </div>
                  <ArchLayer
                    title="AI/NLP Engine"
                    color="cyan"
                    items={['spaCy NLP', 'TF-IDF Matching', 'Cosine Similarity', 'pdfplumber', 'python-docx']}
                    icon={<Brain size={16} />}
                  />
                  {/* Data Layer */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-emerald-500" />
                  </div>
                  <ArchLayer
                    title="Data Layer"
                    color="emerald"
                    items={['SQLite', 'SQLAlchemy ORM', 'Pydantic Schemas', 'bcrypt Hashing']}
                    icon={<Database size={16} />}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== 8. TESTIMONIALS ========== */}
      <section id="testimonials" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
              <Star size={14} /> Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
              Trusted by{' '}
              <span className="gradient-text">Professionals</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <TestimonialCard
              name="Priya Sharma"
              role="HR Manager"
              avatar="PS"
              text="ResumeAI significantly reduced our manual screening time. What used to take hours now takes minutes. The ATS scoring is incredibly accurate."
              rating={5}
              color="indigo"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Technical Recruiter"
              avatar="MC"
              text="The ATS matching feature is incredibly useful. It helps us find the best candidates faster than any tool we've used before."
              rating={5}
              color="purple"
            />
            <TestimonialCard
              name="Sarah Williams"
              role="Software Developer"
              avatar="SW"
              text="Clean UI and powerful analytics. I optimized my resume using ResumeAI's suggestions and landed interviews at top tech companies."
              rating={5}
              color="cyan"
            />
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ========== 9. CTA SECTION ========== */}
      <section className="py-28 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...scaleUp}>
            <div className="glass-card p-16 relative overflow-hidden text-center">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-cyan-600/10" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/15 blur-3xl rounded-full animate-pulse-glow" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/15 blur-3xl rounded-full animate-pulse-glow" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 badge-gradient rounded-full text-sm text-indigo-300 mb-6">
                  <Sparkles size={14} /> Get Started Today
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">
                  Ready to Optimize{' '}
                  <span className="gradient-text">Resume Screening?</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-lg mb-10">
                  Join thousands of recruiters and job seekers using AI to transform the hiring process.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/signup" className="btn-primary text-base px-10 py-4 flex items-center gap-2">
                    Try ResumeAI <ArrowRight size={18} />
                  </Link>
                  <a href="#demo" className="btn-secondary text-base px-10 py-4 flex items-center gap-2">
                    <Play size={18} /> View Demo
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== 10. FOOTER ========== */}
      <footer id="contact" className="border-t border-white/[0.05] py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">ResumeAI</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                AI-Powered Resume Parser & ATS Screening System. Built with React, FastAPI, and NLP.
              </p>
              <div className="flex gap-3">
                <SocialIcon href="https://github.com" icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                } />
                <SocialIcon href="https://linkedin.com" icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                } />
                <SocialIcon href="https://twitter.com" icon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                } />
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-slate-300">Product</h4>
              <div className="flex flex-col gap-3">
                <a href="#features" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Features</a>
                <a href="#ats-score" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">ATS Scanner</a>
                <a href="#analytics" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Analytics</a>
                <Link to="/dashboard" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Dashboard</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-slate-300">Resources</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Documentation</a>
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">API Reference</a>
                <a href="#about" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">About</a>
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Blog</a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4 text-slate-300">Legal</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</a>
                <a href="#" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-600">
              © 2026 ResumeAI. All rights reserved.
            </p>
            <p className="text-sm text-slate-600 mt-2 md:mt-0">
              Built with ❤️ using React & FastAPI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

/* Hero Stat Card */
const HeroStatCard = ({ label, value, icon, color }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/15',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/15',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/15',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/15',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[color]} border`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={colorMap[color].split(' ').pop()}>{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

/* Mini Progress Bar */
const MiniProgress = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-300 font-medium">{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        className="h-full rounded-full progress-bar-animated"
      />
    </div>
  </div>
);

/* Marquee Card */
const MarqueeCard = ({ value, label, icon }) => (
  <div className="glass-card px-8 py-5 flex items-center gap-4 min-w-[280px]">
    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/10">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold gradient-text">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  </div>
);

/* Feature Card */
const FeatureCard = ({ num, icon, title, desc, color, tags }) => {
  const colorMap = {
    indigo: 'group-hover:text-indigo-400 group-hover:border-indigo-500/30 group-hover:shadow-indigo-500/10',
    blue: 'group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:shadow-blue-500/10',
    cyan: 'group-hover:text-cyan-400 group-hover:border-cyan-500/30 group-hover:shadow-cyan-500/10',
    purple: 'group-hover:text-purple-400 group-hover:border-purple-500/30 group-hover:shadow-purple-500/10',
    pink: 'group-hover:text-pink-400 group-hover:border-pink-500/30 group-hover:shadow-pink-500/10',
    emerald: 'group-hover:text-emerald-400 group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10',
  };
  const iconColorMap = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/15',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/15',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/15',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/15',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15',
  };

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group glass-card glass-card-glow p-8 relative overflow-hidden cursor-default ${colorMap[color]}`}
    >
      <div className="absolute top-4 right-5 text-6xl font-black text-white/[0.02] group-hover:text-white/[0.04] transition-colors select-none">
        {num}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${iconColorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 bg-white/[0.03] border border-white/5 rounded text-[10px] text-slate-500 font-medium">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/* ATS Circular Score */
const ATSCircularScore = ({ score }) => {
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-56 h-56">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <motion.circle
          cx="100" cy="100" r="90" fill="none"
          stroke="url(#atsGradientCircle)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="atsGradientCircle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold counter-glow">{score}%</div>
        <div className="text-sm text-slate-400 mt-1">ATS Score</div>
      </div>
    </div>
  );
};

/* ATS Breakdown Bar */
const ATSBreakdownBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold" style={{ color }}>{value}%</span>
    </div>
    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

/* Parsed Field */
const ParsedField = ({ icon, label, value, isTag }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5"
  >
    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mt-0.5 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-slate-500 mb-0.5">{label}</div>
      {isTag ? (
        <div className="flex flex-wrap gap-1.5">
          {value.split(', ').map((skill, i) => (
            <span key={i} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/15 rounded text-xs text-indigo-300 font-medium">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-200 font-medium">{value}</div>
      )}
    </div>
  </motion.div>
);

/* Leaderboard Row */
const LeaderboardRow = ({ rank, name, ats, jd, skills }) => {
  const rankColors = { 1: 'text-yellow-400', 2: 'text-slate-300', 3: 'text-amber-600', 4: 'text-slate-500', 5: 'text-slate-500' };
  const rankBg = { 1: 'bg-yellow-400/10', 2: 'bg-slate-300/10', 3: 'bg-amber-600/10', 4: 'bg-white/5', 5: 'bg-white/5' };

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${rankColors[rank]} ${rankBg[rank]}`}>
        #{rank}
      </div>
      <div className="flex-1 font-medium text-sm">{name}</div>
      <div className="hidden sm:flex items-center gap-6 text-xs">
        <div><span className="text-slate-500">ATS:</span> <span className="font-semibold text-indigo-400">{ats}%</span></div>
        <div><span className="text-slate-500">JD:</span> <span className="font-semibold text-purple-400">{jd}%</span></div>
        <div><span className="text-slate-500">Skills:</span> <span className="font-semibold text-cyan-400">{skills}</span></div>
      </div>
    </div>
  );
};

/* Testimonial Card */
const TestimonialCard = ({ name, role, avatar, text, rating, color }) => {
  const borderColor = {
    indigo: 'hover:border-indigo-500/30',
    purple: 'hover:border-purple-500/30',
    cyan: 'hover:border-cyan-500/30',
  };

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6 }}
      className={`glass-card glass-card-glow p-8 ${borderColor[color]}`}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-5">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      {/* Quote */}
      <p className="text-slate-300 text-sm leading-relaxed mb-6">"{text}"</p>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
          {avatar}
        </div>
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </motion.div>
  );
};

/* Timeline Item */
const TimelineItem = ({ step, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="flex flex-col items-center">
      <div className="timeline-dot shrink-0" />
      <div className="timeline-line flex-1 mt-1" />
    </div>
    <div className="pb-6">
      <div className="text-xs text-indigo-400 font-mono mb-1">Step {step}</div>
      <div className="font-semibold text-sm mb-0.5">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  </div>
);

/* Architecture Layer */
const ArchLayer = ({ title, color, items, icon }) => {
  const colorMap = {
    indigo: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
  };
  const tagColor = {
    indigo: 'bg-indigo-500/10 border-indigo-500/15 text-indigo-300',
    purple: 'bg-purple-500/10 border-purple-500/15 text-purple-300',
    cyan: 'bg-cyan-500/10 border-cyan-500/15 text-cyan-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/15 text-emerald-300',
  };

  return (
    <div className={`rounded-xl p-5 border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={colorMap[color].split(' ').pop()}>{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className={`px-2.5 py-1 rounded-lg text-xs border font-medium ${tagColor[color]}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* Social Icon */
const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
  >
    {icon}
  </a>
);

export default LandingPage;
