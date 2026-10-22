import React, { useEffect, useState } from 'react';
import { alertService } from '../services';
import { 
  AlertTriangle, 
  Plus, 
  X, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AlertRule {
  id: string;
  name: string;
  target: string;
  condition: string;
  severity: 'Critical' | 'Warning';
  metric: string;
  threshold: number;
  durationMinutes: number;
}

export const AlertManagement: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'list' | 'rules' | 'escalation' | 'maintenance'>('list');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rules state
  const [rules, setRules] = useState<AlertRule[]>([
    { id: 'rule-1', name: 'Host CPU Sustained > 90% for 3m', target: 'Servers Fleet', metric: 'host.cpu_core_usage', threshold: 90, durationMinutes: 3, condition: 'avg(cpu) > 90', severity: 'Critical' },
    { id: 'rule-2', name: 'HTTP Ingress 5xx Rate > 4%', target: 'API Gateway', metric: 'http.5xx_rate', threshold: 4, durationMinutes: 2, condition: 'rate(5xx) > 0.04', severity: 'Critical' },
    { id: 'rule-3', name: 'PostgreSQL Disk Volume > 85%', target: 'Database', metric: 'pg.disk_used_pct', threshold: 85, durationMinutes: 5, condition: 'disk_used > 85%', severity: 'Warning' },
    { id: 'rule-4', name: 'TimescaleDB Hypertable Lag > 15m', target: 'TimescaleDB', metric: 'timescale.chunk_lag', threshold: 15, durationMinutes: 15, condition: 'lag_chunks > 10', severity: 'Warning' },
  ]);

  // Create Rule Modal State
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState<{
    name: string;
    target: string;
    metric: string;
    threshold: number;
    durationMinutes: number;
    severity: 'Critical' | 'Warning';
  }>({
    name: '',
    target: 'Servers Fleet',
    metric: 'host.cpu_core_usage',
    threshold: 80,
    durationMinutes: 5,
    severity: 'Warning'
  });

  useEffect(() => {
    alertService.getAlerts().then(setAlerts).catch(console.error);
  }, []);

  const handleAcknowledge = async (id: number) => {
    await alertService.acknowledgeAlert(id);
    setAlerts((prev) => 
      prev.map((a) => (a.id === id ? { ...a, status: 'Acknowledged' } : a))
    );
    if (selectedAlert && selectedAlert.id === id) {
      setSelectedAlert((prev: any) => ({ ...prev, status: 'Acknowledged' }));
    }
  };

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name.trim()) return;

    const created: AlertRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      target: newRule.target,
      metric: newRule.metric,
      threshold: Number(newRule.threshold),
      durationMinutes: Number(newRule.durationMinutes),
      condition: `${newRule.metric} > ${newRule.threshold} for ${newRule.durationMinutes}m`,
      severity: newRule.severity,
    };

    setRules([created, ...rules]);
    setIsCreateRuleOpen(false);
    setNewRule({
      name: '',
      target: 'Servers Fleet',
      metric: 'host.cpu_core_usage',
      threshold: 80,
      durationMinutes: 5,
      severity: 'Warning'
    });
  };

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSeverity = filterSeverity === 'All' || alt.severity === filterSeverity;
    const matchesSearch = alt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alt.targetResource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Alert Management & Correlation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Multi-signal detection rules, PagerDuty escalation policies, and scheduled maintenance windows.</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'list', label: 'Alert List', count: alerts.length },
          { id: 'rules', label: 'Alert Rules', count: rules.length },
          { id: 'escalation', label: 'Escalation Policies', count: 3 },
          { id: 'maintenance', label: 'Maintenance Windows', count: 1 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
              activeTab === tab.id
                ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab: Alert List */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#0e1627] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter alerts by title or host..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-medium">Severity:</span>
              {['All', 'Critical', 'Warning'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    filterSeverity === sev
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* List Feed */}
          <div className="space-y-3">
            {filteredAlerts.map((alt) => (
              <div 
                key={alt.id} 
                onClick={() => setSelectedAlert(alt)}
                className={`p-4 rounded-xl bg-white dark:bg-[#0e1627] border cursor-pointer transition shadow-sm flex items-center justify-between ${
                  selectedAlert?.id === alt.id 
                    ? 'border-indigo-500 dark:border-indigo-500/80 ring-1 ring-indigo-500/30' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`p-2 rounded-lg mt-0.5 ${
                    alt.severity === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{alt.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{alt.targetResource}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                      <span>Source: {alt.source}</span>
                      <span>•</span>
                      <span>Fired: {alt.timestamp}</span>
                      {alt.assignedTo && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">Assigned: {alt.assignedTo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcknowledge(alt.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      alt.status === 'Acknowledged'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {alt.status === 'Acknowledged' ? 'Acknowledged' : 'Acknowledge'}
                  </button>
                  <button 
                    onClick={() => setSelectedAlert(alt)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Details Drawer / Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-xl ${
                  selectedAlert.severity === 'Critical' 
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedAlert.severity === 'Critical' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}>
                      {selectedAlert.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID #{selectedAlert.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedAlert.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Context Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Entity</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">{selectedAlert.targetResource}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Collector</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">{selectedAlert.source}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Status</span>
                <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">{selectedAlert.status}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Responder</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">{selectedAlert.assignedTo || 'Unassigned'}</span>
              </div>
            </div>

            {/* Telemetry Trigger Evaluation */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Evaluation & Metric Threshold</h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>Threshold Rule: <code>avg(host.cpu_core_usage) &gt; 92% for 3m</code></span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">Current: 93.4%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '93%' }} />
                </div>
                <div className="text-[11px] text-slate-400">Sample window collected via TimescaleDB telemetry continuous aggregates.</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAcknowledge(selectedAlert.id);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
              >
                {selectedAlert.status === 'Acknowledged' ? 'Already Acknowledged' : 'Acknowledge Alert'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Alert Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-[#0e1627] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Configured Telemetry Alert Rules</h3>
              <p className="text-xs text-slate-500 mt-0.5">Continuous evaluation against TimescaleDB telemetry metrics.</p>
            </div>
            <button 
              onClick={() => setIsCreateRuleOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Rule</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {rules.map((rule) => (
              <div key={rule.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/40 px-2 rounded-lg transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{rule.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {rule.target}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 dark:text-slate-500 text-[11px] block mt-1">
                    Condition: <code>{rule.condition}</code> • Threshold: &gt; {rule.threshold}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    rule.severity === 'Critical' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {rule.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Alert Rule */}
      {isCreateRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600/15 text-indigo-600 dark:text-indigo-400">
                  <Plus className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Telemetry Alert Rule</h3>
              </div>
              <button
                onClick={() => setIsCreateRuleOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRuleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory Thrashing Spike > 85%"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Resource</label>
                  <select
                    value={newRule.target}
                    onChange={(e) => setNewRule({ ...newRule, target: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Servers Fleet">Servers Fleet</option>
                    <option value="API Gateway">API Gateway</option>
                    <option value="Payroll Transaction Engine">Payroll Transaction Engine</option>
                    <option value="Database Cluster">Database Cluster</option>
                    <option value="TimescaleDB Hypertable">TimescaleDB Hypertable</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Telemetry Metric</label>
                  <select
                    value={newRule.metric}
                    onChange={(e) => setNewRule({ ...newRule, metric: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                  >
                    <option value="host.cpu_core_usage">host.cpu_core_usage (%)</option>
                    <option value="host.memory_used_pct">host.memory_used_pct (%)</option>
                    <option value="http.5xx_rate">http.5xx_rate (%)</option>
                    <option value="latency.p99_ms">latency.p99_ms (ms)</option>
                    <option value="pg.disk_used_pct">pg.disk_used_pct (%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Threshold Value</label>
                  <input
                    type="number"
                    required
                    value={newRule.threshold}
                    onChange={(e) => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={newRule.durationMinutes}
                    onChange={(e) => setNewRule({ ...newRule, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Severity</label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
                Generated Expression: <code>{newRule.metric} &gt; {newRule.threshold} for {newRule.durationMinutes}m</code>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateRuleOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Escalation Policies */}
      {activeTab === 'escalation' && (
        <div className="bg-white dark:bg-[#0e1627] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">PagerDuty & Slack Escalation Policies</h3>
          <div className="space-y-3">
            {[
              { level: 'Level 1 (0-5m)', desc: 'Notify primary SRE On-Call via Slack #sre-war-room + PagerDuty Push' },
              { level: 'Level 2 (5-15m)', desc: 'Escalate to Secondary On-Call Lead + Automated Phone Call' },
              { level: 'Level 3 (15m+)', desc: 'Executive Incident Commander page + VP of Engineering Notification' },
            ].map((esc, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{esc.level}</span>
                <span className="text-slate-700 dark:text-slate-300">{esc.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Maintenance Windows */}
      {activeTab === 'maintenance' && (
        <div className="bg-white dark:bg-[#0e1627] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Scheduled Maintenance Windows (Alert Suppression)</h3>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Weekly TimescaleDB Index Reorg & Vacuum</div>
              <div className="text-slate-500 font-mono mt-0.5">Every Sunday 02:00 UTC - 03:00 UTC (Suppresses DB I/O alerts)</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">Active Schedule</span>
          </div>
        </div>
      )}
    </div>
  );
};
