import { useState } from 'react';

interface OnboardingProps {
  onActivate: (description: string, kpis: string) => void;
}

const EXAMPLES = [
  {
    label: 'Customer support',
    description: 'We run a customer-facing support bot that handles billing questions, account setup, and technical troubleshooting.',
    kpis: 'High first-contact resolution without human escalation. Accurate policy responses. Fast, empathetic replies.',
  },
  {
    label: 'Code review',
    description: 'An AI code reviewer that analyzes pull requests for bugs, security issues, and style violations.',
    kpis: 'Correct bug detection with low false-positive rate. Security vulnerabilities caught before merge.',
  },
  {
    label: 'Legal research',
    description: 'A legal research assistant that synthesizes case law, statutes, and contracts for attorneys.',
    kpis: 'Accurate citation of precedent. No hallucinated statutes or policy details. Concise, actionable summaries.',
  },
  {
    label: 'Sales assistant',
    description: 'An AI sales development rep that qualifies inbound leads and books discovery calls.',
    kpis: 'High meeting-booked rate. Accurate qualification against ICP criteria. Personalized outreach quality.',
  },
];

export function Onboarding({ onActivate }: OnboardingProps) {
  const [description, setDescription] = useState('');
  const [kpis, setKpis] = useState('');

  function handleExample(ex: typeof EXAMPLES[0]) {
    setDescription(ex.description);
    setKpis(ex.kpis);
  }

  const ready = description.trim().length > 10 && kpis.trim().length > 5;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded bg-violet-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">AX</span>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-wide">ARIZE AUTOPILOT</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Put your agent on autopilot.
        </h1>
        <p className="text-base text-gray-500 mb-8">
          Describe your agent and what matters to you. Arize will automatically surface improvement opportunities and run experiments to move your KPIs.
        </p>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Describe your agent
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. We run a customer support bot that handles billing, account setup, and technical issues for a SaaS product with 50k users."
              className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What does success look like?
            </label>
            <textarea
              value={kpis}
              onChange={e => setKpis(e.target.value)}
              rows={3}
              placeholder="e.g. High first-contact resolution rate, low escalation to human agents, accurate policy responses, no hallucinated refund policies."
              className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            disabled={!ready}
            onClick={() => onActivate(description, kpis)}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              ready
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Activate Autopilot
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Examples */}
        <div className="mt-6">
          <p className="text-xs text-gray-400 mb-2.5">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex.label}
                onClick={() => handleExample(ex)}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-violet-400 hover:text-violet-700 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
