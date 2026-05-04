import { useState, useRef } from 'react';
import type { Tab, AgentProfile } from './types';
import { PROFILES } from './data/profiles';
import { generateProfile } from './lib/generateProfile';
import { Onboarding } from './components/Onboarding';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { HillclimbFeed } from './components/HillclimbFeed';
import { ImpactTracker } from './components/ImpactTracker';

type AppState = 'onboarding' | 'loading' | 'dashboard';

function extractAgentLabel(input: string): string {
  if (input.startsWith('manual:')) {
    const parts = input.slice('manual:'.length).split('|||');
    const url = parts[2]?.trim();
    if (url) {
      try {
        const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '');
        const name = hostname.split('.')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
      } catch { /* fall through */ }
    }
    const desc = parts[0].trim().replace(/\.$/, '');
    const words = desc.split(/\s+/);
    return words.length <= 6 ? desc : words.slice(0, 6).join(' ') + '...';
  }
  try { return new URL(input).hostname.replace('www.', ''); }
  catch { return input; }
}

function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeProfile, setActiveProfile] = useState<AgentProfile>(PROFILES[0]);
  const [agentLabel, setAgentLabel] = useState('');
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const profilePromiseRef = useRef<Promise<AgentProfile>>(Promise.resolve(PROFILES[0]));

  function handleActivate(input: string) {
    setAgentLabel(extractAgentLabel(input));
    profilePromiseRef.current = generateProfile(input).catch(() => PROFILES[0]);
    setAppState('loading');
  }

  function handleLoadingComplete(profile: AgentProfile) {
    setActiveProfile(profile ?? PROFILES[0]);
    setAppliedIds(new Set());
    setAppState('dashboard');
  }

  function handleReset() {
    setAppState('onboarding');
    setActiveTab('feed');
  }

  function handleApply(id: string) {
    setAppliedIds(prev => new Set([...prev, id]));
  }

  if (appState === 'onboarding') {
    return <Onboarding onActivate={handleActivate} />;
  }

  if (appState === 'loading') {
    return (
      <LoadingScreen
        profilePromise={profilePromiseRef.current}
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        agentLabel={agentLabel}
        onReset={handleReset}
      />
      {activeTab === 'feed' ? (
        <HillclimbFeed profile={activeProfile} appliedIds={appliedIds} onApply={handleApply} />
      ) : (
        <ImpactTracker profile={activeProfile} />
      )}
    </div>
  );
}

export default App;
