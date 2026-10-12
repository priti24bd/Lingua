import React, { useState, useEffect } from 'react';
import { Partner, ConversationTopic, UserProfile } from '../types';
import { MOCK_PARTNERS } from '../data/mockPartners';
import { CONVERSATION_TOPICS } from '../data/topics';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface MatchingLobbyProps {
  user: UserProfile;
  selectedTopic: ConversationTopic | null;
  directPartner?: Partner | null;
  onPartnerFound: (partner: Partner, topic: ConversationTopic) => void;
  onCancel: () => void;
}

export const MatchingLobby: React.FC<MatchingLobbyProps> = ({
  user,
  selectedTopic,
  directPartner,
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

    // Fast 1.5 second matching
    const matchTimer = setTimeout(() => {
      setMatchedPartner(chosenPartner);
      setMatchStep('found');
    }, 1500);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {matchStep === 'searching' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-sm font-bold text-stone-800">
              LC
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Connecting with a Free Partner
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Looking for learners who are available right now. Topic: {activeTopic.title}.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-1 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-700" />
                <span>Checking camera connection and one-on-one room</span>
              </div>
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
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
              Partner Available
            </span>

            {/* Found Partner Profile Card */}
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
              <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border border-stone-300 shadow-sm">
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
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
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
