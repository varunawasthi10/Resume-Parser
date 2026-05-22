import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, BarChart3, Users, Upload, Search, 
  MessageSquare, Settings, LogOut, Sun, Moon, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analyze', label: 'Analyze Resume', icon: Upload },
  { path: '/match', label: 'JD Matching', icon: Search },
  { path: '/screening', label: 'Batch Screening', icon: Users },
  { path: '/analytics', label: 'Skill Analytics', icon: BarChart3 },
  { path: '/resumes', label: 'My Resumes', icon: FileText },
  { path: '/chatbot', label: 'AI Assistant', icon: MessageSquare },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 min-h-screen border-r border-white/10 flex flex-col sidebar-bg"
    >
      {/* Logo */}
      <div className="p-6 pb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-7 h-7 text-indigo-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">AI-Powered Screening</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.full_name || user?.username || 'User'}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email || ''}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
