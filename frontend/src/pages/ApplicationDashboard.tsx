import React, { useEffect, useState } from 'react';
import { applicationService, metricService } from '../services';
import { 
  AppWindow, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const ApplicationDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [applications, setApplications] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    applicationService.getApplications().then(setApplications).catch(console.error);
    metricService.getMetrics().then(setMetrics).catch(console.error);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Application Services & API Gateway</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Microservice golden signals: Latency, Error Rate, Traffic, and Saturation.</p>
      </div>

      {/* Throughput & Error Rate Area Chart */}
      {metrics && metrics.requestThroughput && (
        <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Ingress Request Volume vs Error Spike (5xx)</h2>
              <p className="text-xs text-slate-500">Live ingress telemetry from Envoy edge proxy.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-indigo-500 font-medium">■ Ingress Requests</span>
              <span className="text-rose-500 font-medium">■ 5xx Errors</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.requestThroughput}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                <XAxis dataKey="timestamp" stroke={isDark ? "#64748b" : "#94a3b8"} />
                <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                    borderRadius: '8px',
                    color: isDark ? '#cbd5e1' : '#0f172a'
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fillOpacity={1} fill="url(#colorReq)" />
                <Area type="monotone" dataKey="errors" stroke="#f43f5e" fillOpacity={1} fill="url(#colorErr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.map((app) => (
          <div key={app.id} className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">{app.tier}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">{app.name}</h3>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                app.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                app.status === 'Warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}>
                {app.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Latency</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{app.avgLatencyMs}ms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Error Rate</span>
                <span className={`text-sm font-bold font-mono ${app.errorRatePercent > 2 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {app.errorRatePercent}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">RPS</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{app.requestsPerSec}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Pods</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{app.instancesCount}</span>
              </div>
            </div>

            {app.endpoints && (
              <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase block mb-1">Instrumented Endpoints</span>
                <div className="flex flex-wrap gap-1.5">
                  {app.endpoints.map((ep: string, idx: number) => (
                    <span key={idx} className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-800">
                      {ep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
