import React, { useState } from 'react';
import { UserProfile, EnglishLevel } from '../types';
import { WORLD_COUNTRIES } from '../data/countries';
import { X, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (updatedUser: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [authMethod, setAuthMethod] = useState<'social' | 'email' | 'phone'>('signup' === authMode ? 'email' : 'social');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('CA');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('Intermediate');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const handleSocialAuth = (provider: string) => {
    let defaultCode = 'CA';
    let defaultCountry = 'Canada';
    if (provider === 'Apple') {
      defaultCode = 'US';
      defaultCountry = 'United States';
    }

    onAuthSuccess({
      name: name.trim() || `${provider} Member`,
      country: defaultCountry,
      countryCode: defaultCode,
      countryFlag: defaultCountry,
      isLoggedIn: true
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = WORLD_COUNTRIES.find((c) => c.code === countryCode);
    const countryName = matched ? matched.name : 'Global';

    onAuthSuccess({
      name: name.trim() || (email ? email.split('@')[0] : 'Member'),
      country: countryName,
      countryCode,
      countryFlag: countryName,
      nativeLanguage: nativeLanguage.trim() || 'English',
      englishLevel,
      isLoggedIn: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-bold text-sm mx-auto mb-2">
            LC
          </div>

          <h2 className="text-xl font-bold text-stone-900">
            {authMode === 'signup' ? 'Create Your Free Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            {authMode === 'signup'
              ? 'Join learners worldwide for 100% free daily 1-on-1 English calls.'
              : 'Sign in to continue your 1-on-1 conversations.'}
          </p>

          {/* Sign Up / Sign In Tab Toggle */}
          <div className="flex bg-stone-200/80 p-1 rounded-xl mt-4 max-w-xs mx-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                authMode === 'signup'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign Up (Free)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                authMode === 'signin'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Social Sign-in */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialAuth('Apple')}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium">or with email</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
              />
            </div>

            {authMode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Country
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-stone-900"
                    >
                      {WORLD_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
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
                      placeholder="e.g. Spanish, Hindi"
                      value={nativeLanguage}
                      onChange={(e) => setNativeLanguage(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    English Speaking Level
                  </label>
                  <select
                    value={englishLevel}
                    onChange={(e) => setEnglishLevel(e.target.value as EnglishLevel)}
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-stone-900"
                  >
                    <option value="Elementary">Elementary</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Upper-Intermediate">Upper-Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm mt-2"
            >
              {authMode === 'signup' ? 'Create Free Account & Start Speaking' : 'Sign In to LinguaConnect'}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[11px] text-stone-500">
              {authMode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-stone-900 font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New to LinguaConnect?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-stone-900 font-semibold hover:underline"
                  >
                    Create Free Account
                  </button>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
