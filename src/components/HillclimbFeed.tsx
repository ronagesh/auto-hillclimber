import { useState } from 'react';
import type { Issue, Priority, AgentProfile } from '../types';
import { IssueCard } from './IssueCard';

const PRIORITIES: { label: string; value: Priority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && (
        <div className="mt-1">
          {accent ? (
            <span className="text-xs font-semibold text-emerald-600">{sub}</span>
          ) : (
            <span className="text-xs text-gray-400">{sub}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface HillclimbFeedProps {
  profile: AgentProfile;
  onRunExperiment: (id: string) => void;
}

export function HillclimbFeed({ profile, onRunExperiment }: HillclimbFeedProps) {
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(profile.issues.map(i => i.category)))];

  const filtered = profile.issues.filter((issue: Issue) => {
    if (priority !== 'all' && issue.priority !== priority) return false;
    if (category !== 'All' && issue.category !== category) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Arize Autopilot</h1>
        <p className="text-sm text-gray-500">
          Issues are ranked by their expected impact on your KPIs. Apply suggested fixes to automatically run experiments and improve your agent.
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <StatCard label="Open Issues" value={profile.openIssues} sub="awaiting action" />
        <StatCard label="High Priority" value={profile.highPriority} sub="immediate attention needed" />
        <StatCard label={profile.kpi1 + ' Lift'} value={profile.kpi1Lift} sub="↑ from last experiment" accent />
        <StatCard label={profile.kpi2 + ' Lift'} value={profile.kpi2Lift} sub="↑ from last experiment" accent />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Priority</span>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority | 'all')}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {PRIORITIES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Category</span>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} issue{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(issue => (
          <IssueCard key={issue.id} issue={issue} onRunExperiment={onRunExperiment} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No issues match the selected filters.</div>
        )}
      </div>
    </div>
  );
}
