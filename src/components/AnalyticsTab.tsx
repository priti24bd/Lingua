import React from 'react';
import { UserProfile, ContactRecord, VocabularyWord } from '../types';
import { Clock, Video, Flame, Globe2 } from 'lucide-react';

interface AnalyticsTabProps {
  user: UserProfile;
  contacts: ContactRecord[];
  vocab: VocabularyWord[];
  onOpenPricing: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  user,
  contacts,
  vocab
}) => {
  const weeklyData = [
    { day: 'Mon', minutes: 20 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 40 },
    { day: 'Thu', minutes: 30 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 40 },
    { day: 'Today', minutes: user.sessionsCompletedToday * 10 }
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 50);

  // Unique countries met
  const uniqueCountries = Array.from(new Set(contacts.map((c) => c.partnerCountry)));
  const freeSessionsRemaining = Math.max(0, 15 - user.sessionsCompletedToday);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Summary of your total conversation minutes, completed sessions, and vocabulary.
          </p>
        </div>

        <div className="text-xs text-stone-700 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200">
          <span>Today: </span>
          <strong className="text-stone-900">{user.sessionsCompletedToday} of 15 free calls finished</strong>
          <span className="text-stone-500"> ({freeSessionsRemaining} left)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Sessions Finished
            </span>
            <Video className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {user.totalSessions}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {user.sessionsCompletedToday} completed today (10 minutes each)
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Minutes Spoken
            </span>
            <Clock className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {user.totalMinutes} min
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Total speaking time completed
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Daily Streak
            </span>
            <Flame className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {user.streakDays} Days
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Consecutive days of practice
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Countries Reached
            </span>
            <Globe2 className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-stone-900 tabular-nums">
              {uniqueCountries.length}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Partners from across the globe
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Minutes Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-stone-900">
              Weekly Speaking Minutes
            </h2>
            <p className="text-xs text-stone-500">
              Daily conversation minutes completed this week
            </p>
          </div>
          <span className="text-xs font-medium text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
            Total: {weeklyData.reduce((acc, c) => acc + c.minutes, 0)} min
          </span>
        </div>

        <div className="h-40 flex items-end gap-3 sm:gap-6 pt-4 border-b border-stone-200">
          {weeklyData.map((d, i) => {
            const heightPct = Math.max(12, Math.round((d.minutes / maxMinutes) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                  {d.minutes}m
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                    d.day === 'Today'
                      ? 'bg-amber-600'
                      : 'bg-stone-300'
                  }`}
                />
                <span className="text-xs text-stone-600 mt-2 font-medium">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Countries Met List */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <h2 className="text-sm font-bold text-stone-900 mb-1">
          Countries Met in Calls
        </h2>
        <p className="text-xs text-stone-500 mb-4">
          Nations represented in your interaction history.
        </p>

        <div className="flex flex-wrap gap-2">
          {uniqueCountries.map((c, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Vocabulary Archive */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <h2 className="text-sm font-bold text-stone-900 mb-1">
          Session Vocabulary Archive ({vocab.length})
        </h2>
        <p className="text-xs text-stone-500 mb-4">
          Words and phrases noted during conversations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {vocab.map((v) => (
            <div
              key={v.id}
              className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-bold text-stone-900">{v.word}</h3>
                <span className="text-[10px] text-stone-400">{v.date}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {v.meaning}
              </p>
              <p className="text-xs text-stone-500 italic">
                "{v.example}"
              </p>
              <div className="pt-1.5 border-t border-stone-200 text-[11px] text-stone-500">
                With {v.learnedWith}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
