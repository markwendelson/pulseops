import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { authService, UserProfile } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('sarah');
  const [password, setPassword] = useState('Sre123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login(username, password);
      onLoginSuccess(result.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your login.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#0d1424] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 items-center justify-center shadow-lg shadow-indigo-500/20 mb-2">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Pulse<span className="text-indigo-400">Ops</span></h2>
          <p className="text-xs text-slate-400">Enterprise Observability & Incident Intelligence Platform</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username / Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                placeholder="e.g. sarah, admin, devops"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>

          {/* Quick Persona Selector for Testing RBAC */}
          <div className="pt-1">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5">Test RBAC Profiles:</span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('sarah', 'Sre123!')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-center border border-slate-700/60 transition"
              >
                Lead SRE
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'Admin123!')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-indigo-300 font-mono text-center border border-slate-700/60 transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('viewer', 'View123!')}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 font-mono text-center border border-slate-700/60 transition"
              >
                Viewer
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            JWT RBAC Guard Active
          </span>
          <span>.NET 8 Backend</span>
        </div>
      </div>
    </div>
  );
};
