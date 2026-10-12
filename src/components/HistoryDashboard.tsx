import React, { useState, useMemo } from 'react';
import { ContactRecord, UserProfile } from '../types';
import { WORLD_COUNTRIES } from '../data/countries';
import {
  Search,
  Lock,
  Wifi,
  WifiOff,
  Heart,
  Clock,
  BookOpen
} from 'lucide-react';

interface HistoryDashboardProps {
  contacts: ContactRecord[];
  onToggleFavorite: (contactId: string) => void;
  user: UserProfile;
  onToggleOfflineSimulation: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  contacts,
  onToggleFavorite,
  user,
  onToggleOfflineSimulation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'has_notes'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);

  // Extract unique countries from contacts
  const countriesMet = useMemo(() => {
    const set = new Set(contacts.map((c) => c.partnerCountry));
    return Array.from(set);
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.partnerCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.notes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'favorites' && !c.isFavorite) return false;
      if (filterType === 'has_notes' && c.notes.length === 0) return false;
      if (selectedCountry !== 'all' && c.partnerCountry !== selectedCountry) return false;

      return true;
    });
  }, [contacts, searchQuery, filterType, selectedCountry]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Interaction History
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            People you have met in ten-minute sessions, along with notes and compliments.
          </p>
        </div>

        {/* Security & Offline Indicator */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium border border-stone-200">
            <Lock className="w-3.5 h-3.5 text-stone-600" />
            <span>Encrypted on Device</span>
          </div>

          <button
            onClick={onToggleOfflineSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              user.isOfflineMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
            }`}
            title="Toggle offline access mode"
          >
            {user.isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-800" />
                <span>Offline Mode (Simulated)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-stone-600" />
                <span>Offline Synced</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, country, topic, or vocabulary note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-medium shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilterType('favorites')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              filterType === 'favorites'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className="w-3 h-3 text-rose-500" />
            <span>Saved ({contacts.filter((c) => c.isFavorite).length})</span>
          </button>
          <button
            onClick={() => setFilterType('has_notes')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'has_notes'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            With Notes
          </button>
        </div>

        {/* Country Filter */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-stone-900 text-stone-700"
        >
          <option value="all">All Countries</option>
          {countriesMet.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Contacts List Grid */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <h3 className="text-base font-bold text-stone-800">No matching contacts found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or clear your active filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between"
            >
              <div>
                {/* Contact Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <img
                        src={contact.partnerAvatar}
                        alt={contact.partnerName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 leading-tight">
                        {contact.partnerName}
                      </h3>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {contact.partnerCountry} · {contact.partnerEnglishLevel}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(contact.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                    title={contact.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        contact.isFavorite ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Session Meta */}
                <div className="text-xs text-stone-600 bg-stone-50 rounded-xl p-2.5 mb-3 space-y-1">
                  <div className="font-semibold text-stone-900 truncate">
                    Topic: {contact.topicTitle}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {new Date(contact.sessionDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span>10 minutes</span>
                  </div>
                </div>

                {/* Notes Preview */}
                {contact.notes.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                      Notes:
                    </span>
                    <ul className="text-xs text-stone-700 space-y-1">
                      {contact.notes.slice(0, 2).map((note, idx) => (
                        <li key={idx} className="line-clamp-1">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Compliments */}
                {contact.complimentsReceived.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {contact.complimentsReceived.map((c, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">
                  {contact.encryptedHash}
                </span>
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="text-xs font-semibold text-stone-800 hover:text-stone-950"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200">
                  <img
                    src={selectedContact.partnerAvatar}
                    alt={selectedContact.partnerName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedContact.partnerName}
                  </h3>
                  <div className="text-xs text-stone-500">
                    {selectedContact.partnerCountry} · {selectedContact.partnerEnglishLevel}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                  Bio
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
                  {selectedContact.partnerBio}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                  Topic Discussed
                </span>
                <p className="text-xs text-stone-900 font-medium bg-stone-100 p-3 rounded-xl">
                  {selectedContact.topicTitle}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                  Session Notes
                </span>
                <div className="space-y-1.5">
                  {selectedContact.notes.map((n, i) => (
                    <div key={i} className="text-xs bg-stone-50 p-2.5 rounded-lg text-stone-800 border border-stone-200">
                      • {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
