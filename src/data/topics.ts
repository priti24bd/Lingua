import { ConversationTopic } from '../types';

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: 'travel-cities',
    title: 'Travel and Hometown Stories',
    category: 'Culture',
    prompts: [
      'What is your favorite place in your hometown to show a visiting guest?',
      'Tell about a travel experience that taught you something unexpected.',
      'If you could live in another country for three months, where would you go?'
    ],
    tags: ['Travel', 'Places', 'Culture']
  },
  {
    id: 'food-traditions',
    title: 'Food and Cooking Traditions',
    category: 'Daily Life',
    prompts: [
      'What dish reminds you most of home or your childhood?',
      'Do you prefer cooking at home or eating at local markets and restaurants?',
      'What is one dish from your country that everyone should try once?'
    ],
    tags: ['Food', 'Cooking', 'Traditions']
  },
  {
    id: 'work-learning',
    title: 'Work, Studies and Personal Goals',
    category: 'Career',
    prompts: [
      'What kind of work or projects do you spend most of your time on?',
      'What is a new skill or hobby you have started learning this year?',
      'What advice helped you when you started your career or studies?'
    ],
    tags: ['Work', 'Education', 'Goals']
  },
  {
    id: 'daily-habits',
    title: 'Daily Routines and Free Time',
    category: 'Lifestyle',
    prompts: [
      'How do you like to spend a quiet morning or evening?',
      'What is one daily habit that helps you stay relaxed and focused?',
      'What books, podcasts, or films have kept your attention recently?'
    ],
    tags: ['Habits', 'Routines', 'Free Time']
  },
  {
    id: 'speaking-confidence',
    title: 'Learning English and Communication',
    category: 'Language',
    prompts: [
      'What made you decide to practice conversational English today?',
      'What helps you stay calm when you forget a word while speaking?',
      'What is your main goal for improving your conversational fluency?'
    ],
    tags: ['English', 'Speaking', 'Confidence']
  }
];
