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

function LiftBadge({ label, before, after, lift, ci }: { label: string; before: number; after: number; lift: number; ci: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold px-3 py-1 rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      {label} +{lift} pts <span className="font-normal text-emerald-500">±{ci} ({before} → {after}%)</span>
    </span>
  );
}

export function ImpactChart({ experiment }: ImpactChartProps) {
  const fixDate = experiment.chartData[experiment.fixAtIndex]?.date;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded mb-2">
            {experiment.category}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{experiment.issueTitle}</h3>
          <p className="text-xs text-gray-400 mt-1">Change: {experiment.change}</p>
        </div>
        <div className="text-right text-xs text-gray-400 flex-shrink-0 ml-4">
          <div>Fix applied</div>
          <div className="font-semibold text-gray-700 text-sm">{experiment.appliedDate}</div>
          <div className="mt-1">Based on {experiment.conversations.toLocaleString()} spans</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <LiftBadge label="Correctness" before={experiment.correctness.before} after={experiment.correctness.after} lift={experiment.correctness.lift} ci={experiment.correctness.ci} />
        <LiftBadge label="Escalation Acc." before={experiment.escalation.before} after={experiment.escalation.after} lift={experiment.escalation.lift} ci={experiment.escalation.ci} />
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
          <Line type="monotone" dataKey="correctness" name="Correctness" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="escalation" name="Escalation Acc." stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="correctnessBaseline" name="Correctness (no fix)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
          <Line type="monotone" dataKey="escalationBaseline" name="Escalation (no fix)" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-400 mt-3">
        Lift = rolling 7-day avg after fix vs. baseline before. Dashed lines show projected trend had the fix not been applied. ±CI = 95% confidence interval.
      </p>
    </div>
  );
}
