import { useState } from 'react';
import type { Tab, AgentProfile } from './types';
import { PROFILES } from './data/profiles';
import { Onboarding } from './components/Onboarding';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { HillclimbFeed } from './components/HillclimbFeed';
import { ImpactTracker } from './components/ImpactTracker';

type AppState = 'onboarding' | 'loading' | 'dashboard';

function inferProfile(description: string, kpis: string): AgentProfile {
  const text = (description + ' ' + kpis).toLowerCase();
  if (text.match(/code|review|pull request|bug|security|developer|pr\b/)) return PROFILES[2];
  if (text.match(/legal|contract|compliance|citation|statute|attorney|case law/)) return PROFILES[1];
  return PROFILES[0];
}

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

  function handleActivate(description: string, kpis: string) {
    const profile = inferProfile(description, kpis);
    setActiveProfile(profile);
    setAgentLabel(extractAgentLabel(description));
    setAppState('loading');
  }

  function handleLoadingComplete() {
    setAppState('dashboard');
  }

  function handleReset() {
    setAppState('onboarding');
    setActiveTab('feed');
  }

  function handleRunExperiment(_id: string) {
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
        <HillclimbFeed profile={activeProfile} onRunExperiment={handleRunExperiment} />
      ) : (
        <ImpactTracker profile={activeProfile} />
      )}
    </div>
  );
}

export default App;
