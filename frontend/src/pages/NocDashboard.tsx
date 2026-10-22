import React, { useEffect, useState } from 'react';
import { alertService, serverService, applicationService } from '../services';
import { 
  Radio, 
  AlertOctagon,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';

export const NocDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [servers, setServers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    alertService.getAlerts().then(setAlerts).catch(console.error);
    serverService.getServers().then(setServers).catch(console.error);
    applicationService.getApplications().then(setApplications).catch(console.error);
  }, []);

  const failingAssets = servers.filter(s => s.status === 'Critical' || s.status === 'Warning');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">NOC Operational Wallboard</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              REAL-TIME
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live telemetry monitoring stream, failing assets, service health, and active incident mitigation.</p>
        </div>
      </div>

      {/* Service Status Overview (PROJECT.md spec) */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Service Status Overview</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {applications.map((app) => (
            <div key={app.id} className="p-4 rounded-xl bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {app.name}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 whitespace-nowrap ${
                  app.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                  app.status === 'Warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}>
                  {app.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <span>{app.tier}</span>
                <span className="text-slate-400 dark:text-slate-500">{app.instancesCount || 4} active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Split: Failing Assets & Live Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Failing Assets Column */}
        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Top Failing Assets</span>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-mono font-bold">
              {failingAssets.length} Degraded
            </span>
          </div>

          <div className="space-y-3">
            {failingAssets.map(asset => (
              <div key={asset.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{asset.hostname}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    asset.status === 'Critical' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {asset.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>CPU: <strong className="text-rose-600 dark:text-rose-400 font-mono">{asset.cpuUsage}%</strong></span>
                  <span>RAM: <strong className="text-slate-700 dark:text-slate-300 font-mono">{asset.memoryUsage}%</strong></span>
                  <span>Region: <strong className="text-slate-700 dark:text-slate-300 font-mono">{asset.region}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Event & Alert Feed (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Live Incident & Alert Stream</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">TimescaleDB Hypertable Sync</span>
          </div>

          <div className="space-y-3">
            {alerts.map(alt => (
              <div key={alt.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg ${
                    alt.severity === 'Critical' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}>
                    <AlertOctagon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{alt.title}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      Target: {alt.targetResource} • Source: {alt.source}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {alt.status}
                  </span>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">2026-10-21</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Topology / Health Map */}
      <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Cluster Infrastructure Health Map</h3>
            <p className="text-xs text-slate-500">Real-time node matrix across availability zones (72 nodes shown).</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              Healthy (181)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-medium whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              Warning (2)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 font-medium whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-ping"></span>
              Critical (1)
            </span>
          </div>
        </div>

        {/* Node Matrix Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-24 gap-2 pt-2">
          {Array.from({ length: 72 }).map((_, i) => {
            let color = 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-800 dark:text-slate-300';
            if (i === 14) color = 'bg-rose-500 border-rose-400 animate-pulse text-white';
            if (i === 28 || i === 45) color = 'bg-amber-500/30 border-amber-500 hover:bg-amber-500/50 text-amber-900 dark:text-slate-300';
            return (
              <div 
                key={i} 
                className={`h-7 rounded border ${color} transition cursor-pointer flex items-center justify-center text-[10px] font-mono`}
                title={`Host Node #${i + 1}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
