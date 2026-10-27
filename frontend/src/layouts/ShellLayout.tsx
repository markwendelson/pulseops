import React from 'react';
import { 
  Zap, 
  Server, 
  AlertTriangle, 
  Flame, 
  FileText, 
  Radio, 
  AppWindow, 
  Layers, 
  Search, 
  RefreshCw,
  Sun,
  Moon,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import { UserProfile } from '../services/authService';

interface ShellLayoutProps {
  currentUser?: UserProfile | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export const ShellLayout: React.FC<ShellLayoutProps> = ({ currentUser, onLogout, children }) => {
  const { theme, toggleTheme } = useTheme();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition ${
      isActive
        ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
    }`;

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${theme === 'dark' ? 'bg-[#070b14] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r flex flex-col justify-between select-none shrink-0 ${
        theme === 'dark' ? 'bg-[#0d1424] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          {/* Brand Header */}
          <div className={`h-16 px-6 flex items-center gap-3 border-b ${
            theme === 'dark' ? 'border-slate-800/80 bg-[#090d19]' : 'border-slate-200 bg-slate-100/50'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-bold tracking-tight text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Pulse<span className="text-indigo-500">Ops</span>
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase">Enterprise AIOps</span>
            </div>
          </div>

          {/* Navigation Links using NavLink for Browser URL History */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Dashboards</div>
            
            <NavLink to="/dashboard/executive" className={navLinkClass}>
              <Zap className="w-4 h-4" />
              <span>Executive Overview</span>
            </NavLink>

            <NavLink to="/dashboard/infrastructure" className={navLinkClass}>
              <Server className="w-4 h-4" />
              <span>Infrastructure Dashboard</span>
            </NavLink>

            <NavLink to="/dashboard/noc" className={navLinkClass}>
              <Radio className="w-4 h-4 text-emerald-500" />
              <span>NOC Wallboard</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-mono">LIVE</span>
            </NavLink>

            <NavLink to="/dashboard/applications" className={navLinkClass}>
              <AppWindow className="w-4 h-4" />
              <span>Application Services</span>
            </NavLink>

            <div className="pt-3 px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Operations</div>

            <NavLink to="/monitoring" className={navLinkClass}>
              <Layers className="w-4 h-4" />
              <span>Monitoring Modules</span>
            </NavLink>

            <NavLink to="/alerts" className={navLinkClass}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Alert Management</span>
            </NavLink>

            <NavLink to="/incidents" className={navLinkClass}>
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Incident War Room</span>
            </NavLink>

            <NavLink to="/reports" className={navLinkClass}>
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>SLA & Reporting</span>
            </NavLink>

            {/* Admin & Governance Section */}
            <div className="pt-3 px-3 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Governance</div>

            <NavLink to="/admin" className={navLinkClass}>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Admin & Policies</span>
              {currentUser?.role === 'Admin' ? (
                <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 font-mono font-bold">FULL</span>
              ) : (
                <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-slate-500/15 text-slate-400 font-mono">RO</span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 space-y-2">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between font-mono mb-1 text-[10px]">
              <span className="uppercase text-indigo-600 dark:text-indigo-400 font-semibold">Production Target</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                .NET 8
              </span>
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">PostgreSQL + TimescaleDB</div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className={`h-16 border-b px-8 flex items-center justify-between shrink-0 ${
          theme === 'dark' ? 'bg-[#0a101d] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hosts, incidents, metrics (e.g. PAYROLL-API)..."
                className={`w-full rounded-lg pl-10 pr-4 py-1.5 text-xs transition focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500' 
                    : 'bg-slate-100 border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg text-xs transition border ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}>
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>10s</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>

            {/* Current Authenticated User & RBAC Role */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                {currentUser?.username?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <span className="font-semibold block text-slate-800 dark:text-slate-200">
                  {currentUser?.fullName || 'Sarah Connor'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/30">
                  {currentUser?.role || 'SRE'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
