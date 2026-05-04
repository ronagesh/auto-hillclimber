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

  function handleActivate(description: string, kpis: string) {
    setAgentLabel(extractAgentLabel(description));
    // Start the API call immediately, store promise for LoadingScreen to await
    profilePromiseRef.current = generateProfile(description, kpis).catch(() => {
      // Fallback to customer support profile if API call fails (e.g. no key set)
      return PROFILES[0];
    });
    setAppState('loading');
  }

  function handleLoadingComplete() {
    // Animation finished — now wait for the profile (usually already resolved)
    const promise = profilePromiseRef.current ?? Promise.resolve(PROFILES[0]);
    promise.then(profile => {
      setActiveProfile(profile);
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
