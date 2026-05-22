import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../utils/api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your AI Resume Assistant 🤖\n\nI can help you with:\n• Resume improvement tips\n• ATS optimization strategies\n• Skill recommendations\n• Resume format advice\n\nJust type your question below!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMsg);
      const res = await api.post('/chatbot', formData);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I couldn't process that. Try asking about resume tips, ATS scores, or skills!" }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "How to improve my resume?",
    "How to beat ATS?",
    "What skills should I learn?",
    "Best resume format?"
  ];

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <Sparkles className="text-indigo-400" /><span>AI Assistant</span>
        </h1>
        <p className="text-slate-400 mt-1">Get personalized resume advice instantly</p>
      </div>

      {/* Chat Window */}
      <div className="flex-1 glass-card p-6 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-indigo-500' : 'bg-purple-500/20'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-purple-400" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-tr-sm'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-purple-400" />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {quickPrompts.map(prompt => (
              <button key={prompt} onClick={() => { setInput(prompt); }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all">
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-3">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Ask me anything about resumes..." />
          <button onClick={sendMessage} disabled={!input.trim() || loading}
            className="btn-primary px-4 disabled:opacity-50">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
