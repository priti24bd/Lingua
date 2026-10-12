import React from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, User, LogIn } from 'lucide-react';

interface HeaderProps {
  currentTab: 'lobby' | 'history' | 'analytics';
  onSelectTab: (tab: 'lobby' | 'history' | 'analytics') => void;
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onStartSession: () => void;
  onOpenInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenProfile,
  onOpenAuth,
  onStartSession,
  onOpenInstall
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('lobby')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                LC
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap">
                LinguaConnect
              </span>
            </button>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 pl-3 border-l border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>100% Free 1-on-1 English</span>
            </div>
          </div>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => onSelectTab('lobby')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                currentTab === 'lobby'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : ''
              }`}
            >
              Practice Lobby
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                currentTab === 'history'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : ''
              }`}
            >
              Interaction History
            </button>
            <button
              onClick={() => onSelectTab('analytics')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                currentTab === 'analytics'
                  ? 'text-stone-900 border-b-2 border-stone-900 font-semibold'
                  : ''
              }`}
            >
              Performance Analytics
            </button>
            <button
              onClick={onOpenInstall}
              className="text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-xs"
            >
              Install App
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {user.isLoggedIn ? (
              <button
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                title="Your Profile"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold text-stone-900">{user.name}</span>
                <span className="text-[11px] text-stone-500">[{user.countryCode}]</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign Up / Sign In</span>
              </button>
            )}

            <button
              onClick={onStartSession}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Start 10m Call</span>
              <span className="opacity-80 text-xs font-normal">(Free)</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-100 text-xs font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('lobby')}
            className={`py-1 px-2 ${currentTab === 'lobby' ? 'text-amber-700 font-bold' : ''}`}
          >
            Lobby
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`py-1 px-2 ${currentTab === 'history' ? 'text-amber-700 font-bold' : ''}`}
          >
            History
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`py-1 px-2 ${currentTab === 'analytics' ? 'text-amber-700 font-bold' : ''}`}
          >
            Analytics
          </button>
          <button
            onClick={user.isLoggedIn ? onOpenProfile : onOpenAuth}
            className="py-1 px-2 text-stone-700 font-medium"
          >
            {user.isLoggedIn ? 'Profile' : 'Sign Up'}
          </button>
        </div>
      </div>
    </header>
  );
};
