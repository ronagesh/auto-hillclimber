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

function extractAgentLabel(description: string): string {
  const clean = description.trim().replace(/\.$/, '');
  const words = clean.split(/\s+/);
  if (words.length <= 6) return clean;
  return words.slice(0, 6).join(' ') + '...';
}

function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeProfile, setActiveProfile] = useState<AgentProfile>(PROFILES[0]);
  const [agentLabel, setAgentLabel] = useState('');

  // Holds the in-flight profile promise so the loading screen can await it
  const profilePromiseRef = useRef<Promise<AgentProfile> | null>(null);

  function handleActivate(input: string) {
    // Derive a display label from the input
    if (input.startsWith('manual:')) {
      const desc = input.slice('manual:'.length).split('|||')[0];
      setAgentLabel(extractAgentLabel(desc));
    } else {
      // Show the domain as the label while loading
      try { setAgentLabel(new URL(input).hostname.replace('www.', '')); }
      catch { setAgentLabel(input); }
    }
    profilePromiseRef.current = generateProfile(input).catch(() => PROFILES[0]);
    setAppState('loading');
  }

  function handleLoadingComplete() {
    const promise = profilePromiseRef.current ?? Promise.resolve(PROFILES[0]);
    promise
      .then(profile => {
        setActiveProfile(profile);
        setAppState('dashboard');
      })
      .catch(() => {
        setActiveProfile(PROFILES[0]);
        setAppState('dashboard');
      });
  }

  function handleReset() {
    setAppState('onboarding');
    setActiveTab('feed');
  }

  function handleApply(_id: string) {
    setActiveTab('impact');
  }

  if (appState === 'onboarding') {
    return <Onboarding onActivate={handleActivate} />;
  }

  if (appState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
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
        <HillclimbFeed profile={activeProfile} onApply={handleApply} />
      ) : (
        <ImpactTracker profile={activeProfile} />
      )}
    </div>
  );
}

export default App;
