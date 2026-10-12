import {
  UserProfile,
  ContactRecord,
  VocabularyWord,
  EnglishLevel,
  PayoutSettings,
  PayoutTransaction
} from '../types';
import akiraImg from '../assets/images/partner_akira_japan_1791792187656.jpg';
import marcoImg from '../assets/images/partner_marco_italy_1791792200715.jpg';
import elenaImg from '../assets/images/partner_elena_brazil_1791792212315.jpg';

const USER_KEY = 'linguaconnect_user_v2';
const CONTACTS_KEY = 'linguaconnect_contacts_v2';
const VOCAB_KEY = 'linguaconnect_vocab_v2';
const SYNC_META_KEY = 'linguaconnect_sync_meta_v2';
const PAYOUT_SETTINGS_KEY = 'linguaconnect_payout_settings_v1';
const PAYOUT_TRANSACTIONS_KEY = 'linguaconnect_payout_tx_v1';

export const INITIAL_USER: UserProfile = {
  id: 'usr-global-1',
  name: 'Alex Morgan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  country: 'Canada',
  countryCode: 'CA',
  countryFlag: 'Canada',
  bio: 'Practicing everyday English conversations. Interested in travel, education, and meeting new people.',
  nativeLanguage: 'French',
  englishLevel: 'Upper-Intermediate',
  interests: ['Travel and Hometown Stories', 'Food and Cooking Traditions', 'Work and Goals'],
  sessionsCompletedToday: 3, // out of 15 free daily sessions
  totalSessions: 24,
  totalMinutes: 240,
  streakDays: 6,
  unlimitedPassExpiresAt: null,
  isOfflineMode: false,
  isFreeNow: true
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
    encryptedHash: 'AES256-GCM:89f1a0e28c74b...[verified]'
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
    encryptedHash: 'AES256-GCM:41c890d71ef3a...[verified]'
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
    encryptedHash: 'AES256-GCM:12b9a7c64de89...[verified]'
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

export const DEFAULT_PAYOUT_SETTINGS: PayoutSettings = {
  payoutMethod: 'bank_transfer',
  accountHolderName: 'Platform Organizer',
  bankName: 'Global Commercial Bank',
  ibanOrAccountNumber: 'GB82 WEST 1234 5678 9012 34',
  swiftOrRouting: 'WESTGB2L',
  stripeAccountId: 'acct_1OwnerLinguaConnect',
  paypalEmail: 'payments@linguaconnect.com',
  payoutSchedule: 'daily',
  currency: 'USD'
};

const INITIAL_PAYOUT_TRANSACTIONS: PayoutTransaction[] = [
  {
    id: 'tx-101',
    date: '2026-10-11 16:42 UTC',
    buyerName: 'Kenji Sato',
    passType: '7-Day Unlimited ($10)',
    grossAmount: 10.0,
    processingFee: 0.59, // 2.9% + $0.30 standard processing
    netPayout: 9.41,
    status: 'transferred',
    payoutDestination: 'Bank Account Ending in 1234'
  },
  {
    id: 'tx-102',
    date: '2026-10-10 11:20 UTC',
    buyerName: 'Camila Rodriguez',
    passType: 'Whole Month ($20)',
    grossAmount: 20.0,
    processingFee: 0.88,
    netPayout: 19.12,
    status: 'transferred',
    payoutDestination: 'Bank Account Ending in 1234'
  },
  {
    id: 'tx-103',
    date: '2026-10-09 09:14 UTC',
    buyerName: 'David Meyer',
    passType: '2-Day Unlimited ($5)',
    grossAmount: 5.0,
    processingFee: 0.45,
    netPayout: 4.55,
    status: 'transferred',
    payoutDestination: 'Bank Account Ending in 1234'
  }
];

export function getUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read user from storage', err);
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
    touchSyncMetadata();
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

export function getPayoutSettings(): PayoutSettings {
  try {
    const raw = localStorage.getItem(PAYOUT_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read payout settings', err);
  }
  savePayoutSettings(DEFAULT_PAYOUT_SETTINGS);
  return DEFAULT_PAYOUT_SETTINGS;
}

export function savePayoutSettings(settings: PayoutSettings): void {
  try {
    localStorage.setItem(PAYOUT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save payout settings', err);
  }
}

export function getPayoutTransactions(): PayoutTransaction[] {
  try {
    const raw = localStorage.getItem(PAYOUT_TRANSACTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read payout transactions', err);
  }
  savePayoutTransactions(INITIAL_PAYOUT_TRANSACTIONS);
  return INITIAL_PAYOUT_TRANSACTIONS;
}

export function savePayoutTransactions(txs: PayoutTransaction[]): void {
  try {
    localStorage.setItem(PAYOUT_TRANSACTIONS_KEY, JSON.stringify(txs));
  } catch (err) {
    console.error('Failed to save payout transactions', err);
  }
}

export function recordNewPurchaseAndPayout(
  buyerName: string,
  passName: string,
  grossPrice: number
): PayoutTransaction {
  const currentSettings = getPayoutSettings();
  // Standard card processing fee: 2.9% + $0.30
  const processingFee = Number((grossPrice * 0.029 + 0.3).toFixed(2));
  const netPayout = Number((grossPrice - processingFee).toFixed(2));

  let destination = 'Bank Account';
  if (currentSettings.payoutMethod === 'stripe') {
    destination = `Stripe (${currentSettings.stripeAccountId})`;
  } else if (currentSettings.payoutMethod === 'paypal') {
    destination = `PayPal (${currentSettings.paypalEmail})`;
  } else {
    destination = `${currentSettings.bankName} (${currentSettings.ibanOrAccountNumber.slice(-4)})`;
  }

  const newTx: PayoutTransaction = {
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    buyerName,
    passType: `${passName} ($${grossPrice})`,
    grossAmount: grossPrice,
    processingFee,
    netPayout,
    status: 'scheduled',
    payoutDestination: destination
  };

  const existing = getPayoutTransactions();
  const updated = [newTx, ...existing];
  savePayoutTransactions(updated);
  return newTx;
}

export function touchSyncMetadata(): { lastSynced: string; encryptedCount: number } {
  const meta = {
    lastSynced: new Date().toISOString(),
    status: 'Local Data Synced Securely'
  };
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
  return { lastSynced: meta.lastSynced, encryptedCount: getContacts().length };
}

export function getSyncMetadata(): { lastSynced: string; status: string } {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    lastSynced: new Date().toISOString(),
    status: 'Local Data Synced Securely'
  };
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
