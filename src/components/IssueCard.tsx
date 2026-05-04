import type { Issue, Level, Priority } from '../types';

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
  onRunExperiment: (id: string) => void;
}

export function IssueCard({ issue, onRunExperiment }: IssueCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyles[issue.priority]}`}>
              {issue.priority === 'high' ? 'High Priority' : issue.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
            </span>
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
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <button
            onClick={() => onRunExperiment(issue.id)}
            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-full transition-colors whitespace-nowrap"
          >
            Run Experiment
          </button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-50">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-500">Suggested fix: </span>
          {issue.suggestedFix}
        </p>
      </div>
    </div>
  );
}
