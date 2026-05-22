import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Shield, Target, Zap, CheckCircle, ArrowRight, Star, FileText, BarChart3, Users, Sparkles, Bot, Download } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-7 h-7 text-indigo-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="nav-link">Features</a>
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
        </div>
        <div className="flex space-x-3">
          <Link to="/login" className="px-5 py-2.5 border border-white/20 rounded-xl hover:bg-white/5 transition-all text-sm font-medium">
            Login
          </Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 mb-6">
            <Zap size={14} /><span>AI-Powered Resume Intelligence</span>
          </div>
          <h1 className="text-6xl font-extrabold leading-tight mb-6">
            Land Your Dream Job with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Screening
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
            Parse resumes instantly, optimize for ATS systems, match against job descriptions, 
            and rank candidates — all powered by advanced NLP.
          </p>
          <div className="flex space-x-4">
            <Link to="/signup" className="btn-primary flex items-center text-lg px-8 py-4">
              Start Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#demo" className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white/5 transition-all text-lg">
              Watch Demo
            </a>
          </div>
          <div className="flex items-center space-x-6 mt-8 text-sm text-slate-500">
            <div className="flex items-center space-x-1"><CheckCircle size={16} className="text-emerald-400" /><span>Free to try</span></div>
            <div className="flex items-center space-x-1"><CheckCircle size={16} className="text-emerald-400" /><span>No credit card</span></div>
            <div className="flex items-center space-x-1"><CheckCircle size={16} className="text-emerald-400" /><span>Instant results</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative">
          <div className="glass-card p-8 space-y-6 animate-float">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center font-bold">SC</div>
                <div><div className="font-bold">Sarah Chen</div><div className="text-xs text-slate-400">Full-Stack Developer</div></div>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">Top Candidate</div>
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">94%</div>
              <div className="text-sm text-slate-400">ATS Compatibility</div>
              <div className="w-full h-2.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="w-[94%] h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Skills Found" value="18" />
              <MiniStat label="JD Match" value="87%" />
              <MiniStat label="Experience" value="4 yrs" />
              <MiniStat label="Certifications" value="3" />
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-600/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-600/20 blur-3xl rounded-full" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From parsing to ranking — a complete AI toolkit for modern recruitment.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<FileText className="text-indigo-400" />} title="Smart Parsing" desc="Extract name, email, skills, education, and experience from PDF/DOCX in seconds." />
            <FeatureCard icon={<Shield className="text-blue-400" />} title="ATS Optimizer" desc="Get a compatibility score and actionable suggestions to beat applicant tracking systems." />
            <FeatureCard icon={<Target className="text-emerald-400" />} title="JD Matching" desc="Compare resumes against any job description using NLP similarity analysis." />
            <FeatureCard icon={<Users className="text-purple-400" />} title="Batch Screening" desc="Upload multiple resumes at once and instantly rank all candidates." />
            <FeatureCard icon={<BarChart3 className="text-yellow-400" />} title="Skill Analytics" desc="Visualize skill distributions, gaps, and trends across your candidate pool." />
            <FeatureCard icon={<Bot className="text-pink-400" />} title="AI Assistant" desc="Chat with our AI for personalized resume improvement tips and career advice." />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-slate-400">Upload → Parse → Analyze → Optimize — in under 10 seconds.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard num="01" title="Upload Resume" desc="Drag and drop your PDF or DOCX file into the upload zone." />
            <StepCard num="02" title="AI Analysis" desc="Our NLP engine extracts data, scores ATS compatibility, and identifies gaps." />
            <StepCard num="03" title="Get Results" desc="View detailed insights, matched skills, and improvement suggestions." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Professionals</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard name="Alex Rivera" role="Software Engineer @ Google" text="ResumeAI helped me identify missing keywords that got my resume past ATS filters. Landed 3 interviews in a week!" />
            <TestimonialCard name="Priya Patel" role="Data Scientist @ Meta" text="The skill analytics dashboard is incredible. I could see exactly where my gaps were compared to job requirements." />
            <TestimonialCard name="James Kim" role="HR Manager @ Stripe" text="We use ResumeAI to screen 500+ applicants per role. The batch ranking saves us 20+ hours per hiring cycle." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-slate-400">Start free. Upgrade when you need more.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard tier="Starter" price="Free" features={["5 resume analyses/month", "ATS scoring", "Basic skill extraction", "AI assistant"]} />
            <PricingCard tier="Professional" price="$19" features={["Unlimited analyses", "JD matching", "Batch screening", "CSV export", "Priority support"]} popular />
            <PricingCard tier="Enterprise" price="$49" features={["Everything in Pro", "Team collaboration", "API access", "Custom integrations", "Dedicated support"]} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp} className="glass-card p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to optimize your resume?</h2>
              <p className="text-slate-400 mb-8 text-lg">Join thousands of professionals using AI to land their dream jobs.</p>
              <Link to="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center">
                Get Started Free <ArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">ResumeAI</span>
          </div>
          <div className="text-sm text-slate-500">© 2024 ResumeAI. Built with ❤️ using React & FastAPI.</div>
        </div>
      </footer>
    </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
    <div className="text-xs text-slate-400">{label}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div whileHover={{ y: -8 }} className="glass-card p-8 hover:border-indigo-500/30 transition-all">
    <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const StepCard = ({ num, title, desc }) => (
  <motion.div {...fadeUp} className="text-center">
    <div className="text-5xl font-black bg-gradient-to-b from-indigo-400/30 to-transparent bg-clip-text text-transparent mb-4">{num}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, text }) => (
  <motion.div whileHover={{ y: -4 }} className="glass-card p-6">
    <div className="flex space-x-1 mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
    </div>
    <p className="text-slate-300 text-sm mb-4 leading-relaxed">"{text}"</p>
    <div>
      <div className="font-medium text-sm">{name}</div>
      <div className="text-xs text-slate-500">{role}</div>
    </div>
  </motion.div>
);

const PricingCard = ({ tier, price, features, popular }) => (
  <motion.div whileHover={{ y: -8 }}
    className={`glass-card p-8 relative ${popular ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : ''}`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-xs font-bold rounded-full">
        Most Popular
      </div>
    )}
    <div className="text-sm text-slate-400 mb-2">{tier}</div>
    <div className="text-4xl font-bold mb-1">{price}</div>
    <div className="text-xs text-slate-500 mb-6">{price === 'Free' ? 'Forever' : '/month'}</div>
    <div className="space-y-3 mb-8">
      {features.map(f => (
        <div key={f} className="flex items-center space-x-2 text-sm text-slate-300">
          <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" /><span>{f}</span>
        </div>
      ))}
    </div>
    <Link to="/signup"
      className={`block text-center py-3 rounded-xl font-medium transition-all ${
        popular ? 'btn-primary' : 'border border-white/20 hover:bg-white/5'}`}>
      Get Started
    </Link>
  </motion.div>
);

export default LandingPage;
