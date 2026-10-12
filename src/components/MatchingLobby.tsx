import React, { useState, useEffect } from 'react';
import { Partner, ConversationTopic, UserProfile } from '../types';
import { MOCK_PARTNERS } from '../data/mockPartners';
import { CONVERSATION_TOPICS } from '../data/topics';
import { ShieldCheck, ArrowRight, Copy, Check, Users, Smartphone } from 'lucide-react';

interface MatchingLobbyProps {
  user: UserProfile;
  selectedTopic: ConversationTopic | null;
  directPartner?: Partner | null;
  roomId?: string;
  onPartnerFound: (partner: Partner, topic: ConversationTopic) => void;
  onCancel: () => void;
}

export const MatchingLobby: React.FC<MatchingLobbyProps> = ({
  user,
  selectedTopic,
  directPartner,
  roomId = 'LC-ROOM-701',
  onPartnerFound,
  onCancel
}) => {
  const [matchStep, setMatchStep] = useState<'searching' | 'found'>(
    directPartner ? 'found' : 'searching'
  );
  const [matchedPartner, setMatchedPartner] = useState<Partner | null>(
    directPartner || null
  );
  const [activeTopic, setActiveTopic] = useState<ConversationTopic>(
    selectedTopic || CONVERSATION_TOPICS[0]
  );
  const [countdown, setCountdown] = useState<number>(3);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const directJoinUrl = `${window.location.origin}?room=${roomId}`;

  useEffect(() => {
    if (directPartner) {
      setMatchedPartner(directPartner);
      setMatchStep('found');
      return;
    }

    const availablePartners = MOCK_PARTNERS.filter((p) => p.isOnlineNow);
    const chosenPartner =
      availablePartners[Math.floor(Math.random() * availablePartners.length)] ||
      MOCK_PARTNERS[0];
    const chosenTopic =
      selectedTopic ||
      CONVERSATION_TOPICS[Math.floor(Math.random() * CONVERSATION_TOPICS.length)];

    setActiveTopic(chosenTopic);

    // Fast matching so user is never stuck
    const matchTimer = setTimeout(() => {
      setMatchedPartner(chosenPartner);
      setMatchStep('found');
    }, 2000);

    return () => clearTimeout(matchTimer);
  }, [selectedTopic, directPartner]);

  // Countdown when partner found
  useEffect(() => {
    if (matchStep === 'found' && matchedPartner) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onPartnerFound(matchedPartner, activeTopic);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [matchStep, matchedPartner, activeTopic, onPartnerFound]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directJoinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {matchStep === 'searching' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto text-base font-bold shadow-md">
              LC
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Connecting with a Speaking Partner
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Matching available learners. Topic: <strong>{activeTopic.title}</strong>
              </p>
            </div>

            {/* Test on 2 devices banner */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-stone-600" />
                  <span>Connect a Real Person or Test on Phone:</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Direct Link'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Open this copied link on your mobile phone or send to a friend to jump into the same live video call!
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
              <span>Camera check: One-on-one private call rules active</span>
            </div>

            <button
              onClick={onCancel}
              className="py-2.5 px-6 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {matchStep === 'found' && matchedPartner && (
          <div className="p-8 text-center space-y-5">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Partner Ready & Verified
            </span>

            {/* Found Partner Profile Card */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-stone-300 shadow-md">
                <img
                  src={matchedPartner.avatar}
                  alt={matchedPartner.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {matchedPartner.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {matchedPartner.country} · {matchedPartner.englishLevel} · Native: {matchedPartner.nativeLanguage}
                </p>
              </div>

              <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-100 text-left">
                "{matchedPartner.bio}"
              </p>

              <div className="text-xs text-left bg-stone-100 p-3 rounded-xl text-stone-800">
                <strong className="block text-stone-900 mb-0.5">Topic:</strong>
                <span>{activeTopic.title}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => onPartnerFound(matchedPartner, activeTopic)}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enter Call ({countdown}s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCancel}
                className="text-xs text-stone-500 hover:text-stone-800 block mx-auto pt-1"
              >
                Cancel and Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
