import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Partner,
  ConversationTopic,
  ContactRecord,
  VocabularyWord,
  PassType
} from './types';
import {
  getUser,
  saveUser,
  getContacts,
  saveContacts,
  getVocab,
  saveVocab,
  generateEncryptedHash
} from './utils/storage';
import { Header } from './components/Header';
import { HeroLobby } from './components/HeroLobby';
import { MatchingLobby } from './components/MatchingLobby';
import { VideoRoom } from './components/VideoRoom';
import { PostSessionModal } from './components/PostSessionModal';
import { HistoryDashboard } from './components/HistoryDashboard';
import { AnalyticsTab } from './components/AnalyticsTab';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { InstallModal } from './components/InstallModal';
import { DetectiveAlertModal } from './components/DetectiveAlertModal';
import { PayoutSettingsModal } from './components/PayoutSettingsModal';
import { WifiOff, ShieldCheck } from 'lucide-react';

export default function App() {
  // Primary States
  const [user, setUser] = useState<UserProfile>(getUser());
  const [contacts, setContacts] = useState<ContactRecord[]>(getContacts());
  const [vocab, setVocab] = useState<VocabularyWord[]>(getVocab());

  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<'lobby' | 'history' | 'analytics' | 'pricing'>('lobby');

  // Session Flow
  const [sessionFlow, setSessionFlow] = useState<'idle' | 'matching' | 'in_call' | 'post_call'>('idle');
  const [selectedTopic, setSelectedTopic] = useState<ConversationTopic | null>(null);
  const [activePartner, setActivePartner] = useState<Partner | null>(null);
  const [activeTopic, setActiveTopic] = useState<ConversationTopic | null>(null);
  const [directMatchedPartner, setDirectMatchedPartner] = useState<Partner | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string[]>([]);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState<number>(10);

  // Modals
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isPayoutsOpen, setIsPayoutsOpen] = useState(false);
  const [isPermanentlyBanned, setIsPermanentlyBanned] = useState(false);

  // Persist State Changes
  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    saveVocab(vocab);
  }, [vocab]);

  // Start Matching with Anyone Free
  const handleStartSpeaking = () => {
    const isPassActive = user.unlimitedPassExpiresAt && user.unlimitedPassExpiresAt > Date.now();
    const freeRemaining = Math.max(0, 15 - user.sessionsCompletedToday);

    if (!isPassActive && freeRemaining <= 0) {
      setIsPricingOpen(true);
      return;
    }

    setDirectMatchedPartner(null);
    setSessionFlow('matching');
  };

  // Connect Directly with Someone Free
  const handleConnectDirectWithPartner = (partner: Partner) => {
    const isPassActive = user.unlimitedPassExpiresAt && user.unlimitedPassExpiresAt > Date.now();
    const freeRemaining = Math.max(0, 15 - user.sessionsCompletedToday);

    if (!isPassActive && freeRemaining <= 0) {
      setIsPricingOpen(true);
      return;
    }

    setDirectMatchedPartner(partner);
    setSessionFlow('matching');
  };

  // Partner Found in Queue
  const handlePartnerFound = (partner: Partner, topic: ConversationTopic) => {
    setActivePartner(partner);
    setActiveTopic(topic);
    setSessionNotes([]);
    setSessionFlow('in_call');
  };

  // Session Finishes
  const handleEndCall = (notes: string[], durationMinutes: number) => {
    setSessionNotes(notes);
    setSessionDurationMinutes(durationMinutes);

    const updatedUser: UserProfile = {
      ...user,
      sessionsCompletedToday: user.sessionsCompletedToday + 1,
      totalSessions: user.totalSessions + 1,
      totalMinutes: user.totalMinutes + durationMinutes
    };
    setUser(updatedUser);

    setSessionFlow('post_call');
  };

  // Save Feedback & Compliments
  const handleSavePostSession = (data: {
    compliments: string[];
    notes: string[];
    isFavorite: boolean;
  }) => {
    if (activePartner && activeTopic) {
      const newContact: ContactRecord = {
        id: `cnt-${Date.now()}`,
        partnerId: activePartner.id,
        partnerName: activePartner.name,
        partnerAvatar: activePartner.avatar,
        partnerCountry: activePartner.country,
        partnerCode: activePartner.countryCode,
        partnerFlag: activePartner.country,
        partnerBio: activePartner.bio,
        partnerEnglishLevel: activePartner.englishLevel,
        topicTitle: activeTopic.title,
        sessionDate: new Date().toISOString(),
        durationMinutes: sessionDurationMinutes,
        notes: data.notes,
        complimentsReceived: ['Clear pronunciation', 'Friendly listener'],
        complimentsGiven: data.compliments,
        isFavorite: data.isFavorite,
        encryptedHash: generateEncryptedHash(activePartner.id + Date.now())
      };

      setContacts([newContact, ...contacts]);

      if (data.notes.length > 0) {
        const newVocabItems: VocabularyWord[] = data.notes.map((noteText, idx) => ({
          id: `voc-${Date.now()}-${idx}`,
          word: noteText.split(':')[0] || noteText.slice(0, 25),
          meaning: noteText.includes(':') ? noteText.split(':')[1].trim() : 'Word noted during call.',
          example: `Used in call with ${activePartner.name}`,
          learnedWith: `${activePartner.name} (${activePartner.country})`,
          date: new Date().toISOString().split('T')[0]
        }));
        setVocab([...newVocabItems, ...vocab]);
      }
    }

    setSessionFlow('idle');
    setActivePartner(null);
    setActiveTopic(null);
    setDirectMatchedPartner(null);
  };

  // Activate Unlimited Pass
  const handleActivatePass = (passType: PassType, days: number) => {
    const additionalMs = days * 24 * 60 * 60 * 1000;
    const currentExpiry =
      user.unlimitedPassExpiresAt && user.unlimitedPassExpiresAt > Date.now()
        ? user.unlimitedPassExpiresAt
        : Date.now();

    const updatedUser: UserProfile = {
      ...user,
      unlimitedPassExpiresAt: currentExpiry + additionalMs
    };
    setUser(updatedUser);
  };

  // Toggle Favorite
  const handleToggleFavorite = (contactId: string) => {
    setContacts(
      contacts.map((c) => (c.id === contactId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  // Toggle Offline Simulation Mode
  const handleToggleOfflineSimulation = () => {
    setUser({
      ...user,
      isOfflineMode: !user.isOfflineMode
    });
  };

  // Toggle Availability ("Free Now")
  const handleToggleUserAvailability = () => {
    setUser({
      ...user,
      isFreeNow: !user.isFreeNow
    });
  };

  // Permanent Ban Triggered
  const handleTriggerPermanentBan = () => {
    setIsPermanentlyBanned(true);
    setSessionFlow('idle');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Offline Mode Banner */}
      {user.isOfflineMode && (
        <div className="bg-stone-800 text-stone-200 text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline mode active: All interaction history and notes remain saved locally.</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'pricing') {
            setIsPricingOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onStartSession={handleStartSpeaking}
        onOpenInstall={() => setIsInstallOpen(true)}
        onOpenPayouts={() => setIsPayoutsOpen(true)}
      />

      {/* Main App Content */}
      <main className="flex-1">
        {currentTab === 'lobby' && (
          <HeroLobby
            user={user}
            selectedTopic={selectedTopic}
            onSelectTopic={(t) => setSelectedTopic(t)}
            onStartMatching={handleStartSpeaking}
            onConnectDirectWithPartner={handleConnectDirectWithPartner}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenInstall={() => setIsInstallOpen(true)}
            onToggleUserAvailability={handleToggleUserAvailability}
          />
        )}

        {currentTab === 'history' && (
          <HistoryDashboard
            contacts={contacts}
            onToggleFavorite={handleToggleFavorite}
            user={user}
            onToggleOfflineSimulation={handleToggleOfflineSimulation}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsTab
            user={user}
            contacts={contacts}
            vocab={vocab}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}
      </main>

      {/* Matching Queue Screen */}
      {sessionFlow === 'matching' && (
        <MatchingLobby
          user={user}
          selectedTopic={selectedTopic}
          directPartner={directMatchedPartner}
          onPartnerFound={handlePartnerFound}
          onCancel={() => setSessionFlow('idle')}
        />
      )}

      {/* 10-Minute Video Room */}
      {sessionFlow === 'in_call' && activePartner && activeTopic && (
        <div className="fixed inset-0 z-50 bg-stone-950">
          <VideoRoom
            partner={activePartner}
            topic={activeTopic}
            user={user}
            onEndSession={handleEndCall}
            onTriggerPermanentBan={handleTriggerPermanentBan}
          />
        </div>
      )}

      {/* Post-Session Feedback Modal */}
      {sessionFlow === 'post_call' && activePartner && activeTopic && (
        <PostSessionModal
          partner={activePartner}
          topicTitle={activeTopic.title}
          durationMinutes={sessionDurationMinutes}
          initialNotes={sessionNotes}
          onSaveAndClose={handleSavePostSession}
        />
      )}

      {/* Unlimited Passes Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={user}
        onActivatePass={handleActivatePass}
        onOpenPayouts={() => setIsPayoutsOpen(true)}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(updated) => setUser({ ...user, ...updated })}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSaveProfile={(updated) => setUser({ ...user, ...updated })}
      />

      {/* Payout & Revenue Settlement Modal */}
      <PayoutSettingsModal
        isOpen={isPayoutsOpen}
        onClose={() => setIsPayoutsOpen(false)}
      />

      {/* Install Modal */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      {/* Permanent Ban Modal */}
      {isPermanentlyBanned && (
        <DetectiveAlertModal
          stage="permanent_ban"
          onDismissWarning={() => {}}
          onRematchSession={() => {}}
          onAcknowledgeBan={() => setIsPermanentlyBanned(false)}
        />
      )}

      {/* Clean Human Footer */}
      <footer className="border-t border-stone-200 bg-white py-10 text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                  LC
                </div>
                <span className="text-base font-bold text-stone-900">
                  LinguaConnect
                </span>
              </div>
              <p className="text-xs text-stone-500 max-w-sm">
                One-on-one English speaking community. 15 free daily sessions of ten minutes each, with conversation questions and private room moderation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <button
                onClick={() => setCurrentTab('lobby')}
                className="hover:text-stone-900 transition-colors"
              >
                Practice Lobby
              </button>
              <button
                onClick={() => setCurrentTab('history')}
                className="hover:text-stone-900 transition-colors"
              >
                Interaction History
              </button>
              <button
                onClick={() => setCurrentTab('analytics')}
                className="hover:text-stone-900 transition-colors"
              >
                Performance Analytics
              </button>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="hover:text-stone-900 transition-colors"
              >
                Unlimited Passes
              </button>
              <button
                onClick={() => setIsPayoutsOpen(true)}
                className="hover:text-stone-900 font-semibold transition-colors"
              >
                Organizer Payouts
              </button>
              <button
                onClick={() => setIsInstallOpen(true)}
                className="hover:text-stone-900 transition-colors"
              >
                Install App
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>One-on-one private call moderation and client-side data encryption.</span>
            </div>
            <span>Global community. All 195+ countries worldwide.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
