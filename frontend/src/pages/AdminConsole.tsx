import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldAlert, 
  Plus, 
  Database, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Users, 
  Settings,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile } from '../services/authService';

interface AdminConsoleProps {
  currentUser?: UserProfile | null;
}

interface AlertRuleItem {
  id: string;
  name: string;
  targetResource: string;
  metric: string;
  threshold: number;
  durationMinutes: number;
  condition: string;
  severity: 'Critical' | 'Warning' | 'Info';
  isActive: boolean;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ currentUser }) => {
  const isAdmin = currentUser?.role === 'Admin';

  const [activeTab, setActiveTab] = useState<'rules' | 'pipeline' | 'rbac' | 'system'>('rules');

  const [rules, setRules] = useState<AlertRuleItem[]>([
    {
      id: '1',
      name: 'CPU Core Saturation Contention',
      targetResource: 'All Compute Nodes (Production)',
      metric: 'CPU Utilization',
      threshold: 90,
      durationMinutes: 5,
      condition: '> 90% for 5 min',
      severity: 'Critical',
      isActive: true,
    },
    {
      id: '2',
      name: 'HTTP 5xx Rate Spike (Ingress)',
      targetResource: 'API Gateway & Services',
      metric: 'Error Rate',
      threshold: 4,
      durationMinutes: 2,
      condition: '> 4% 5xx responses for 2 min',
      severity: 'Critical',
      isActive: true,
    },
    {
      id: '3',
      name: 'Memory Headroom Depletion',
      targetResource: 'PAYMENT-GW-02, AUTH-SVC-01',
      metric: 'Memory Usage',
      threshold: 85,
      durationMinutes: 10,
      condition: '> 85% for 10 min',
      severity: 'Warning',
      isActive: true,
    },
    {
      id: '4',
      name: 'TimescaleDB Hypertable Chunk Compression Delay',
      targetResource: 'TIMESCALEDB-METRICS-01',
      metric: 'Chunk Lag',
      threshold: 15,
      durationMinutes: 15,
      condition: '> 15 min behind chunk schedule',
      severity: 'Warning',
      isActive: false,
    },
  ]);

  const [newRuleName, setNewRuleName] = useState('');
  const [newTarget, setNewTarget] = useState('All Services');
  const [newThreshold, setNewThreshold] = useState(90);
  const [showModal, setShowModal] = useState(false);

  const toggleRule = (id: string) => {
    if (!isAdmin) return;
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newRuleName) return;

    const newRule: AlertRuleItem = {
      id: String(Date.now()),
      name: newRuleName,
      targetResource: newTarget,
      metric: 'Metric Threshold',
      threshold: newThreshold,
      durationMinutes: 5,
      condition: `> ${newThreshold}% for 5 min`,
      severity: 'Warning',
      isActive: true,
    };

    setRules([newRule, ...rules]);
    setNewRuleName('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Admin & Platform Governance</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure global alert engines, TimescaleDB telemetry ingestion, and user access policies.
          </p>
        </div>

        {/* Access Warning if not Admin */}
        {!isAdmin && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Viewing in Read-Only Mode. Log in as <strong>Alex Mercer (Admin)</strong> to make changes.</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'rules'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Global Alert Rules</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">{rules.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'pipeline'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Telemetry & TimescaleDB Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'rbac'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>RBAC & Personas</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'system'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System Endpoints</span>
        </button>
      </div>

      {/* Tab 1: Global Alert Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Active Detection & Correlation Rules</h2>
              <p className="text-xs text-slate-500">Threshold expressions evaluated against live incoming metrics.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Rule</span>
              </button>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Metric Trigger</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {rules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {rule.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{rule.targetResource}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{rule.metric}</td>
                    <td className="py-3 px-4 text-indigo-500 dark:text-indigo-400">{rule.condition}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rule.severity === 'Critical'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {rule.isActive ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Disabled</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        disabled={!isAdmin}
                        className={`px-2.5 py-1 rounded text-[11px] font-sans font-semibold border transition ${
                          rule.isActive
                            ? 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {rule.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Ingestion Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">TimescaleDB Hypertable Engine</h3>
                  <span className="text-[10px] font-mono text-emerald-500">Hypertables Active (7d chunk interval)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-500 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Ingestion Rate</span>
                <span className="text-slate-800 dark:text-slate-200">12,450 points/sec</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Chunk Compression Ratio</span>
                <span className="text-emerald-500 font-bold">11.4x (ZSTD)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Continuous Aggregates</span>
                <span className="text-slate-800 dark:text-slate-200">1m, 5m, 1h rollup views</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Retention Policy</span>
                <span className="text-slate-800 dark:text-slate-200">90 Days Auto-Drop</span>
              </div>
            </div>

            <button
              disabled={!isAdmin}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg transition disabled:opacity-40"
            >
              Recompute Continuous Aggregates
            </button>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">OTel & Vector Telemetry Ingress</h3>
                  <span className="text-[10px] font-mono text-cyan-400">gRPC :4317 / HTTP :4318</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Healthy
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-500 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Connected Agents</span>
                <span className="text-slate-800 dark:text-slate-200">4 Hosts, 4 Services</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Buffer Backpressure</span>
                <span className="text-emerald-500">0.0% (No Drop)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Sampling Strategy</span>
                <span className="text-slate-800 dark:text-slate-200">100% Adaptive Trace</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Ingress Gateway</span>
                <span className="text-slate-800 dark:text-slate-200">Envoy Ingress Proxy</span>
              </div>
            </div>

            <button
              disabled={!isAdmin}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg transition disabled:opacity-40"
            >
              Flush Metric Buffer
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: RBAC Personas */}
      {activeTab === 'rbac' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Configured Enterprise Personas & Policies</h3>
            <p className="text-xs text-slate-500">Permissions are enforced via JWT claims and policy handlers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-500">Alex Mercer</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400">Admin</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Full System Authority. Can configure detection rules, tune TimescaleDB hypertables, manage services, and access all endpoints.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-500">Sarah Connor</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400">SRE</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Lead SRE & Incident Commander. Can acknowledge & silence alerts, open and mitigate incidents, trigger AI root-cause analysis.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-500">DevOps OnCall</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400">DevOps</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Operational Responder. Can view host metrics, acknowledge assigned host alerts, and append remediation actions.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-400">Executive Viewer</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-500/15 text-slate-400">Viewer</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Read-only observer. Inspect executive uptime summaries and SLA compliance reports. Mutation actions are blocked.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System Endpoints */}
      {activeTab === 'system' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Registered Backend Endpoints (.NET 8)</span>
            <a
              href="http://localhost:5245/swagger"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-indigo-500 hover:underline text-[11px]"
            >
              <span>Open Swagger UI</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span>GET /api/dashboard/summary</span>
              <span className="text-[10px] text-emerald-500">Anonymous</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span>GET /api/servers & GET /api/applications</span>
              <span className="text-[10px] text-emerald-500">Anonymous</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span>POST /api/alerts/&#123;id&#125;/acknowledge</span>
              <span className="text-[10px] text-amber-500">Auth / SRE & DevOps</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span>POST /api/alert-rules (Create Detection Rule)</span>
              <span className="text-[10px] text-rose-500 font-bold">Admin Only</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span>PATCH /api/alert-rules/&#123;id&#125;/toggle</span>
              <span className="text-[10px] text-rose-500 font-bold">Admin Only</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-900/60">
              <span>POST /api/auth/login & GET /api/auth/me</span>
              <span className="text-[10px] text-indigo-400">JWT Bearer</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Rule Modal Portaled to Document Body */}
      {showModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Create Global Alert Rule</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  placeholder="e.g. Ingress Latency SLA Breach (> 300ms)"
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Resource</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={e => setNewTarget(e.target.value)}
                  placeholder="e.g. PAYROLL-API or Microservices"
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Threshold Percentage (%)</label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={e => setNewThreshold(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                >
                  Save & Deploy Rule
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
