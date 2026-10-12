import React, { useState } from 'react';
import { UserProfile, EnglishLevel } from '../types';
import { WORLD_COUNTRIES } from '../data/countries';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (updatedUser: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMethod, setAuthMethod] = useState<'social' | 'email' | 'phone'>('social');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = (provider: string) => {
    let defaultCode = 'CA';
    let defaultCountry = 'Canada';
    if (provider === 'Apple') {
      defaultCode = 'US';
      defaultCountry = 'United States';
    } else if (provider === 'LinkedIn') {
      defaultCode = 'DE';
      defaultCountry = 'Germany';
    }

    onLoginSuccess({
      name: name.trim() || `${provider} Member`,
      country: defaultCountry,
      countryCode: defaultCode,
      countryFlag: defaultCountry
    });
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const inferredName = email.split('@')[0];
    onLoginSuccess({
      name: name.trim() || (inferredName.charAt(0).toUpperCase() + inferredName.slice(1)),
      country: 'Member',
      countryCode: 'US',
      countryFlag: 'Global'
    });
    onClose();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    const matched = WORLD_COUNTRIES.find((c) => c.dialCode === phonePrefix);
    onLoginSuccess({
      name: name.trim() || `User (${phonePrefix})`,
      country: matched ? matched.name : 'Global',
      countryCode: matched ? matched.code : 'GL',
      countryFlag: matched ? matched.name : 'Global'
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
          <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg mx-auto mb-2">
            LC
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Sign In to LinguaConnect
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Free daily English conversation with learners worldwide.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Method Selector */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setAuthMethod('social')}
              className={`py-1.5 rounded-lg transition-colors ${
                authMethod === 'social' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
              }`}
            >
              Google / Apple
            </button>
            <button
              onClick={() => setAuthMethod('email')}
              className={`py-1.5 rounded-lg transition-colors ${
                authMethod === 'email' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setAuthMethod('phone')}
              className={`py-1.5 rounded-lg transition-colors ${
                authMethod === 'phone' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'text-stone-600'
              }`}
            >
              Phone Number
            </button>
          </div>

          {/* Social Provider Buttons */}
          {authMethod === 'social' && (
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <span>Continue with Apple ID</span>
              </button>

              <button
                onClick={() => handleSocialLogin('LinkedIn')}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors"
              >
                <span>Continue with LinkedIn</span>
              </button>
            </div>
          )}

          {/* Email Login Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                />
              </div>

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

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm mt-2"
              >
                Sign In with Email
              </button>
            </form>
          )}

          {/* Phone Login Form with Worldwide Country Codes */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (Worldwide)
                </label>
                <div className="flex gap-2">
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="text-xs border border-stone-200 rounded-xl px-2 py-2.5 bg-white focus:outline-none focus:border-stone-900 max-w-[140px]"
                  >
                    {WORLD_COUNTRIES.map((c) => (
                      <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                        {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 text-xs border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm mt-2"
              >
                Sign In with Phone
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
