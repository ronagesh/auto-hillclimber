import type { Tab, AgentProfile } from '../types';
import { PROFILES } from '../data/profiles';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  activeProfile: AgentProfile;
  onProfileChange: (id: string) => void;
}

export function Header({ activeTab, onTabChange, activeProfile, onProfileChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <select
            value={activeProfile.id}
            onChange={e => onProfileChange(e.target.value)}
            className="text-sm text-gray-500 font-medium bg-transparent border-none focus:outline-none cursor-pointer pr-1"
          >
            {PROFILES.map(p => (
              <option key={p.id} value={p.id}>{p.projectName}</option>
            ))}
          </select>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">AX</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-wide">ARIZE</span>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('feed')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'feed' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Autopilot
          </button>
          <button
            onClick={() => onTabChange('impact')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'impact' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Impact Tracker
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-full font-medium">
          {activeProfile.agentType}
        </span>
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold">
          R
        </div>
      </div>
    </header>
  );
}
