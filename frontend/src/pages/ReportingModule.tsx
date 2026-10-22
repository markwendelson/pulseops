import React, { useEffect, useState } from 'react';
import { reportService } from '../services';
import { 
  Download,
  FileCheck2,
  Calendar,
  Layers,
  PieChart as PieIcon,
  Filter,
  ShieldCheck,
  Clock,
  TrendingDown,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const ReportingModule: React.FC = () => {
  const { theme } = useTheme();
  const [reports, setReports] = useState<any[]>([]);
  const [activeReportType, setActiveReportType] = useState<'all' | 'availability' | 'mttr' | 'rootcause'>('all');

  useEffect(() => {
    reportService.getReports().then(setReports).catch(console.error);
  }, []);

  const isDark = theme === 'dark';

  const mttrBreakdown = [
    { name: 'Payroll API', mttr: 18.2, mttd: 2.4, mtta: 4.8 },
    { name: 'Auth Gateway', mttr: 8.5, mttd: 1.2, mtta: 2.0 },
    { name: 'Settlement Bridge', mttr: 24.0, mttd: 4.5, mtta: 6.2 },
    { name: 'Web Console', mttr: 6.1, mttd: 1.0, mtta: 1.5 },
  ];

  const rootCauseDistribution = [
    { name: 'DB Connection Starvation', value: 45, color: '#f43f5e' },
    { name: 'BGP / Regional Network Jitter', value: 25, color: '#f59e0b' },
    { name: 'Memory Leak & GC Pause', value: 18, color: '#6366f1' },
    { name: 'Third-party API Timeout', value: 12, color: '#06b6d4' },
  ];

  const historicalSlaTrends = [
    { month: 'May 2026', sla: 99.98, target: 99.90 },
    { month: 'Jun 2026', sla: 99.92, target: 99.90 },
    { month: 'Jul 2026', sla: 99.96, target: 99.90 },
    { month: 'Aug 2026', sla: 99.89, target: 99.90 },
    { month: 'Sep 2026', sla: 99.97, target: 99.90 },
    { month: 'Oct 2026', sla: 99.94, target: 99.90 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Observability & SLA Reporting</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Audit-grade SLA compliance, MTTR/MTTD/MTTA breakdown, and Root Cause distributions.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export Audit PDF</span>
        </button>
      </div>

      {/* Report Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Executive Reports' },
          { id: 'availability', label: 'Availability & SLA' },
          { id: 'mttr', label: 'MTTR / MTTD / MTTA' },
          { id: 'rootcause', label: 'Root Cause Distribution' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportType(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeReportType === tab.id
                ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Availability & SLA */}
      {(activeReportType === 'all' || activeReportType === 'availability') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Audited SLA Compliance Ledgers & Trends</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">TimescaleDB SLA Rollups</span>
          </div>

          {/* Historical Trend Line Chart */}
          <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Monthly SLA Performance (%)</h4>
                <p className="text-xs text-slate-500">6-Month continuous compliance tracking against 99.90% SLA contract.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-500">■ Measured SLA</span>
                <span className="text-rose-500">--- Target (99.90%)</span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalSlaTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                  <XAxis dataKey="month" stroke={isDark ? "#64748b" : "#94a3b8"} />
                  <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} domain={[99.80, 100]} unit="%" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                      borderColor: isDark ? '#334155' : '#e2e8f0', 
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="sla" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Published Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((rep) => (
              <div key={rep.id} className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{rep.name}</h4>
                    <span className="text-xs font-mono text-slate-400 block mt-0.5">Audit Window: {rep.period}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                    SLA Met
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Availability</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{rep.overallAvailability}%</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">Target: {rep.slaTarget}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">SLA Breaches</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{rep.slaBreaches}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">0 penalty</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Avg MTTR</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">{rep.mttrMinutes}m</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">-18% trend</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MTTR / MTTD / MTTA */}
      {(activeReportType === 'all' || activeReportType === 'mttr') && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Incident Resolution Metrics (MTTR / MTTD / MTTA in Minutes)</span>
                </h3>
                <p className="text-xs text-slate-500">Benchmark across core business systems.</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-indigo-600 dark:text-indigo-400">■ MTTR (Resolution)</span>
                <span className="text-amber-600 dark:text-amber-400">■ MTTA (Ack)</span>
                <span className="text-cyan-600 dark:text-cyan-400">■ MTTD (Detection)</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mttrBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                  <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#94a3b8"} />
                  <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} unit="m" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                      borderColor: isDark ? '#334155' : '#e2e8f0', 
                      borderRadius: '8px',
                      color: isDark ? '#cbd5e1' : '#0f172a'
                    }}
                  />
                  <Bar dataKey="mttr" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mtta" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mttd" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Root Cause Distribution */}
      {(activeReportType === 'all' || activeReportType === 'rootcause') && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-purple-500" />
                  <span>Root Cause Distribution (Past 90 Days)</span>
                </h3>
                <p className="text-xs text-slate-500">Classification of confirmed root cause tickets across production incidents.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rootCauseDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
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

              <div className="space-y-3">
                {rootCauseDistribution.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
