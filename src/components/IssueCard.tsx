import { useState } from 'react';
import type { Issue, Level, Priority } from '../types';
import { IssueDrawer } from './IssueDrawer';

const priorityStyles: Record<Priority, string> = {
  high: 'bg-red-50 text-red-600 border border-red-100',
  medium: 'bg-orange-50 text-orange-600 border border-orange-100',
  low: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const levelColor: Record<Level, string> = {
  high: 'text-red-600',
  medium: 'text-orange-500',
  low: 'text-gray-400',
};

const levelLabel: Record<Level, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

interface IssueCardProps {
  issue: Issue;
  onApply: (id: string) => void;
}

export function IssueCard({ issue, onApply }: IssueCardProps) {
  const [applied, setApplied] = useState(issue.status === 'applied');
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleApply() {
    setApplied(true);
    onApply(issue.id);
  }

  function handleDeploy(_id: string, _fix: string) {
    setApplied(true);
    onApply(issue.id);
  }

  return (
    <>
      <div
        onClick={() => !applied && setDrawerOpen(true)}
        className={`bg-white border rounded-lg p-5 transition-colors ${
          applied
            ? 'border-emerald-200 opacity-70'
            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {!applied && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyles[issue.priority]}`}>
                  {issue.priority === 'high' ? 'High Priority' : issue.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                </span>
              )}
              {applied && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Fix applied · experiment running
                </span>
              )}
              <span className="text-xs text-gray-400">{issue.category}</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{issue.evaluator}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">{issue.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{issue.description}</p>
            <div className="flex items-center gap-5 text-xs">
              <span className="text-gray-400">
                Frequency <span className={`font-semibold ${levelColor[issue.frequency]}`}>{levelLabel[issue.frequency]}</span>
              </span>
              <span className="text-gray-400">
                KPI Risk <span className={`font-semibold ${levelColor[issue.kpiRisk]}`}>{levelLabel[issue.kpiRisk]}</span>
              </span>
              <span className="text-gray-400">
                Escalation Volume <span className={`font-semibold ${levelColor[issue.escalationVolume]}`}>{levelLabel[issue.escalationVolume]}</span>
              </span>
              <span className="text-gray-400">
                Affected Spans <span className="font-semibold text-gray-700">{issue.affectedSpans.toLocaleString()}</span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            {applied ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Applied
              </div>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); handleApply(); }}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-full transition-colors whitespace-nowrap"
              >
                Apply Fix
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-500">Suggested fix: </span>
            {issue.suggestedFix}
          </p>
        </div>
      </div>

      {drawerOpen && (
        <IssueDrawer
          issue={issue}
          onClose={() => setDrawerOpen(false)}
          onDeploy={handleDeploy}
        />
      )}
    </>
  );
}
