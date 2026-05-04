import type { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium">helios-support-agent</span>
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
              activeTab === 'feed'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Autopilot
          </button>
          <button
            onClick={() => onTabChange('impact')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'impact'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Impact Tracker
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Helios AI Trial</span>
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold">
          R
        </div>
      </div>
    </header>
  );
}
