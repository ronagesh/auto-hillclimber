import { useState } from 'react';

interface OnboardingProps {
  onActivate: (url: string) => void;
}

const EXAMPLES = ['intercom.com', 'harvey.ai', 'github.com', 'doordash.com'];

export function Onboarding({ onActivate }: OnboardingProps) {
  const [url, setUrl] = useState('');
  const [manual, setManual] = useState(false);
  const [description, setDescription] = useState('');
  const [kpis, setKpis] = useState('');

  const normalizeUrl = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  const ready = manual
    ? description.trim().length > 10 && kpis.trim().length > 5
    : url.trim().length > 3;

  function handleSubmit() {
    if (!ready) return;
    if (manual) {
      onActivate(`manual:${description}|||${kpis}`);
    } else {
      onActivate(normalizeUrl(url));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded bg-violet-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">AX</span>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-wide">ARIZE AUTOPILOT</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Put your agent on autopilot.</h1>
        <p className="text-base text-gray-500 mb-8">
          Enter your product URL. Arize will analyze what your agent does, surface production failures, and start improving your KPIs automatically.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {!manual ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your product website
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent">
                <span className="pl-3.5 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="yourcompany.com"
                  className="flex-1 text-sm px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe your agent</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. We run a customer support bot that handles billing, account setup, and technical issues for a SaaS product."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">What does success look like?</label>
                <textarea
                  value={kpis}
                  onChange={e => setKpis(e.target.value)}
                  rows={2}
                  placeholder="e.g. High deflection rate, high CSAT, low escalation rate."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
            </div>
          )}

          <button
            disabled={!ready}
            onClick={handleSubmit}
            className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
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

        {/* Examples + manual toggle */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Try:</span>
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => { setManual(false); setUrl(ex); }}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-violet-400 hover:text-violet-700 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
          <button
            onClick={() => setManual(m => !m)}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap ml-4"
          >
            {manual ? '← Use URL instead' : 'Describe manually'}
          </button>
        </div>
      </div>
    </div>
  );
}
