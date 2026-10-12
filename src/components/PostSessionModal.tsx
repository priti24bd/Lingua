import React, { useState } from 'react';
import { Partner } from '../types';
import { Check, Clock, Heart } from 'lucide-react';

interface PostSessionModalProps {
  partner: Partner;
  topicTitle: string;
  durationMinutes: number;
  initialNotes: string[];
  onSaveAndClose: (data: {
    compliments: string[];
    notes: string[];
    isFavorite: boolean;
  }) => void;
}

const COMPLIMENT_OPTIONS = [
  'Clear pronunciation',
  'Friendly conversation',
  'Good vocabulary',
  'Attentive listener',
  'Helpful cultural insights',
  'Encouraging attitude'
];

export const PostSessionModal: React.FC<PostSessionModalProps> = ({
  partner,
  topicTitle,
  durationMinutes,
  initialNotes,
  onSaveAndClose
}) => {
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    'Friendly conversation',
    'Clear pronunciation'
  ]);
  const [notes, setNotes] = useState<string[]>(initialNotes);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(true);

  const toggleCompliment = (item: string) => {
    if (selectedCompliments.includes(item)) {
      setSelectedCompliments(selectedCompliments.filter((c) => c !== item));
    } else {
      setSelectedCompliments([...selectedCompliments, item]);
    }
  };

  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    setNotes([...notes, newNoteInput.trim()]);
    setNewNoteInput('');
  };

  const handleSubmit = () => {
    onSaveAndClose({
      compliments: selectedCompliments,
      notes,
      isFavorite
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 my-8">
        <div className="bg-stone-900 text-white p-6 text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-600 mx-auto mb-3 shadow-md">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xs text-stone-300 font-medium block mb-0.5">
            10-Minute Call Finished
          </span>
          <h2 className="text-lg font-bold">{partner.name}</h2>
          <div className="text-xs text-stone-400 mt-0.5">
            <span>{partner.country}</span>
            <span> · </span>
            <span>{partner.englishLevel}</span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Overview */}
          <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{durationMinutes} minutes completed</span>
            </div>
            <div className="font-medium text-stone-800 truncate max-w-[200px]">
              {topicTitle}
            </div>
          </div>

          {/* Compliments */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Send Compliments to {partner.name}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMPLIMENT_OPTIONS.map((comp) => {
                const active = selectedCompliments.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleCompliment(comp)}
                    className={`flex items-center justify-between p-2.5 text-xs rounded-xl border text-left transition-colors ${
                      active
                        ? 'bg-stone-900 text-white border-stone-900 font-medium'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{comp}</span>
                    {active && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Session Notes</span>
              <span className="text-[11px] font-normal text-stone-500">Auto-saved to history</span>
            </label>
            <div className="space-y-1 mb-2">
              {notes.map((n, i) => (
                <div key={i} className="text-xs bg-stone-50 p-2 rounded-lg text-stone-700 border border-stone-200">
                  • {n}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a phrase or note from this call..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                className="flex-1 text-xs border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-900"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
              <span className="text-xs font-medium text-stone-800">
                Save {partner.name} to Saved Network
              </span>
            </div>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
          >
            Save to History and Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
};
