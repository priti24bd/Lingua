import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  try {
    ai = new GoogleGenAI();
  } catch (err) {
    console.warn('GoogleGenAI initialization warning:', err);
  }

  // AI Conversational Partner Endpoint
  app.post('/api/ai-chat', async (req, res) => {
    const partnerName = req.body.partnerName || 'Akira';
    const partnerCountry = req.body.partnerCountry || 'Japan';
    const partnerBio = req.body.partnerBio || 'Software engineer from Tokyo';
    const partnerLevel = req.body.partnerLevel || 'Upper-Intermediate';
    const topicTitle = req.body.topicTitle || 'Travel & Hidden Cultural Gems';
    const userMessage = req.body.userMessage || '';
    const conversationHistory = req.body.conversationHistory || [];

    try {
      if (!ai) {
        ai = new GoogleGenAI();
      }

      const systemInstruction = `You are ${partnerName}, a friendly, warm English conversation partner from ${partnerCountry}.
Bio: ${partnerBio}.
English Proficiency: ${partnerLevel}.
Current discussion topic: "${topicTitle}".

You are on a 1-on-1 English speaking video call on LinguaConnect. You speak with real human warmth, empathy, and joy.
Guidelines:
1. Speak 100% like a real human friend on a video call. Never use robotic phrases, never say "As an AI" or "I am an artificial intelligence".
2. Laugh naturally when something is funny, charming, or relatable. You can use expressions like "Haha, that's so true!", "*laughs warmly* Oh wow, I know that feeling!", or "Haha, really?".
3. Answer the user's questions directly and thoughtfully, sharing personal cultural anecdotes or daily life details from ${partnerCountry} (food, routines, favorite places).
4. Keep each spoken turn conversational and concise: 2 to 3 sentences maximum, so it feels like a fast, natural dialogue.
5. End your turn by passing the conversation back with a friendly, natural follow-up question or engaging thought.
6. Speak in clear, natural conversational English.`;

      const contents = [
        ...conversationHistory.map((item: { sender: string; text: string }) => ({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        })),
        {
          role: 'user',
          parts: [{ text: userMessage || 'Hello! Nice to meet you.' }]
        }
      ];

      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.9,
          maxOutputTokens: 250
        }
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 7000)
      );

      const response = await Promise.race([aiPromise, timeoutPromise]);
      const replyText = response.text?.trim() || "Haha, that's really interesting! Tell me more about that.";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.warn('AI generateContent note (using persona conversational responses):', error?.message || error);
      
      const partnerFallbacks: Record<string, string[]> = {
        'Akira': [
          "Haha, oh wow, that is so interesting! In Tokyo, people often talk about that too. How did you first get into it?",
          "*laughs warmly* Haha, I completely know what you mean! It's funny because I had almost the exact same thought earlier today. What's your favorite part about it?",
          "That sounds really wonderful! You express your thoughts so naturally in English. Have you ever visited Japan or thought about coming over?",
          "Haha, really? That made me smile! We still have a few minutes on our call—tell me about something you're looking forward to this week."
        ],
        'Marco': [
          "*laughs warmly* Haha, mamma mia, that's such a great story! In Rome, we say that good conversations make time fly. What got you interested in that?",
          "Haha, I love that perspective! It is so true. How do people usually do that where you live?",
          "That is fascinating! You explain things with such great rhythm and clarity. Do you practice English every day?",
          "*laughs* Oh definitely! I can completely relate to that feeling. What is the most memorable experience you have had with that?"
        ],
        'Elena': [
          "Haha, that's amazing! Warm greetings from Sao Paulo—I was smiling the whole time you were talking. What happened next?",
          "*laughs warmly* Oh totally! People in Brazil are so passionate about that too. How did your friends or family react?",
          "You have such a clear and friendly way of speaking English! Do not worry about making small pauses, you sound totally natural. What else do you enjoy doing?",
          "Haha, oh I love that! That sounds like such an unforgettable memory. What made you decide to try that?"
        ],
        'Lucas': [
          "Haha, that is a really good point! Here in Berlin, we see a lot of people discussing this. How long have you been doing that?",
          "*laughs warmly* Exactly! It is always refreshing to hear different perspectives from around the world. What would be your dream goal with that?",
          "That makes total sense. Your English vocabulary is really solid. What do you find easiest about speaking English so far?",
          "Haha, good one! Time is flying on our 10-minute session. What is one piece of advice you would give to someone trying that?"
        ]
      };

      const partnerPool = partnerFallbacks[partnerName] || partnerFallbacks['Akira'];
      const chosenReply = partnerPool[Math.floor(Math.random() * partnerPool.length)];
      res.json({ reply: chosenReply, fallback: true });
    }
  });

  // Signaling endpoint for multi-device WebRTC pairing
  const roomOffers = new Map<string, any[]>();

  app.post('/api/signal/post', (req, res) => {
    const { roomId, signal } = req.body;
    if (!roomId || !signal) {
      return res.status(400).json({ error: 'Missing roomId or signal' });
    }
    const current = roomOffers.get(roomId) || [];
    current.push({ ...signal, timestamp: Date.now() });
    // Keep only last 20 signals
    roomOffers.set(roomId, current.slice(-20));
    res.json({ success: true });
  });

  app.get('/api/signal/poll', (req, res) => {
    const { roomId, since } = req.query;
    if (!roomId) {
      return res.status(400).json({ error: 'Missing roomId' });
    }
    const signals = roomOffers.get(roomId as string) || [];
    const sinceTimestamp = parseInt(since as string, 10) || 0;
    const filtered = signals.filter((s) => s.timestamp > sinceTimestamp);
    res.json({ signals: filtered });
  });

  // Mount Vite or static server
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LinguaConnect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
