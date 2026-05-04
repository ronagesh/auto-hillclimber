import { useState } from 'react';
import type { Issue, Priority } from '../types';
import { ISSUES } from '../data/issues';
import { IssueCard } from './IssueCard';

const PRIORITIES: { label: string; value: Priority | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const CATEGORIES = ['All', 'Correctness', 'Hallucination', 'Escalation Accuracy'];

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
        <div className="mt-1 flex items-center gap-1">
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
  onRunExperiment: (id: string) => void;
}

export function HillclimbFeed({ onRunExperiment }: HillclimbFeedProps) {
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [category, setCategory] = useState('All');

  const filtered = ISSUES.filter((issue: Issue) => {
    if (priority !== 'all' && issue.priority !== priority) return false;
    if (category !== 'All' && issue.category !== category) return false;
    return true;
  });

  const highCount = ISSUES.filter(i => i.priority === 'high').length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Arize Autopilot</h1>
        <p className="text-sm text-gray-500">
          Issues are ranked by their expected impact on your KPIs. Apply suggested fixes to start improving your metrics.
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <StatCard label="Open Issues" value={ISSUES.length} sub="awaiting action" />
        <StatCard label="High Priority" value={highCount} sub="immediate attention needed" />
        <StatCard label="Correctness Lift" value="+8 pts" sub="↑ from last experiment" accent />
        <StatCard label="Escalation Lift" value="+16 pts" sub="↑ from last experiment" accent />
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
            {CATEGORIES.map(c => (
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
