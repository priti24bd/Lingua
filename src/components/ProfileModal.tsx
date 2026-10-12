import React, { useState } from 'react';
import { UserProfile, EnglishLevel } from '../types';
import { WORLD_COUNTRIES } from '../data/countries';
import { X, Check } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

const ENGLISH_LEVELS: EnglishLevel[] = [
  'Elementary',
  'Intermediate',
  'Upper-Intermediate',
  'Advanced',
  'Fluent'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile
}) => {
  const [name, setName] = useState(user.name);
  const [countryCode, setCountryCode] = useState(user.countryCode || 'CA');
  const [bio, setBio] = useState(user.bio);
  const [nativeLanguage, setNativeLanguage] = useState(user.nativeLanguage);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>(user.englishLevel);
  const [isFreeNow, setIsFreeNow] = useState<boolean>(user.isFreeNow ?? true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = WORLD_COUNTRIES.find((c) => c.code === countryCode);
    const countryName = matched ? matched.name : user.country;
    onSaveProfile({
      name: name.trim() || user.name,
      country: countryName,
      countryCode,
      countryFlag: countryName,
      bio: bio.trim() || user.bio,
      nativeLanguage: nativeLanguage.trim() || user.nativeLanguage,
      englishLevel,
      isFreeNow
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Your Profile</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Shown to your 1-on-1 speaking partner during calls.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Country (Worldwide)
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-stone-900"
              >
                {WORLD_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mother Tongue
              </label>
              <input
                type="text"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                placeholder="e.g. Spanish, Bengali, French"
                className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              English Speaking Level
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ENGLISH_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnglishLevel(lvl)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                    englishLevel === lvl
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Short Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell partners a little about yourself and what you enjoy discussing."
              className="w-full text-xs border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Availability Status */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-900 block">
                Free to Talk Right Now
              </span>
              <span className="text-[11px] text-stone-500">
                Shows you as available to connect in the lobby
              </span>
            </div>
            <input
              type="checkbox"
              checked={isFreeNow}
              onChange={(e) => setIsFreeNow(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
