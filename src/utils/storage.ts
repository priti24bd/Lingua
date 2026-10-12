import {
  UserProfile,
  ContactRecord,
  VocabularyWord
} from '../types';
import akiraImg from '../assets/images/partner_akira_japan_1791792187656.jpg';
import marcoImg from '../assets/images/partner_marco_italy_1791792200715.jpg';
import elenaImg from '../assets/images/partner_elena_brazil_1791792212315.jpg';

const USER_KEY = 'linguaconnect_free_user_v1';
const CONTACTS_KEY = 'linguaconnect_free_contacts_v1';
const VOCAB_KEY = 'linguaconnect_free_vocab_v1';
const SYNC_META_KEY = 'linguaconnect_free_sync_meta_v1';

export const INITIAL_USER: UserProfile = {
  id: 'usr-global-1',
  name: 'Alex Morgan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  country: 'Canada',
  countryCode: 'CA',
  countryFlag: 'Canada',
  bio: 'Practicing conversational English. Interested in travel, education, and meeting new people.',
  nativeLanguage: 'French',
  englishLevel: 'Upper-Intermediate',
  interests: ['Travel and Hometown Stories', 'Food and Cooking Traditions', 'Work and Goals'],
  sessionsCompletedToday: 3,
  totalSessions: 24,
  totalMinutes: 240,
  streakDays: 6,
  isOfflineMode: false,
  isFreeNow: true,
  isLoggedIn: true
};

const INITIAL_CONTACTS: ContactRecord[] = [
  {
    id: 'cnt-1',
    partnerId: 'p-akira',
    partnerName: 'Akira Takahashi',
    partnerAvatar: akiraImg,
    partnerCountry: 'Japan',
    partnerCode: 'JP',
    partnerFlag: 'Japan',
    partnerBio: 'Software engineer from Tokyo practicing conversational English for work.',
    partnerEnglishLevel: 'Upper-Intermediate',
    topicTitle: 'Daily Routines and Free Time',
    sessionDate: '2026-10-11T14:30:00.000Z',
    durationMinutes: 10,
    notes: [
      'Discussed the Japanese expression Mottainai regarding not wasting time and resources.',
      'Talked about commuting habits and evening tea routines in Tokyo.'
    ],
    complimentsReceived: ['Clear pronunciation', 'Friendly listener', 'Good vocabulary'],
    complimentsGiven: ['Patient speaker', 'Interesting perspective'],
    isFavorite: true,
    encryptedHash: 'ID-HASH:89f1a0e2'
  },
  {
    id: 'cnt-2',
    partnerId: 'p-marco',
    partnerName: 'Marco Bellini',
    partnerAvatar: marcoImg,
    partnerCountry: 'Italy',
    partnerCode: 'IT',
    partnerFlag: 'Italy',
    partnerBio: 'Architectural researcher from Rome interested in design and history.',
    partnerEnglishLevel: 'Advanced',
    topicTitle: 'Food and Cooking Traditions',
    sessionDate: '2026-10-10T11:15:00.000Z',
    durationMinutes: 10,
    notes: [
      'Discussed Italian regional cooking traditions and slow weekend lunches.',
      'Explored the phrase al dente and how it represents attention to timing.'
    ],
    complimentsReceived: ['Natural conversation pace', 'Attentive listener'],
    complimentsGiven: ['Clear explanations', 'Warm attitude'],
    isFavorite: true,
    encryptedHash: 'ID-HASH:41c890d7'
  },
  {
    id: 'cnt-3',
    partnerId: 'p-elena',
    partnerName: 'Elena Silva',
    partnerAvatar: elenaImg,
    partnerCountry: 'Brazil',
    partnerCode: 'BR',
    partnerFlag: 'Brazil',
    partnerBio: 'Environmental researcher from Sao Paulo.',
    partnerEnglishLevel: 'Upper-Intermediate',
    topicTitle: 'Travel and Hometown Stories',
    sessionDate: '2026-10-09T18:00:00.000Z',
    durationMinutes: 10,
    notes: [
      'Shared information on biodiversity and travel spots in Brazil.',
      'Discussed speaking confidence and not worrying about small mistakes.'
    ],
    complimentsReceived: ['Encouraging attitude', 'Clear phrasing'],
    complimentsGiven: ['Friendly demeanor', 'Engaging speaker'],
    isFavorite: false,
    encryptedHash: 'ID-HASH:12b9a7c6'
  }
];

const INITIAL_VOCAB: VocabularyWord[] = [
  {
    id: 'voc-1',
    word: 'Mottainai',
    meaning: 'A Japanese word expressing gratitude for resources and avoiding unnecessary waste.',
    example: 'Practicing Mottainai helps us value each day and remain mindful.',
    learnedWith: 'Akira Takahashi (Japan)',
    date: '2026-10-11'
  },
  {
    id: 'voc-2',
    word: 'Serendipitous',
    meaning: 'Occurring or found by chance in a happy and beneficial way.',
    example: 'Meeting an interesting conversation partner was completely serendipitous.',
    learnedWith: 'Marco Bellini (Italy)',
    date: '2026-10-10'
  },
  {
    id: 'voc-3',
    word: 'Fluency',
    meaning: 'The ability to speak or write a language easily and smoothly.',
    example: 'Daily ten-minute speaking builds steady conversational fluency.',
    learnedWith: 'Elena Silva (Brazil)',
    date: '2026-10-09'
  }
];

export function getUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read user', err);
  }
  saveUser(INITIAL_USER);
  return INITIAL_USER;
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user', err);
  }
}

export function getContacts(): ContactRecord[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read contacts', err);
  }
  saveContacts(INITIAL_CONTACTS);
  return INITIAL_CONTACTS;
}

export function saveContacts(contacts: ContactRecord[]): void {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (err) {
    console.error('Failed to save contacts', err);
  }
}

export function getVocab(): VocabularyWord[] {
  try {
    const raw = localStorage.getItem(VOCAB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read vocab', err);
  }
  saveVocab(INITIAL_VOCAB);
  return INITIAL_VOCAB;
}

export function saveVocab(vocab: VocabularyWord[]): void {
  try {
    localStorage.setItem(VOCAB_KEY, JSON.stringify(vocab));
  } catch (err) {
    console.error('Failed to save vocab', err);
  }
}

export function generateEncryptedHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `ID-HASH:${hex}`;
}
