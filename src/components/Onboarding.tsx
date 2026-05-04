import { useState } from 'react';
import { inferFromUrl } from '../lib/generateProfile';

type Step =
  | { name: 'url' }
  | { name: 'analyzing' }
  | { name: 'review'; description: string; kpis: string };

interface OnboardingProps {
  onActivate: (input: string) => void;
}

const EXAMPLES = ['decagon.ai', 'intercom.com', 'harvey.ai', 'github.com'];

export function Onboarding({ onActivate }: OnboardingProps) {
  const [step, setStep] = useState<Step>({ name: 'url' });
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  async function handleAnalyze() {
    const normalized = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    setError('');
    setStep({ name: 'analyzing' });
    try {
      const { description, kpis } = await inferFromUrl(normalized);
      setStep({ name: 'review', description, kpis });
    } catch {
      setError('Could not analyze this URL. Try another or describe manually below.');
      setStep({ name: 'url' });
    }
  }

  function handleActivate(description: string, kpis: string) {
    onActivate(`manual:${description}|||${kpis}|||${url}`);
  }

  // ── URL entry ──────────────────────────────────────────────────────────────
  if (step.name === 'url') {
    return (
      <Shell>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Put your agent on autopilot.</h1>
        <p className="text-base text-gray-500 mb-8">
          Enter your product URL. Arize HillClimber will analyze what your agent does, surface production failures, and start improving your KPIs automatically.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your product website</label>
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
              onKeyDown={e => e.key === 'Enter' && url.trim().length > 3 && handleAnalyze()}
              placeholder="yourcompany.com"
              className="flex-1 text-sm px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <button
            disabled={url.trim().length <= 3}
            onClick={handleAnalyze}
            className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              url.trim().length > 3
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Analyze
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400">Try:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setUrl(ex)}
              className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-violet-400 hover:text-violet-700 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  // ── Analyzing ──────────────────────────────────────────────────────────────
  if (step.name === 'analyzing') {
    return (
      <Shell>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">Analyzing {url}</p>
            <p className="text-xs text-gray-400 mt-1">Identifying your agent type and KPIs...</p>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Review & edit ──────────────────────────────────────────────────────────
  const { description, kpis } = step;
  return (
    <ReviewForm
      description={description}
      kpis={kpis}
      url={url}
      onBack={() => setStep({ name: 'url' })}
      onActivate={handleActivate}
    />
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-10">
          <img src="https://avatars.githubusercontent.com/u/71517989" alt="Arize" className="w-7 h-7 rounded" />
          <span className="font-bold text-gray-900 text-base tracking-wide">ARIZE HILLCLIMBER</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function ReviewForm({
  description: initialDescription,
  kpis: initialKpis,
  url,
  onBack,
  onActivate,
}: {
  description: string;
  kpis: string;
  url: string;
  onBack: () => void;
  onActivate: (description: string, kpis: string) => void;
}) {
  const [description, setDescription] = useState(initialDescription);
  const [kpis, setKpis] = useState(initialKpis);
  const ready = description.trim().length > 10 && kpis.trim().length > 5;

  let domain = url;
  try { domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', ''); } catch { /* noop */ }

  return (
    <Shell>
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {domain}
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Does this look right?</h1>
      <p className="text-sm text-gray-500 mb-6">
        Arize inferred your agent from <span className="font-medium text-gray-700">{domain}</span>. Edit if anything looks off.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            What your agent does
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            KPIs that matter
          </label>
          <textarea
            value={kpis}
            onChange={e => setKpis(e.target.value)}
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
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
    </Shell>
  );
}
