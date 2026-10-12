import { Partner } from '../types';

import akiraImg from '../assets/images/partner_akira_japan_1791792187656.jpg';
import marcoImg from '../assets/images/partner_marco_italy_1791792200715.jpg';
import elenaImg from '../assets/images/partner_elena_brazil_1791792212315.jpg';
import lucasImg from '../assets/images/partner_lucas_germany_1791792226042.jpg';

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p-akira',
    name: 'Akira Takahashi',
    avatar: akiraImg,
    country: 'Japan',
    countryCode: 'JP',
    countryFlag: 'Japan',
    bio: 'Software engineer from Tokyo. Practicing conversational English for work and travel.',
    nativeLanguage: 'Japanese',
    englishLevel: 'Upper-Intermediate',
    interests: ['Technology and Habits', 'Travel and Cities', 'Food and Recipes'],
    accent: 'Japanese (Clear and Gentle)',
    localTime: '17:02 JST',
    isOnlineNow: true,
    greetings: [
      'Hello. Good to meet you on LinguaConnect. Where are you joining from today?',
      'Hi there. I have ten minutes free before dinner. Looking forward to our conversation.',
      'Nice to meet you. Let us pick a question and get started.'
    ],
    conversationResponses: [
      'That makes sense. In Japan, we have a similar custom regarding everyday routines.',
      'I agree with that. When I began speaking English, I often worried about making small mistakes.',
      'That sounds like a memorable experience. Thank you for explaining that so clearly.',
      'Our time is passing quickly. What is your favorite thing to do on weekends?'
    ]
  },
  {
    id: 'p-marco',
    name: 'Marco Bellini',
    avatar: marcoImg,
    country: 'Italy',
    countryCode: 'IT',
    countryFlag: 'Italy',
    bio: 'Architectural researcher living in Rome. Enjoys design history, espresso, and conversation practice.',
    nativeLanguage: 'Italian',
    englishLevel: 'Advanced',
    interests: ['Cinema and Reading', 'Food and Recipes', 'Daily Life and Work'],
    accent: 'Italian (Warm and Expressive)',
    localTime: '10:02 CEST',
    isOnlineNow: true,
    greetings: [
      'Good morning. It is a pleasure to meet you. I am glad we connected today.',
      'Hello. I am ready for our ten-minute conversation. Which topic would you like to discuss?',
      'Hi there. How has your day been so far?'
    ],
    conversationResponses: [
      'That is an interesting point. In Italy, family dinners often last two to three hours on Sundays.',
      'You explain that very naturally. It is easy to follow your thoughts.',
      'Cooking is definitely one of the best ways to understand a culture from the inside.',
      'We still have a few minutes on our call. What got you interested in learning English?'
    ]
  },
  {
    id: 'p-elena',
    name: 'Elena Silva',
    avatar: elenaImg,
    country: 'Brazil',
    countryCode: 'BR',
    countryFlag: 'Brazil',
    bio: 'Environmental researcher from Sao Paulo. Loves nature, music, and meeting international friends.',
    nativeLanguage: 'Portuguese',
    englishLevel: 'Upper-Intermediate',
    interests: ['Travel and Cities', 'Career and Education', 'Building Speaking Confidence'],
    accent: 'Brazilian (Friendly and Clear)',
    localTime: '05:02 BRT',
    isOnlineNow: true,
    greetings: [
      'Hello. Very nice to meet you here. Ready for our session.',
      'Hi there. Warm greetings from Brazil. How is your week going?',
      'Good to connect with you. Ten minutes is the right length for a relaxed conversation.'
    ],
    conversationResponses: [
      'I completely agree. In my city, people are very spontaneous and open to meeting new people.',
      'You are speaking very clearly. Do not worry about small pauses, it sounds completely natural.',
      'Traveling across different states taught me that simple kindness is understood everywhere.',
      'I am really enjoying our talk. We should leave a short compliment before our session ends.'
    ]
  },
  {
    id: 'p-lucas',
    name: 'Lucas Weber',
    avatar: lucasImg,
    country: 'Germany',
    countryCode: 'DE',
    countryFlag: 'Germany',
    bio: 'Product designer based in Berlin. Interested in cycling, urban transport, and daily speaking.',
    nativeLanguage: 'German',
    englishLevel: 'Fluent',
    interests: ['Technology and Habits', 'Career and Education', 'Daily Life and Work'],
    accent: 'German (Direct and Friendly)',
    localTime: '10:02 CEST',
    isOnlineNow: true,
    greetings: [
      'Hello. Nice to meet you. I have ten minutes free before my afternoon meeting.',
      'Hi there. Ready for our practice call. Which question prompt should we start with?',
      'Good day. It is always interesting to talk to someone from another part of the world.'
    ],
    conversationResponses: [
      'That makes good practical sense. In Berlin, many teams work across multiple languages every day.',
      'Speaking ten minutes every day is much more effective than studying grammar for hours once a week.',
      'Consistency creates habits. When you practice regularly, words come to mind much faster.',
      'That is a helpful expression. I will take note of that phrasing.'
    ]
  }
];
