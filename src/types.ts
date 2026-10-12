export type EnglishLevel = 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced' | 'Fluent';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  bio: string;
  nativeLanguage: string;
  englishLevel: EnglishLevel;
  interests: string[];
  sessionsCompletedToday: number;
  totalSessions: number;
  totalMinutes: number;
  streakDays: number;
  unlimitedPassExpiresAt: number | null; // timestamp if active
  isOfflineMode: boolean;
  isFreeNow: boolean; // currently available and ready to speak right now
}

export interface ConversationTopic {
  id: string;
  title: string;
  category: string;
  prompts: [string, string, string]; // [Topic Introduction, Follow-up Question, Reflection]
  tags: string[];
}

export interface Partner {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  bio: string;
  nativeLanguage: string;
  englishLevel: EnglishLevel;
  interests: string[];
  accent: string;
  localTime: string;
  isOnlineNow: boolean;
  greetings: string[];
  conversationResponses: string[];
}

export interface ContactRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerCountry: string;
  partnerCode: string;
  partnerFlag: string;
  partnerBio: string;
  partnerEnglishLevel: EnglishLevel;
  topicTitle: string;
  sessionDate: string; // ISO string
  durationMinutes: number;
  notes: string[];
  complimentsReceived: string[];
  complimentsGiven: string[];
  isFavorite: boolean;
  encryptedHash: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  learnedWith: string;
  date: string;
}

export type PassType = '2_days' | '7_days' | '30_days';

export interface PassOption {
  id: PassType;
  title: string;
  days: number;
  price: number;
  badge?: string;
  popular?: boolean;
  description: string;
}

export type ModerationWarningStage = 'none' | 'warning_1_crowded' | 'warning_2_final' | 'terminated_crowd' | 'permanent_ban';

// Transparent Merchant Payout System
export interface PayoutSettings {
  payoutMethod: 'bank_transfer' | 'stripe' | 'paypal';
  accountHolderName: string;
  bankName: string;
  ibanOrAccountNumber: string;
  swiftOrRouting: string;
  stripeAccountId: string;
  paypalEmail: string;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  currency: string;
}

export interface PayoutTransaction {
  id: string;
  date: string;
  buyerName: string;
  passType: string;
  grossAmount: number;
  processingFee: number;
  netPayout: number;
  status: 'transferred' | 'scheduled' | 'processing';
  payoutDestination: string;
}

