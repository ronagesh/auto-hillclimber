import { useState } from 'react';
import type { Tab, AgentProfile } from './types';
import { PROFILES } from './data/profiles';
import { Header } from './components/Header';
import { HillclimbFeed } from './components/HillclimbFeed';
import { ImpactTracker } from './components/ImpactTracker';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeProfile, setActiveProfile] = useState<AgentProfile>(PROFILES[0]);

  function handleRunExperiment(_id: string) {
    setActiveTab('impact');
  }

  function handleProfileChange(id: string) {
    const profile = PROFILES.find(p => p.id === id);
    if (profile) setActiveProfile(profile);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeProfile={activeProfile}
        onProfileChange={handleProfileChange}
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
