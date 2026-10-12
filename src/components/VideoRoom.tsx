import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Partner, ConversationTopic, ModerationWarningStage, UserProfile } from '../types';
import { LiveVideoRenderer } from './LiveVideoRenderer';
import { WebRTCManager } from '../utils/webrtc';
import {
  playSessionStartChime,
  playWarningChime,
  playDetectiveAlertSound,
  playSuccessChime,
  playLaughterChime
} from '../utils/audio';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Shield,
  ShieldAlert,
  Users,
  AlertTriangle,
  BookOpen,
  Send,
  ChevronRight,
  Copy,
  Check,
  Radio,
  Camera,
  RefreshCw,
  Sparkles,
  MessageSquare,
  Smile
} from 'lucide-react';

interface VideoRoomProps {
  partner: Partner;
  topic: ConversationTopic;
  user: UserProfile;
  roomId?: string;
  onEndSession: (notes: string[], durationMinutes: number) => void;
  onTriggerPermanentBan: () => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  partner,
  topic,
  user,
  roomId = 'LC-ROOM-701',
  onEndSession,
  onTriggerPermanentBan
}) => {
  // 10 minutes = 600 seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isPartnerVoiceMuted, setIsPartnerVoiceMuted] = useState<boolean>(false);
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);
  const [showChatDrawer, setShowChatDrawer] = useState<boolean>(false);
  const [copiedRoomLink, setCopiedRoomLink] = useState<boolean>(false);

  // WebRTC Real Remote Stream State
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
  const [isRealPeerConnected, setIsRealPeerConnected] = useState<boolean>(false);
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);

  // Partner Dialogue State
  const [partnerSpeechText, setPartnerSpeechText] = useState<string>(partner.greetings[0]);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState<boolean>(true);
  const [isPartnerLaughing, setIsPartnerLaughing] = useState<boolean>(false);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // User Interactive Speech Recognition State
  const [isListeningSpeech, setIsListeningSpeech] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'partner'; text: string; time: string }[]>([
    { sender: 'partner', text: partner.greetings[0], time: '00:00' }
  ]);

  // Moderation System State
  const [moderationStage, setModerationStage] = useState<ModerationWarningStage>('none');
  const [crowdTimer, setCrowdTimer] = useState<number | null>(null);

  // Webcam & Mic Media State
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const userFallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebcamAccess, setHasWebcamAccess] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Voice Speech Synthesis Helper
  const speakText = useCallback((text: string) => {
    if (isPartnerVoiceMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Clean display text from asterisks like *laughs* for speech synthesizer
      const spokenCleanText = text.replace(/\*[^*]+\*/g, '').trim();
      if (!spokenCleanText) return;

      const utterance = new SpeechSynthesisUtterance(spokenCleanText);
      utterance.rate = 0.96;
      // Tone variation based on partner
      if (partner.name.includes('Elena') || partner.name.includes('Akira')) {
        utterance.pitch = 1.05;
      } else {
        utterance.pitch = 0.95;
      }
      utterance.lang = 'en-US';

      utterance.onstart = () => setIsPartnerSpeaking(true);
      utterance.onend = () => setIsPartnerSpeaking(false);
      utterance.onerror = () => setIsPartnerSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis restricted', e);
      setIsPartnerSpeaking(false);
    }
  }, [isPartnerVoiceMuted, partner.name]);

  // Robust Camera Startup
  const startCamera = useCallback(async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Webcam not supported in this browser.');
      return;
    }

    const constraintTiers: MediaStreamConstraints[] = [
      { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true },
      { video: true, audio: true },
      { video: true, audio: false }
    ];

    let acquiredStream: MediaStream | null = null;
    for (const constraints of constraintTiers) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (acquiredStream) break;
      } catch (err) {
        console.warn('Camera constraint attempt failed, trying next tier:', err);
      }
    }

    if (acquiredStream) {
      mediaStreamRef.current = acquiredStream;
      setHasWebcamAccess(true);
      setCameraError(null);

      // Attach stream to video tag
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = acquiredStream;
        userVideoRef.current.play().catch((e) => console.warn('User video play error', e));
      }

      // Pass stream to WebRTC manager
      if (webrtcManagerRef.current) {
        webrtcManagerRef.current.setLocalStream(acquiredStream);
      }
    } else {
      setHasWebcamAccess(false);
      setCameraError('Camera access was not granted or no webcam was detected.');
    }
  }, []);

  // Ensure Video Stream is bound whenever element is ready
  useEffect(() => {
    if (userVideoRef.current && mediaStreamRef.current) {
      userVideoRef.current.srcObject = mediaStreamRef.current;
      userVideoRef.current.play().catch(() => {});
    }
  }, [hasWebcamAccess, isVideoMuted]);

  // AI Conversational Response Dispatcher
  const sendUserMessageToAI = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userEntry = {
      sender: 'user' as const,
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
    };
    setChatLog((prev) => [...prev, userEntry]);
    setTypedMessage('');
    setSpeechTranscript('');
    setIsAiGenerating(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: partner.name,
          partnerCountry: partner.country,
          partnerBio: partner.bio,
          partnerLevel: partner.englishLevel,
          topicTitle: topic.title,
          userMessage: messageText,
          conversationHistory: chatLog.slice(-6)
        })
      });

      const data = await response.json();
      const reply = data.reply || "Haha, that's such a great thought! What do you like to do in your free time?";

      // Check if partner laughs
      const hasLaughter = reply.toLowerCase().includes('haha') ||
                          reply.toLowerCase().includes('*laughs*') ||
                          reply.toLowerCase().includes('laugh');
      if (hasLaughter) {
        setIsPartnerLaughing(true);
        playLaughterChime();
        setTimeout(() => setIsPartnerLaughing(false), 2500);
      }

      setPartnerSpeechText(reply);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'partner',
          text: reply,
          time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
        }
      ]);

      speakText(reply);
    } catch (err) {
      console.warn('AI chat error, using natural conversational fallback', err);
      const fallbacks = [
        `Haha, that's really interesting! In ${partner.country}, we actually have a very similar experience. Tell me more!`,
        `*laughs warmly* I love that story! You express yourself so well in English. How did you first get interested in this?`,
        `That makes so much sense! Thank you for sharing. Have you ever traveled abroad for something like that?`
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setPartnerSpeechText(randomFallback);
      speakText(randomFallback);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Browser Speech Recognition (Voice Input)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    let recognition: any = null;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningSpeech(true);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        const currentText = finalTrans || interimTrans;
        setSpeechTranscript(currentText);

        if (finalTrans && finalTrans.trim().length > 3) {
          sendUserMessageToAI(finalTrans);
        }
      };

      recognition.onerror = () => {
        setIsListeningSpeech(false);
      };

      recognition.onend = () => {
        setIsListeningSpeech(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition not started:', e);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [partner, topic]);

  // Initialize WebRTC and Camera on mount
  useEffect(() => {
    playSessionStartChime();
    startCamera();

    // Start WebRTC Manager
    const rtc = new WebRTCManager(roomId, user.id, user.name);
    webrtcManagerRef.current = rtc;

    rtc.onRemoteStream((stream) => {
      setRemoteMediaStream(stream);
      setIsRealPeerConnected(true);
    });

    rtc.onConnectionStateChange((state) => {
      if (state === 'connected') {
        setIsRealPeerConnected(true);
      } else if (state === 'disconnected' || state === 'failed') {
        setIsRealPeerConnected(false);
      }
    });

    rtc.initConnection(true);

    // Speak initial greeting
    const greetingTimeout = setTimeout(() => {
      speakText(partner.greetings[0]);
    }, 1200);

    return () => {
      clearTimeout(greetingTimeout);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      rtc.destroy();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, partner, startCamera, speakText, user.id, user.name]);

  // Fallback Camera Canvas Animation (if webcam permission is pending or denied)
  useEffect(() => {
    if (hasWebcamAccess) return;

    const canvas = userFallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let count = 0;

    const drawUserCamera = () => {
      count++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#292524';
      ctx.fillRect(0, 0, w, h);

      // Human avatar silhouette
      ctx.fillStyle = '#44403c';
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.4, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.85, 48, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Audio activity wave
      if (!isMicMuted) {
        ctx.fillStyle = '#10b981';
        for (let i = 0; i < 4; i++) {
          const barH = Math.sin(count * 0.2 + i) * 6 + 4;
          ctx.fillRect(w - 24 + i * 5, h - 14 - barH, 3, barH);
        }
      }

      frameId = requestAnimationFrame(drawUserCamera);
    };

    drawUserCamera();
    return () => cancelAnimationFrame(frameId);
  }, [hasWebcamAccess, isMicMuted]);

  // 10-Minute Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playSuccessChime();
          onEndSession(notes, 10);
          return 0;
        }

        if (prev === 120 || prev === 30) {
          playWarningChime();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [notes, onEndSession]);

  // Auto Conversation Prompter (Keeps the 10-minute momentum alive if quiet)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRealPeerConnected || isAiGenerating || isPartnerSpeaking) return;

      const responses = partner.conversationResponses;
      const nextText = responses[Math.floor(Math.random() * responses.length)];
      setPartnerSpeechText(nextText);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'partner',
          text: nextText,
          time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
        }
      ]);
      speakText(nextText);
    }, 38000);

    return () => clearInterval(interval);
  }, [partner, isRealPeerConnected, isAiGenerating, isPartnerSpeaking, speakText]);

  const toggleMic = () => {
    setIsMicMuted((prev) => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = prev;
        });
      }
      return !prev;
    });
  };

  const toggleVideo = () => {
    setIsVideoMuted((prev) => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = prev;
        });
      }
      return !prev;
    });
  };

  // Moderation Handlers
  const triggerMultiPersonNotice = () => {
    playDetectiveAlertSound();
    setModerationStage('warning_1_crowded');

    const timer = window.setTimeout(() => {
      setModerationStage('warning_2_final');

      const finalTimer = window.setTimeout(() => {
        setModerationStage('terminated_crowd');
      }, 10000);

      setCrowdTimer(finalTimer);
    }, 8000);

    setCrowdTimer(timer);
  };

  const dismissCrowdWarning = () => {
    if (crowdTimer) {
      clearTimeout(crowdTimer);
      setCrowdTimer(null);
    }
    setModerationStage('none');
  };

  const triggerHarshWordsViolation = () => {
    playDetectiveAlertSound();
    setModerationStage('permanent_ban');
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCopyDirectRoomLink = () => {
    const directUrl = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(directUrl);
    setCopiedRoomLink(true);
    setTimeout(() => setCopiedRoomLink(false), 2000);
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotes([...notes, noteInput.trim()]);
    setNoteInput('');
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[640px] bg-stone-950 text-white flex flex-col overflow-hidden">
      {/* Top Session Bar */}
      <div className="h-14 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white leading-tight">
                {isRealPeerConnected ? 'Real Live Peer Connected' : partner.name}
              </span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-700/50">
                {isRealPeerConnected ? 'P2P Live' : 'AI Companion'}
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              {partner.country} · {partner.englishLevel} · {partner.localTime}
            </span>
          </div>
        </div>

        {/* 10-Minute Countdown Clock */}
        <div className="flex items-center gap-2 px-3 py-1 bg-stone-800 rounded-lg border border-stone-700">
          <span className="text-xs text-stone-400 font-medium">Session:</span>
          <span
            className={`font-mono text-sm sm:text-base font-bold tabular-nums ${
              secondsRemaining <= 60
                ? 'text-rose-400'
                : secondsRemaining <= 120
                ? 'text-amber-400'
                : 'text-stone-100'
            }`}
          >
            {timeFormatted}
          </span>
        </div>

        {/* Direct Link Share, Chat & Notes */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDirectRoomLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
            title="Invite another person or phone to join as a real 2-person call"
          >
            {copiedRoomLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {copiedRoomLink ? 'Link Copied!' : 'Invite Another Device'}
            </span>
          </button>

          <button
            onClick={() => setShowChatDrawer(!showChatDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showChatDrawer
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Conversation ({chatLog.length})</span>
          </button>

          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showNotesDrawer
                ? 'bg-amber-600 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* Main Video Call Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Partner Large Live Video Canvas */}
        <div className="flex-1 relative bg-stone-900 flex items-center justify-center overflow-hidden">
          <LiveVideoRenderer
            partner={partner}
            remoteMediaStream={remoteMediaStream}
            isSpeaking={isPartnerSpeaking}
            isLaughing={isPartnerLaughing}
            isMuted={isPartnerVoiceMuted}
          />

          {/* Partner Live Subtitle Banner */}
          {!isRealPeerConnected && (
            <div className="absolute bottom-24 left-4 right-4 sm:left-8 sm:right-auto sm:max-w-xl z-10">
              <div className="bg-stone-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700 shadow-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPartnerLaughing
                          ? 'bg-amber-400 animate-ping'
                          : isPartnerSpeaking
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-stone-500'
                      }`}
                    />
                    <span className="text-xs font-semibold text-stone-200">
                      {partner.name} ({partner.country})
                    </span>
                    {isPartnerLaughing && (
                      <span className="text-[11px] text-amber-300 flex items-center gap-1 font-medium">
                        <Smile className="w-3 h-3" /> Laughs warmly
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400">· {partner.accent}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsPartnerVoiceMuted(!isPartnerVoiceMuted);
                      if (typeof window !== 'undefined' && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className="text-stone-400 hover:text-white p-1 rounded"
                    title={isPartnerVoiceMuted ? 'Unmute Partner Voice' : 'Mute Partner Voice'}
                  >
                    {isPartnerVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-medium">
                  "{partnerSpeechText}"
                </p>
              </div>
            </div>
          )}

          {/* Live Voice Speech Recognition Badge */}
          {isListeningSpeech && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-700 shadow-lg text-xs text-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Listening to your voice...</span>
              {speechTranscript && (
                <span className="text-emerald-300 font-mono text-[11px] max-w-xs truncate">
                  "{speechTranscript}"
                </span>
              )}
            </div>
          )}

          {/* User Self Video (Picture in Picture) */}
          <div className="absolute top-4 right-4 w-40 sm:w-60 h-30 sm:h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700 bg-stone-900 z-20 flex flex-col items-center justify-center">
            {/* Real Video Element (always mounted) */}
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover -scale-x-100 ${
                hasWebcamAccess && !isVideoMuted ? 'block' : 'hidden'
              }`}
            />

            {/* Fallback Canvas & Permission Helper */}
            {(!hasWebcamAccess || isVideoMuted) && (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-stone-900 p-2 text-center">
                <canvas
                  ref={userFallbackCanvasRef}
                  width={320}
                  height={240}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5 p-2 bg-stone-950/80 rounded-xl border border-stone-800">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-semibold text-stone-200 leading-tight">
                    {isVideoMuted ? 'Camera Muted' : 'Camera Inactive'}
                  </span>
                  {!hasWebcamAccess && (
                    <button
                      onClick={startCamera}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Enable Camera
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 text-[10px] bg-stone-950/85 px-2 py-0.5 rounded text-stone-200">
              <span className="font-semibold">{user.name.split(' ')[0]} (You)</span>
              {isMicMuted && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
            </div>

            {hasWebcamAccess && !isVideoMuted && (
              <div className="absolute top-1.5 right-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] text-stone-300">Live</span>
              </div>
            )}
          </div>

          {/* Quick Conversational Prompt Chips */}
          <div className="absolute top-16 left-4 z-10 hidden sm:flex flex-col gap-1.5 max-w-xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Quick Talk Prompts
            </span>
            {topic.prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => sendUserMessageToAI(p)}
                className="text-left text-xs bg-stone-900/85 hover:bg-stone-800 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/80 text-stone-200 hover:text-white transition-colors truncate shadow"
                title={p}
              >
                💬 {p}
              </button>
            ))}
          </div>
        </div>

        {/* Live Conversation Chat Drawer */}
        {showChatDrawer && (
          <div className="w-80 bg-stone-900 border-l border-stone-800 flex flex-col z-30 shrink-0">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Live Conversation</h3>
              </div>
              <button
                onClick={() => setShowChatDrawer(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] text-stone-500 mb-0.5">
                    {msg.sender === 'user' ? 'You' : partner.name} · {msg.time}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-800 text-stone-200 border border-stone-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiGenerating && (
                <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{partner.name} is thinking...</span>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-stone-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendUserMessageToAI(typedMessage);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message or question..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim() || isAiGenerating}
                  className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Notes & Vocabulary Drawer */}
        {showNotesDrawer && (
          <div className="w-80 bg-stone-900 border-l border-stone-800 flex flex-col z-30 shrink-0">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-white">In-Call Notebook</h3>
              </div>
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-4 border-b border-stone-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder="Save new vocabulary word..."
                  className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleAddNote}
                  className="p-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl border border-stone-700"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No notes recorded yet. Write down interesting words or idioms your partner mentions.
                </div>
              ) : (
                notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-2.5 bg-stone-800/80 rounded-xl border border-stone-700 text-xs text-stone-200"
                  >
                    {note}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Guided Conversation Topic Banner */}
      <div className="bg-stone-900/95 border-t border-stone-800 px-4 py-2.5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider shrink-0">
            Topic: {topic.title}
          </span>
          <span className="text-stone-600 hidden sm:inline">|</span>
          <p className="text-xs text-stone-300 truncate max-w-md hidden sm:block">
            {topic.prompts[activePromptIndex]}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const nextIdx = (activePromptIndex + 1) % topic.prompts.length;
              setActivePromptIndex(nextIdx);
              sendUserMessageToAI(topic.prompts[nextIdx]);
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs transition-colors"
          >
            <span>Next Question</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bottom Call Action Control Bar */}
      <div className="h-20 bg-stone-950 border-t border-stone-800 px-4 sm:px-8 flex items-center justify-between z-20 shrink-0">
        {/* Detective Moderation Badge & Triggers */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-400 text-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Detective 1-on-1 Safety Active</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-stone-500">
            <button
              onClick={triggerMultiPersonNotice}
              className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-400 rounded border border-stone-800 transition-colors"
              title="Test multi-person detection notice"
            >
              Test Crowd Alert
            </button>
            <button
              onClick={triggerHarshWordsViolation}
              className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-rose-400/80 rounded border border-stone-800 transition-colors"
              title="Test harsh words permanent ban"
            >
              Test Ban
            </button>
          </div>
        </div>

        {/* Core Media Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMic}
            className={`p-3.5 rounded-2xl transition-colors ${
              isMicMuted
                ? 'bg-rose-600 text-white'
                : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl transition-colors ${
              isVideoMuted || !hasWebcamAccess
                ? 'bg-rose-600 text-white'
                : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isVideoMuted ? 'Start Video' : 'Stop Video'}
          >
            {isVideoMuted || !hasWebcamAccess ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onEndSession(notes, Math.round((600 - secondsRemaining) / 60))}
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-lg"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Finish Call</span>
          </button>
        </div>

        {/* Safety Report Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerHarshWordsViolation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-stone-400 hover:text-rose-400 rounded-lg text-xs transition-colors"
            title="Report inappropriate behavior"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Safety</span>
          </button>
        </div>
      </div>

      {/* Moderation Stage Alerts */}
      {moderationStage === 'warning_1_crowded' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 rounded-3xl max-w-md w-full p-6 border border-amber-600/50 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-500 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Notice 1: Multiple People Detected</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                LinguaConnect requires strict 1-on-1 English practice. Please be the only person on camera and move away from crowded places.
              </p>
            </div>
            <button
              onClick={dismissCrowdWarning}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              I Understand (Continue 1-on-1)
            </button>
          </div>
        </div>
      )}

      {moderationStage === 'warning_2_final' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 rounded-3xl max-w-md w-full p-6 border border-rose-600/50 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Notice 2: Final Warning</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                A crowded setting is still detected. The call will be automatically ended in 10 seconds to maintain community safety standards.
              </p>
            </div>
            <button
              onClick={dismissCrowdWarning}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Confirm 1-on-1 Space
            </button>
          </div>
        </div>
      )}

      {moderationStage === 'terminated_crowd' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md">
          <div className="bg-stone-900 rounded-3xl max-w-md w-full p-6 border border-stone-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <PhoneOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Session Concluded</h3>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                This call was closed by safety moderation due to repeated multi-person presence. You can start a new 1-on-1 session anytime in a quiet room.
              </p>
            </div>
            <button
              onClick={() => onEndSession(notes, 3)}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Return to Lobby
            </button>
          </div>
        </div>
      )}

      {moderationStage === 'permanent_ban' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md">
          <div className="bg-rose-950/80 rounded-3xl max-w-md w-full p-6 border border-rose-600 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Account Permanently Suspended</h3>
              <p className="text-xs text-rose-200 mt-2 leading-relaxed">
                Zero-tolerance safety violation detected (harsh language, inappropriate behavior, or nudity). This account has been permanently removed from LinguaConnect.
              </p>
            </div>
            <button
              onClick={onTriggerPermanentBan}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Close Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
