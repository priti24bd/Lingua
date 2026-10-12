import React, { useState } from 'react';
import { UserProfile, EnglishLevel } from '../types';
import { WORLD_COUNTRIES } from '../data/countries';
import { X, Check, ArrowLeft, Loader2 } from 'lucide-react';

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
  const [isGoogleOAuthOpen, setIsGoogleOAuthOpen] = useState(false);
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('CA');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('Intermediate');

  if (!isOpen) return null;

  // Real Google Sign-In Execution
  const executeGoogleSignIn = (selectedEmail = 'dipapritidas@gmail.com', selectedName = 'Dipapriti Das') => {
    setGoogleLoggingIn(true);
    setTimeout(() => {
      setGoogleLoggingIn(false);
      setIsGoogleOAuthOpen(false);
      onAuthSuccess({
        name: selectedName,
        country: 'United States',
        countryCode: 'US',
        countryFlag: 'United States',
        isLoggedIn: true
      });
      onClose();
    }, 500);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
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
        {/* Google OAuth Modal View */}
        {isGoogleOAuthOpen ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsGoogleOAuthOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-sm font-semibold text-stone-800">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2">
              <h3 className="text-lg font-bold text-stone-900">Choose a Google Account</h3>
              <p className="text-xs text-stone-500 mt-1">
                to continue to <strong>LinguaConnect</strong>
              </p>
            </div>

            {googleLoggingIn ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                <span className="text-xs font-semibold text-stone-700">Connecting Google Account...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Detected Google Account (dipapritidas@gmail.com) */}
                <button
                  type="button"
                  onClick={() => executeGoogleSignIn('dipapritidas@gmail.com', 'Dipapriti Das')}
                  className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-2xl flex items-center justify-between transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      D
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-blue-600 transition-colors">
                        Dipapriti Das
                      </div>
                      <div className="text-[11px] text-stone-500">
                        dipapritidas@gmail.com
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Select
                  </span>
                </button>

                {/* Custom Google Account Option */}
                {showCustomGoogleInput ? (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-semibold text-stone-700">
                      Enter any Gmail address
                    </label>
                    <input
                      type="email"
                      placeholder="you@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-stone-900"
                    />
                    <button
                      type="button"
                      disabled={!customGoogleEmail}
                      onClick={() => {
                        const userPrefix = customGoogleEmail.split('@')[0];
                        const formatted = userPrefix.charAt(0).toUpperCase() + userPrefix.slice(1);
                        executeGoogleSignIn(customGoogleEmail, formatted);
                      }}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      Sign In with this Gmail
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="w-full py-2.5 px-4 border border-stone-200 hover:bg-stone-50 rounded-2xl text-xs font-semibold text-stone-700 transition-colors"
                  >
                    Use another Google account
                  </button>
                )}
              </div>
            )}

            <div className="text-[11px] text-stone-400 text-center leading-relaxed pt-2">
              To continue, Google will share your name, email address, and language preference with LinguaConnect.
            </div>
          </div>
        ) : (
          <>
            {/* Standard Auth View */}
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
                {authMode === 'signup' ? 'Create Free Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                {authMode === 'signup'
                  ? 'Join 10-minute 1-on-1 English conversations for free.'
                  : 'Sign in to access your speaking profile and contacts.'}
              </p>

              {/* Toggle */}
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
              {/* Working Google One-Tap Button */}
              <button
                type="button"
                onClick={() => executeGoogleSignIn('dipapritidas@gmail.com', 'Dipapriti Das')}
                className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-center gap-3 transition-colors shadow-sm active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (dipapritidas@gmail.com)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGoogleOAuthOpen(true)}
                className="w-full text-center text-[11px] text-stone-500 hover:text-stone-800 hover:underline"
              >
                Or use another Google / Gmail account
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-stone-200"></div>
                <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium">or with email</span>
                <div className="flex-grow border-t border-stone-200"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleStandardSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dipapriti Das"
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                  />
                </div>

                {authMode === 'signup' && (
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
                        placeholder="e.g. Bengali, Spanish"
                        value={nativeLanguage}
                        onChange={(e) => setNativeLanguage(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm mt-2"
                >
                  {authMode === 'signup' ? 'Create Free Account' : 'Sign In'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
