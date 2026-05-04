import { useEffect, useState } from 'react';

const STEPS = [
  'Analyzing agent description',
  'Clustering production failure patterns',
  'Configuring evaluators for your KPIs',
  'Ranking improvement opportunities by impact',
  'Estimating experiment baselines',
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    if (completedSteps >= STEPS.length) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
    const delay = completedSteps === 0 ? 600 : 700 + Math.random() * 400;
    const t = setTimeout(() => setCompletedSteps(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [completedSteps, onComplete]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded bg-violet-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">AX</span>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-wide">ARIZE AUTOPILOT</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">Setting up your autopilot...</h2>
        <p className="text-sm text-gray-500 mb-8">This only takes a moment.</p>

        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const done = i < completedSteps;
            const active = i === completedSteps;
            return (
              <div key={step} className="flex items-center gap-3">
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {done ? (
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : active ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                <span className={`text-sm transition-colors ${done ? 'text-gray-700' : active ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
