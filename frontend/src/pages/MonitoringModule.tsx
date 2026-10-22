import React, { useState } from 'react';
import { 
  Server, 
  AppWindow, 
  Globe, 
  Terminal, 
  Database, 
  Box
} from 'lucide-react';

export const MonitoringModule: React.FC = () => {
  const [subModule, setSubModule] = useState<'servers' | 'applications' | 'websites' | 'apis' | 'databases' | 'containers'>('servers');

  const navItems = [
    { id: 'servers', label: 'Servers', icon: Server, count: 5 },
    { id: 'applications', label: 'Applications', icon: AppWindow, count: 4 },
    { id: 'websites', label: 'Websites', icon: Globe, count: 3 },
    { id: 'apis', label: 'APIs', icon: Terminal, count: 8 },
    { id: 'databases', label: 'Databases', icon: Database, count: 2 },
    { id: 'containers', label: 'Containers', icon: Box, count: 24 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Infrastructure & Application Monitoring</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Granular resource telemetry, synthetic probes, and database hypertable monitors.</p>
      </div>

      {/* Submodule Tab Ribbon */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = subModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubModule(item.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                isActive 
                  ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submodule Content */}
      <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {subModule === 'websites' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Synthetics & Uptime Probes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'pulseops.io', status: '200 OK', latency: '42ms', uptime: '99.99%' },
                { name: 'app.pulseops.io', status: '200 OK', latency: '58ms', uptime: '99.95%' },
                { name: 'status.pulseops.io', status: '200 OK', latency: '35ms', uptime: '100.0%' },
              ].map((site, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{site.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      {site.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between pt-2">
                    <span>Latency: <strong className="text-slate-800 dark:text-slate-200 font-mono">{site.latency}</strong></span>
                    <span>Uptime: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{site.uptime}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subModule === 'databases' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Database Instances & TimescaleDB Extension</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">PostgreSQL 16 Primary (OLTP)</span>
                    <span className="text-xs text-slate-500 block font-mono">Users, Alerts, Incidents, RBAC</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Healthy</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div><span className="text-slate-500 block">Connections</span><span className="font-mono text-slate-900 dark:text-white">84 / 200</span></div>
                  <div><span className="text-slate-500 block">Buffer Cache</span><span className="font-mono text-slate-900 dark:text-white">99.4%</span></div>
                  <div><span className="text-slate-500 block">TPS</span><span className="font-mono text-slate-900 dark:text-white">1,240</span></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">TimescaleDB Hypertable Engine</span>
                    <span className="text-xs text-slate-500 block font-mono">Metrics Telemetry & Logs Retention</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Healthy</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div><span className="text-slate-500 block">Ingestion Rate</span><span className="font-mono text-slate-900 dark:text-white">45k / sec</span></div>
                  <div><span className="text-slate-500 block">Compression</span><span className="font-mono text-emerald-600 dark:text-emerald-400">92%</span></div>
                  <div><span className="text-slate-500 block">Chunks</span><span className="font-mono text-slate-900 dark:text-white">184 active</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {subModule === 'apis' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Instrumented API Endpoints</h3>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
              {[
                { method: 'GET', path: '/api/dashboard/summary', p99: '45ms', status: '200' },
                { method: 'GET', path: '/api/servers', p99: '82ms', status: '200' },
                { method: 'GET', path: '/api/applications', p99: '64ms', status: '200' },
                { method: 'POST', path: '/api/v1/payroll/disburse', p99: '850ms', status: '502 Spike' },
              ].map((apiRow, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{apiRow.method}</span>
                    <span className="text-slate-800 dark:text-slate-200">{apiRow.path}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 dark:text-slate-400">p99: {apiRow.p99}</span>
                    <span className={apiRow.status.includes('502') ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400'}>{apiRow.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subModule === 'containers' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Kubernetes / Docker Container Pods</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">24 active pods across namespace <code>pulseops-prod</code>.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="text-slate-900 dark:text-white font-semibold">pod-worker-0{i+1}</div>
                  <div className="text-slate-500 text-[10px] mt-1">CPU: {(i*4 + 12)}% • RAM: {(i*3 + 30)}%</div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-[10px] mt-1">Running (Ready 1/1)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(subModule === 'servers' || subModule === 'applications') && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            View detailed metrics in the primary <strong>Infrastructure Fleet</strong> and <strong>Application Services</strong> dashboards.
          </div>
        )}
      </div>
    </div>
  );
};
