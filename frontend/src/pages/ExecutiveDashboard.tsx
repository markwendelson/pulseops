import React, { useEffect, useState } from 'react';
import { dashboardService, DashboardSummary, applicationService } from '../services';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const ExecutiveDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    dashboardService.getSummary().then(setSummary).catch(console.error);
    applicationService.getApplications().then(setApplications).catch(console.error);
  }, []);

  const isDark = theme === 'dark';

  const availabilityTrends = [
    { day: 'Day 1', availability: 99.98 },
    { day: 'Day 5', availability: 99.99 },
    { day: 'Day 10', availability: 99.95 },
    { day: 'Day 15', availability: 99.91 },
    { day: 'Day 20', availability: 99.97 },
    { day: 'Day 25', availability: 99.96 },
    { day: 'Today', availability: 99.94 },
  ];

  const rootCauseDistribution = [
    { name: 'DB Pool Starvation', value: 45, color: '#f43f5e' },
    { name: 'Network Jitter / BGP', value: 25, color: '#f59e0b' },
    { name: 'Memory / GC Pause', value: 18, color: '#6366f1' },
    { name: 'API Timeout', value: 12, color: '#06b6d4' },
  ];

  if (!summary) {
    return <div className="text-slate-500 font-mono text-sm">Loading executive telemetry...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Executive Observability Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cross-cluster telemetry, SLA guarantees, availability trends, and MTTR benchmarks.</p>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Platform Availability</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><ShieldCheck className="w-4 h-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{summary.availability}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">99.9% Target</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">Calculated over 30d rolling window</div>
        </div>

        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Alerts</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"><AlertTriangle className="w-4 h-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{summary.activeAlerts}</span>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">{summary.criticalIncidents} P1 Blocker</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">{summary.openIncidents} active incident rooms</div>
        </div>

        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mean Time To Resolution (MTTR)</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{summary.mttr}m</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">-14% vs last week</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">MTTD: {summary.mttd}m | MTTA: {summary.mtta}m</div>
        </div>

        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SLA Compliance</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{summary.slaCompliance}%</span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Compliant</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">PostgreSQL audited SLA ledger</div>
        </div>
      </div>

      {/* Visual Analytics: Availability Trends & Root Cause Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability Trends Area Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">30-Day Platform Availability Trends (%)</h2>
              <p className="text-xs text-slate-500">Continuous aggregate rollup from TimescaleDB.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>&gt; 99.9% Target Line</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={availabilityTrends}>
                <defs>
                  <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                <XAxis dataKey="day" stroke={isDark ? "#64748b" : "#94a3b8"} />
                <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} domain={[99.85, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="availability" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAvail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Root Cause Distribution Donut Chart (1 Column) */}
        <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Root Cause Distribution</h2>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rootCauseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {rootCauseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {rootCauseDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Core Applications Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">Critical Core Microservices</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">TimescaleDB Telemetry Streams</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white block">{app.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{app.tier}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  app.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                  app.status === 'Warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}>
                  {app.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">Avg Latency</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{app.avgLatencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">Error Rate</span>
                  <span className={`font-mono font-medium ${app.errorRatePercent > 2 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {app.errorRatePercent}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">Throughput</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{app.requestsPerSec} rps</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">Instances</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{app.instancesCount} active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
