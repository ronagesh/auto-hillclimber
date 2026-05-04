import { useEffect, useRef, useState } from 'react';
import type { AgentProfile } from '../types';

const TIMED_STEPS = [
  'Analyzing your product',
  'Clustering production failure patterns',
  'Configuring evaluators for your KPIs',
  'Ranking improvement opportunities by impact',
];

const FINAL_STEP = 'Generating your dashboard';

interface LoadingScreenProps {
  profilePromise: Promise<AgentProfile>;
  onComplete: (profile: AgentProfile) => void;
}

export function LoadingScreen({ profilePromise, onComplete }: LoadingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [finalDone, setFinalDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Tick through the timed steps
  useEffect(() => {
    if (completedSteps >= TIMED_STEPS.length) return;
    const delay = completedSteps === 0 ? 500 : 600 + Math.random() * 400;
    const t = setTimeout(() => setCompletedSteps(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [completedSteps]);

  // Wait for the API promise for the final step
  useEffect(() => {
    profilePromise.then(profile => {
      setFinalDone(true);
      setTimeout(() => onCompleteRef.current(profile), 600);
    }).catch(() => {
      setFinalDone(true);
      setTimeout(() => onCompleteRef.current(null as unknown as AgentProfile), 600);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allTimedDone = completedSteps >= TIMED_STEPS.length;
  const steps = [...TIMED_STEPS, FINAL_STEP];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-10">
          <img src="https://arize.com/wp-content/uploads/2021/10/logo2.svg" alt="Arize" className="h-5" />
          <span className="font-bold text-gray-900 text-base tracking-wide">HILLCLIMBER</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">Setting up your HillClimber...</h2>
        <p className="text-sm text-gray-500 mb-8">This only takes a moment.</p>

        <div className="flex flex-col gap-3">
          {steps.map((step, i) => {
            const isFinal = i === steps.length - 1;
            const done = isFinal ? finalDone : i < completedSteps;
            const active = isFinal ? (allTimedDone && !finalDone) : i === completedSteps;

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
                <span className={`text-sm transition-colors ${
                  done ? 'text-gray-700' : active ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}>
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
