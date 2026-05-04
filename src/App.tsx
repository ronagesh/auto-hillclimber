import { useState } from 'react';
import type { Tab } from './types';
import { Header } from './components/Header';
import { HillclimbFeed } from './components/HillclimbFeed';
import { ImpactTracker } from './components/ImpactTracker';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');

  function handleRunExperiment(_id: string) {
    setActiveTab('impact');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'feed' ? (
        <HillclimbFeed onRunExperiment={handleRunExperiment} />
      ) : (
        <ImpactTracker />
      )}
    </div>
  );
}

export default App;
