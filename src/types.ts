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
  isOfflineMode: boolean;
  isFreeNow: boolean;
  isLoggedIn: boolean;
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

export type ModerationWarningStage = 'none' | 'warning_1_crowded' | 'warning_2_final' | 'terminated_crowd' | 'permanent_ban';
