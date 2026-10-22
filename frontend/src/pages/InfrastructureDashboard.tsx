import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { serverService, metricService } from '../services';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  TrendingUp, 
  Layers,
  Database,
  Plus,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const InfrastructureDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [servers, setServers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    serverService.getServers().then(setServers).catch(console.error);
    metricService.getMetrics().then(setMetrics).catch(console.error);
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHostname, setNewHostname] = useState('');
  const [newIp, setNewIp] = useState('');
  const [newRegion, setNewRegion] = useState('us-east-1');
  const [newEnv, setNewEnv] = useState('Production');
  const [submitting, setSubmitting] = useState(false);

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostname.trim()) return;

    setSubmitting(true);
    try {
      const created = await serverService.createServer({
        hostname: newHostname.trim().toUpperCase(),
        ipAddress: newIp.trim() || '10.0.24.15',
        os: 'Ubuntu 22.04 LTS',
        region: newRegion,
        environment: newEnv,
      });

      setServers(prev => [created, ...prev]);
      setNewHostname('');
      setNewIp('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to provision host', err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalCores = servers.length * 16;
  const avgCpu = servers.length ? Math.round(servers.reduce((acc, s) => acc + s.cpuUsage, 0) / servers.length) : 0;
  const avgMem = servers.length ? Math.round(servers.reduce((acc, s) => acc + s.memoryUsage, 0) / servers.length) : 0;
  const avgDisk = servers.length ? Math.round(servers.reduce((acc, s) => acc + s.diskUsage, 0) / servers.length) : 0;

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Infrastructure & Host Utilization</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">TimescaleDB host metrics, CPU/memory capacity analytics, and cluster health.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Server / Host</span>
        </button>
      </div>

      {/* Aggregate Resource Consumption Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase">Cluster CPU Pool</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgCpu}%</span>
            <span className="text-xs text-slate-500 font-mono">/ {totalCores} vCPUs</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${avgCpu}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase">Memory Allocation</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgMem}%</span>
            <span className="text-xs text-slate-500 font-mono">/ 320 GB</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${avgMem}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase">Storage IOPS & Disk</span>
            <HardDrive className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{avgDisk}%</span>
            <span className="text-xs text-slate-500 font-mono">NVMe Tier</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${avgDisk}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0e1627] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase">TimescaleDB Hypertables</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Optimal</span>
            <span className="text-xs text-slate-500 font-mono">1.2B rows</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">Auto-compression & chunking enabled</div>
        </div>
      </div>

      {/* Recharts Telemetry Graph */}
      {metrics && metrics.cpuTimeSeries && (
        <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Real-Time Host CPU Utilization Trends</h2>
              <p className="text-xs text-slate-500">Live 5-minute aggregation from TimescaleDB hypertables.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-rose-500 font-medium">■ PAYROLL-API</span>
              <span className="text-indigo-500 font-medium">■ AUTH-SVC-01</span>
              <span className="text-amber-500 font-medium">■ PAYMENT-GW-02</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.cpuTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
                <XAxis dataKey="timestamp" stroke={isDark ? "#64748b" : "#94a3b8"} textAnchor="end" />
                <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} domain={[0, 100]} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#e2e8f0', 
                    borderRadius: '8px',
                    color: isDark ? '#cbd5e1' : '#0f172a'
                  }}
                />
                <Line type="monotone" dataKey="PAYROLL-API" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="AUTH-SVC-01" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="PAYMENT-GW-02" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Fleet Table */}
      <div className="bg-white dark:bg-[#0e1627] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a101d] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Monitored Infrastructure Nodes</h3>
          <span className="text-xs font-mono text-slate-500">{servers.length} Nodes Online</span>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-[#090f1d] border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Hostname / OS</th>
              <th className="py-3.5 px-4">Region</th>
              <th className="py-3.5 px-4">Environment</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">CPU Usage</th>
              <th className="py-3.5 px-4">Memory</th>
              <th className="py-3.5 px-4">Disk</th>
              <th className="py-3.5 px-4">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {servers.map((srv) => (
              <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white">{srv.hostname}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">{srv.ipAddress} • {srv.os}</div>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{srv.region}</td>
                <td className="py-4 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">{srv.environment}</td>
                <td className="py-4 px-4">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                    srv.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                    srv.status === 'Warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}>
                    {srv.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${srv.cpuUsage > 85 ? 'bg-rose-500' : srv.cpuUsage > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${srv.cpuUsage}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{srv.cpuUsage}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{srv.memoryUsage}%</td>
                <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{srv.diskUsage}%</td>
                <td className="py-4 px-4 font-mono text-xs text-emerald-600 dark:text-emerald-400">{srv.availability}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Server / Host Modal Portaled to Document Body */}
      {showAddModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Provision New Server / Host</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddServer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hostname / Instance Tag</label>
                <input
                  type="text"
                  value={newHostname}
                  onChange={e => setNewHostname(e.target.value)}
                  placeholder="e.g. CACHE-REDIS-01 or K8S-WORKER-03"
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">IP Address</label>
                <input
                  type="text"
                  value={newIp}
                  onChange={e => setNewIp(e.target.value)}
                  placeholder="e.g. 10.0.16.88"
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Region</label>
                  <select
                    value={newRegion}
                    onChange={e => setNewRegion(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="us-east-1">us-east-1</option>
                    <option value="us-west-2">us-west-2</option>
                    <option value="eu-west-1">eu-west-1</option>
                    <option value="ap-southeast-1">ap-southeast-1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Environment</label>
                  <select
                    value={newEnv}
                    onChange={e => setNewEnv(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Host'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
