import { EXPERIMENTS } from '../data/experiments';
import { ISSUES } from '../data/issues';
import { ImpactChart } from './ImpactChart';

export function ImpactTracker() {
  const openIssues = ISSUES.filter(i => i.status === 'open');

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Impact Tracker</h1>
        <p className="text-sm text-gray-500">
          See how each applied experiment has moved your KPIs over time. Metrics are segmented by issue category so you can see the direct effect of each change.
        </p>
      </div>

      {EXPERIMENTS.map(exp => (
        <ImpactChart key={exp.id} experiment={exp} />
      ))}

      {openIssues.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-3">
            {openIssues.length} more issue{openIssues.length !== 1 ? 's' : ''} waiting for a fix
          </p>
          <div className="flex flex-wrap gap-2">
            {openIssues.map(issue => (
              <span
                key={issue.id}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full"
              >
                {issue.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
