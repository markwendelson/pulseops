import React, { useEffect, useState } from 'react';
import { incidentService, alertService } from '../services';
import { 
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Search,
  MessageSquare,
  ShieldAlert,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const IncidentManagement: React.FC = () => {
  const { theme } = useTheme();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'alerts' | 'mitigation'>('overview');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    incidentService.getIncidents().then((data) => {
      setIncidents(data);
      if (data.length > 0) setSelectedIncident(data[0]);
    }).catch(console.error);
    alertService.getAlerts().then(setAlerts).catch(console.error);
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSeverity = filterSeverity === 'All' || inc.severity.includes(filterSeverity);
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Incident War Room & Root Cause AI</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time incident response, multi-signal correlation, and LLM-assisted diagnostic engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filter & Incident List */}
        <div className="space-y-3">
          {/* Search & Filter */}
          <div className="bg-white dark:bg-[#0e1627] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket or title..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {['All', 'P1', 'P3'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`flex-1 py-1 rounded text-[11px] font-medium transition ${
                    filterSeverity === sev
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Feed */}
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={`p-4 rounded-xl border transition cursor-pointer shadow-sm ${
                selectedIncident?.id === inc.id
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-500/80 ring-1 ring-indigo-500/30'
                  : 'bg-white dark:bg-[#0e1627] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {inc.severity}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{inc.ticketNumber}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-2 line-clamp-2">{inc.title}</h4>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>{inc.status}</span>
                <span>{inc.openedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Detailed Incident View */}
        {selectedIncident && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#0e1627] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      {selectedIncident.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedIncident.ticketNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-semibold">
                      {selectedIncident.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">{selectedIncident.title}</h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>Incident Commander: <strong className="text-slate-800 dark:text-slate-200">{selectedIncident.commander}</strong></span>
                    <span>•</span>
                    <span>Opened: <strong className="text-slate-800 dark:text-slate-200">{selectedIncident.openedAt}</strong></span>
                    <span>•</span>
                    <span>Impacted: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{selectedIncident.impactedServices.join(', ')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Sub Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                {[
                  { id: 'overview', label: 'Overview & Root Cause' },
                  { id: 'timeline', label: 'Activity Timeline' },
                  { id: 'alerts', label: 'Related Alerts' },
                  { id: 'mitigation', label: 'Runbook & Mitigation' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === tab.id
                        ? 'bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview & Root Cause AI */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* AI Diagnostic Engine Card */}
                  {selectedIncident.aiSummary && (
                    <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-gradient-to-r dark:from-indigo-950/60 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-500/40 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                        <span>PulseOps AI Diagnostic Engine & Recommendation</span>
                      </div>
                      <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium dark:font-normal">
                        {selectedIncident.aiSummary}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
                        <span>Suggested Action: Scale replica count to 10 & inspect connection pool timeout</span>
                      </div>
                    </div>
                  )}

                  {/* Root Cause Candidate */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Root Cause Analysis</h3>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300">
                      {selectedIncident.rootCauseCandidate || 'Hypothesis under active SRE investigation.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Activity Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Incident Activity Timeline</h3>
                  <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-2 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      <div className="font-semibold text-slate-900 dark:text-white">Incident Triggered & P1 Pager Activated</div>
                      <div className="text-slate-500 font-mono text-[11px]">09:24 UTC - Automated Ingress HTTP 502 spike detection</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      <div className="font-semibold text-slate-900 dark:text-white">Commander Acknowledged & Triage Initiated</div>
                      <div className="text-slate-500 font-mono text-[11px]">09:28 UTC - Sarah Connor took command</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
                      <div className="font-semibold text-slate-900 dark:text-white">AI Diagnostic Engine Correlated TimescaleDB Telemetry</div>
                      <div className="text-slate-500 font-mono text-[11px]">09:30 UTC - Connection pool exhaustion isolated on PAYROLL-API</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <div className="font-semibold text-slate-900 dark:text-white">Mitigation In Progress: Pod Horizontal Auto-scaling Triggered</div>
                      <div className="text-slate-500 font-mono text-[11px]">09:34 UTC - Horizontal Pod Autoscaler scaling pods 6 -&gt; 10</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Related Alerts */}
              {activeTab === 'alerts' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Correlated Trigger Alerts (TimescaleDB Aggregation)</h3>
                  <div className="space-y-2">
                    {alerts.filter(a => selectedIncident.impactedServices.some((s: string) => a.title.includes(s) || a.targetResource.includes(s))).map((alt) => (
                      <div key={alt.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`p-1 rounded ${alt.severity === 'Critical' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">{alt.title}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">Source: {alt.source} • {alt.timestamp}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                          {alt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Runbook & Mitigation */}
              {activeTab === 'mitigation' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">Automated SRE Runbook Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 transition group">
                      <div className="flex items-center justify-between text-slate-900 dark:text-white font-semibold text-xs">
                        <span>Scale Kubernetes Deployment</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-1 transition" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Increase replica count to 10 pods to relieve CPU bottleneck.</p>
                    </button>
                    <button className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 transition group">
                      <div className="flex items-center justify-between text-slate-900 dark:text-white font-semibold text-xs">
                        <span>Flush DB Connection Pool</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-1 transition" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Issue graceful reset to PostgreSQL transaction pooling pooler.</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
