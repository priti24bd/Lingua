import React from 'react';
import { UserProfile, ConversationTopic, Partner } from '../types';
import { CONVERSATION_TOPICS } from '../data/topics';
import { MOCK_PARTNERS } from '../data/mockPartners';
import { Video, ShieldCheck, ArrowRight, UserPlus, Clock } from 'lucide-react';

interface HeroLobbyProps {
  user: UserProfile;
  selectedTopic: ConversationTopic | null;
  onSelectTopic: (topic: ConversationTopic | null) => void;
  onStartMatching: () => void;
  onConnectDirectWithPartner: (partner: Partner) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onToggleUserAvailability: () => void;
}

export const HeroLobby: React.FC<HeroLobbyProps> = ({
  user,
  selectedTopic,
  onSelectTopic,
  onStartMatching,
  onConnectDirectWithPartner,
  onOpenAuth,
  onOpenProfile,
  onToggleUserAvailability
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Main Hero Section */}
      <section className="bg-stone-100/70 border-b border-stone-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/80 text-stone-800 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                <span>100% Free 1-on-1 English Conversation</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
                Practice conversational English with people worldwide.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                Every session is a private 10-minute video call. Speak with real global learners, or practice immediately with a warm, lifelike conversational partner who laughs, listens, and engages naturally for the full ten minutes.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={onStartMatching}
                    className="px-7 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start 1-on-1 Call (Free)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {!user.isLoggedIn ? (
                    <button
                      onClick={onOpenAuth}
                      className="px-5 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4 text-stone-600" />
                      <span>Create Free Account</span>
                    </button>
                  ) : (
                    <button
                      onClick={onOpenProfile}
                      className="px-5 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
                    >
                      Your Profile ({user.country})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1 text-stone-700 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-600" />
                    <span>10-Minute Focused Calls</span>
                  </span>
                  <span>·</span>
                  <span>100% Free for all global members</span>
                </div>
              </div>

              {/* User Availability Status Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onToggleUserAvailability}
                  className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    user.isFreeNow
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.isFreeNow ? 'bg-emerald-600' : 'bg-stone-400'
                    }`}
                  />
                  <span>
                    {user.isFreeNow
                      ? 'You are marked free to talk right now'
                      : 'You are marked busy (click to mark free)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: People Free to Talk Right Now */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h2 className="text-sm font-bold text-stone-900">
                      Free to Talk Right Now
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      Available online now. Click to join together directly.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Online
                  </span>
                </div>

                {/* Available Partners List */}
                <div className="space-y-2.5">
                  {MOCK_PARTNERS.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between gap-3 p-2.5 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-100 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={partner.avatar}
                            alt={partner.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-stone-900 block truncate">
                            {partner.name}
                          </span>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {partner.country} · {partner.englishLevel}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onConnectDirectWithPartner(partner)}
                        className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                      >
                        Talk Now
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-stone-500 pt-1 text-center">
                  Anyone who joins when free gets connected into a 1-on-1 ten minute room.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversation Topics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Select a Conversation Topic
            </h2>
            <p className="text-xs text-stone-600">
              Pick a topic or connect with an open topic.
            </p>
          </div>

          <button
            onClick={() => onSelectTopic(null)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              selectedTopic === null
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Any Topic (Default)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CONVERSATION_TOPICS.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/40 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                    {topic.category}
                  </span>
                  <h3 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2">
                    {topic.prompts[0]}
                  </p>
                </div>

                <div className="pt-2 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">3 questions</span>
                  <span className={`font-semibold ${isSelected ? 'text-amber-800' : 'text-stone-600'}`}>
                    {isSelected ? 'Selected' : 'Choose'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 1-on-1 Moderation Guidelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>1-on-1 Call Guidelines</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Strict one-on-one conversations. Safe for all international learners.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-stone-300 leading-relaxed">
            <div className="bg-stone-800 p-4 rounded-xl space-y-1.5 border border-stone-700">
              <strong className="text-white block text-sm">
                1. Single Person on Camera
              </strong>
              <p>
                If more than one person is detected in frame or in a noisy public space, the system issues a notice to move to a private room.
              </p>
            </div>

            <div className="bg-stone-800 p-4 rounded-xl space-y-1.5 border border-stone-700">
              <strong className="text-white block text-sm">
                2. Respectful Conduct
              </strong>
              <p>
                Harsh or abusive language, harassment, or inappropriate bodily exposure results in immediate, permanent account ban.
              </p>
            </div>

            <div className="bg-stone-800 p-4 rounded-xl space-y-1.5 border border-stone-700">
              <strong className="text-white block text-sm">
                3. Global Community
              </strong>
              <p>
                Learners from all 195+ countries worldwide join to practice daily English conversation in a friendly and respectful space.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
