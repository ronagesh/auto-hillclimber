import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AppliedExperiment } from '../types';

interface ImpactChartProps {
  experiment: AppliedExperiment;
}

function LiftBadge({ label, lift, before, after, ci }: { label: string; lift: number; before: number; after: number; ci: number }) {
  const positive = lift >= 0;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${positive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d={positive ? 'M13 7l5 5m0 0l-5 5m5-5H6' : 'M11 17l-5-5m0 0l5-5m-5 5h12'} />
      </svg>
      {label} {positive ? '+' : ''}{lift} pts{' '}
      <span className={`font-normal ${positive ? 'text-emerald-500' : 'text-red-400'}`}>
        ±{ci} ({before} → {after}%)
      </span>
    </span>
  );
}

export function ImpactChart({ experiment }: ImpactChartProps) {
  const fixDate = experiment.chartData[experiment.fixAtIndex]?.date;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Experiment
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{experiment.category}</span>
            <span className="inline-flex items-center gap-1 text-xs font-mono bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              LLM-as-judge
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{experiment.issueTitle}</h3>
          <p className="text-xs text-gray-400 mt-1">Change: {experiment.change}</p>
        </div>
        <div className="text-right text-xs text-gray-400 flex-shrink-0 ml-4">
          <div>Fix applied</div>
          <div className="font-semibold text-gray-700 text-sm">{experiment.appliedDate}</div>
          <div className="mt-1">Based on {experiment.conversations.toLocaleString()} spans</div>
          <a
            href="https://app.arize.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-violet-600 hover:text-violet-800 font-medium transition-colors"
          >
            View in Arize
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <LiftBadge label={experiment.metric1.label} lift={experiment.metric1.lift} before={experiment.metric1.before} after={experiment.metric1.after} ci={experiment.metric1.ci} />
        <LiftBadge label={experiment.metric2.label} lift={experiment.metric2.lift} before={experiment.metric2.before} after={experiment.metric2.after} ci={experiment.metric2.ci} />
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={experiment.chartData} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(value) => [`${Number(value).toFixed(0)}%`]}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          {fixDate && (
            <ReferenceLine
              x={fixDate}
              stroke="#6366f1"
              strokeDasharray="4 4"
              label={{ value: 'Fix applied', position: 'insideTopRight', fontSize: 10, fill: '#6366f1' }}
            />
          )}
          <Line type="monotone" dataKey="metric1" name={experiment.metric1.label} stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="metric2" name={experiment.metric2.label} stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="metric1Baseline" name={`${experiment.metric1.label} (no fix)`} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
          <Line type="monotone" dataKey="metric2Baseline" name={`${experiment.metric2.label} (no fix)`} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 mt-3">
        Lift = rolling 7-day avg after fix vs. baseline before. Dashed lines show projected trend had the fix not been applied. ±CI = 95% confidence interval.
      </p>
    </div>
  );
}
