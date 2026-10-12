import React, { useState, useEffect, useRef } from 'react';
import { Partner, ConversationTopic, ModerationWarningStage, UserProfile } from '../types';
import {
  playSessionStartChime,
  playWarningChime,
  playDetectiveAlertSound,
  playSuccessChime
} from '../utils/audio';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Shield,
  ShieldAlert,
  Users,
  AlertTriangle,
  Flag,
  BookOpen,
  Send,
  ChevronRight
} from 'lucide-react';

interface VideoRoomProps {
  partner: Partner;
  topic: ConversationTopic;
  user: UserProfile;
  onEndSession: (notes: string[], durationMinutes: number) => void;
  onTriggerPermanentBan: () => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  partner,
  topic,
  user,
  onEndSession,
  onTriggerPermanentBan
}) => {
  // 10 minutes = 600 seconds
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isBlurActive, setIsBlurActive] = useState<boolean>(false);
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');
  const [showNotesDrawer, setShowNotesDrawer] = useState<boolean>(false);

  // Partner speech simulation
  const [partnerSpeechText, setPartnerSpeechText] = useState<string>(partner.greetings[0]);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState<boolean>(true);

  // Moderation System State
  const [moderationStage, setModerationStage] = useState<ModerationWarningStage>('none');
  const [crowdTimer, setCrowdTimer] = useState<number | null>(null);

  // WebRTC User Video
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const [hasWebcamAccess, setHasWebcamAccess] = useState<boolean>(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize camera and start chime
  useEffect(() => {
    playSessionStartChime();

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          setHasWebcamAccess(true);
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setHasWebcamAccess(false);
        });
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Timer countdown
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

  // Periodic partner conversational responses
  useEffect(() => {
    const interval = setInterval(() => {
      const responses = partner.conversationResponses;
      const nextText = responses[Math.floor(Math.random() * responses.length)];
      setPartnerSpeechText(nextText);
      setIsPartnerSpeaking(true);

      const timeout = setTimeout(() => {
        setIsPartnerSpeaking(false);
      }, 7000);

      return () => clearTimeout(timeout);
    }, 22000);

    return () => clearInterval(interval);
  }, [partner]);

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

  // Crowd Detection Simulation
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

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotes([...notes, noteInput.trim()]);
    setNoteInput('');
  };

  // Format MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[640px] bg-stone-950 text-white flex flex-col overflow-hidden">
      {/* Top Session Bar */}
      <div className="h-14 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">
              {partner.name}
            </span>
            <span className="text-[11px] text-stone-400">
              {partner.country} · {partner.englishLevel} · {partner.localTime}
            </span>
          </div>
        </div>

        {/* 10-Minute Countdown Clock */}
        <div className="flex items-center gap-2 px-3 py-1 bg-stone-800 rounded-lg border border-stone-700">
          <span className="text-xs text-stone-400 font-medium">Session Timer:</span>
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

        {/* Notes & Moderation Status */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 text-[11px] font-medium text-stone-300 rounded-lg border border-stone-700">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span>1-on-1 Moderation Active</span>
          </div>

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
        {/* Partner Large Video Canvas */}
        <div className="flex-1 relative bg-stone-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-stone-950/30" />
          </div>

          {/* Partner Speaking Subtitle Banner */}
          <div className="absolute bottom-20 left-4 right-4 sm:left-8 sm:right-auto sm:max-w-xl z-10">
            <div className="bg-stone-900/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-700 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-stone-200">
                  {partner.name} ({partner.country})
                </span>
                <span className="text-[10px] text-stone-400">· {partner.accent}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-100 leading-relaxed">
                "{partnerSpeechText}"
              </p>
            </div>
          </div>

          {/* User Self Video (Picture in Picture) */}
          <div
            className={`absolute top-4 right-4 w-36 sm:w-56 h-28 sm:h-40 rounded-xl overflow-hidden shadow-xl border border-stone-700 bg-stone-900 z-20 ${
              isBlurActive ? 'backdrop-blur-xl' : ''
            }`}
          >
            {hasWebcamAccess && !isVideoMuted ? (
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${
                  isBlurActive ? 'filter blur-sm' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 text-stone-300 p-2 text-center">
                <span className="text-xs font-semibold text-stone-200 truncate max-w-full">
                  {user.name}
                </span>
                <span className="text-[10px] text-stone-400">
                  {isVideoMuted ? 'Camera Off' : 'Your Video Feed'}
                </span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[10px] bg-stone-950/80 px-1.5 py-0.5 rounded text-stone-200">
              <span>You ({user.countryCode})</span>
              {isMicMuted && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
            </div>
          </div>

          {/* Conversation Question Banner */}
          <div className="absolute top-4 left-4 right-44 sm:right-64 z-10">
            <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-3 shadow-md max-w-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-stone-300">
                  Topic: {topic.title}
                </span>
                <div className="flex gap-1">
                  {topic.prompts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePromptIndex(idx)}
                      className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                        activePromptIndex === idx
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-800 text-stone-400 hover:text-white'
                      }`}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-stone-100">
                Question {activePromptIndex + 1}: {topic.prompts[activePromptIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Vocabulary Notes Drawer */}
        {showNotesDrawer && (
          <div className="w-72 bg-stone-900 border-l border-stone-800 flex flex-col p-4 shrink-0 z-30">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-semibold text-stone-200">
                Session Notes
              </span>
              <button
                onClick={() => setShowNotesDrawer(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {notes.length === 0 ? (
                <div className="text-center py-6 text-stone-500 text-xs">
                  Take notes during the call. Saved automatically when the session finishes.
                </div>
              ) : (
                notes.map((n, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-stone-800 rounded-lg text-xs text-stone-200 border border-stone-700"
                  >
                    • {n}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-stone-800 flex gap-1.5">
              <input
                type="text"
                placeholder="New note or phrase..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                className="flex-1 bg-stone-800 text-xs text-white px-2.5 py-2 rounded-lg border border-stone-700 focus:outline-none focus:border-stone-500"
              />
              <button
                onClick={handleAddNote}
                className="p-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition-colors"
                title="Add note"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Session Toolbar Controls */}
      <div className="h-16 bg-stone-900 border-t border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Moderation testing actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerMultiPersonNotice}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-[11px] font-medium text-stone-300 rounded-lg border border-stone-700 transition-colors"
            title="Simulate multi-person detection sequence"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test Crowded Notice</span>
          </button>

          <button
            onClick={triggerHarshWordsViolation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-[11px] font-medium text-rose-300 rounded-lg border border-rose-900/40 transition-colors"
            title="Report violation / test conduct ban"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report Conduct</span>
          </button>
        </div>

        {/* Center: Essential Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition-colors ${
              isMicMuted
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoMuted
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isVideoMuted ? 'Start Video' : 'Stop Video'}
          >
            {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsBlurActive(!isBlurActive)}
            className={`hidden sm:flex px-3 py-2 rounded-xl transition-colors text-xs font-semibold ${
              isBlurActive
                ? 'bg-stone-700 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Blur
          </button>

          <button
            onClick={() => {
              const elapsedMinutes = Math.max(1, Math.ceil((600 - secondsRemaining) / 60));
              onEndSession(notes, elapsedMinutes);
            }}
            className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Next Question */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActivePromptIndex((prev) => (prev + 1) % topic.prompts.length);
            }}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
          >
            <span>Next Question</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Moderation Stage 1: Crowded Warning Notice */}
      {moderationStage === 'warning_1_crowded' && (
        <div className="absolute inset-x-4 top-16 z-40 max-w-lg mx-auto bg-stone-900 border border-amber-600 text-stone-100 p-4 rounded-xl shadow-2xl">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Notice: 1-on-1 Rule Enforced
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed mb-3">
                Multiple people or crowded background detected. LinguaConnect requires a private one-on-one room. Please remove others from your frame or move to a quiet setting.
              </p>
              <button
                onClick={dismissCrowdWarning}
                className="text-xs bg-white text-stone-900 font-semibold px-3 py-1.5 rounded-lg"
              >
                1-on-1 Frame Restored
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Stage 2: Final Notice with Disconnection Warning */}
      {moderationStage === 'warning_2_final' && (
        <div className="absolute inset-x-4 top-16 z-40 max-w-lg mx-auto bg-stone-900 border border-rose-600 text-stone-100 p-4 rounded-xl shadow-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Final Notice: Call Will End
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed mb-3">
                Multiple individuals remain on camera. The call will automatically disconnect in ten seconds unless single-person frame is confirmed.
              </p>
              <button
                onClick={dismissCrowdWarning}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg"
              >
                Confirm Single Person
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Stage 3: Terminated by Crowd */}
      {moderationStage === 'terminated_crowd' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md">
          <div className="bg-stone-900 p-6 rounded-2xl max-w-md w-full text-center border border-stone-800">
            <Users className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">
              Call Disconnected
            </h3>
            <p className="text-xs text-stone-300 mb-5 leading-relaxed">
              This call ended because multiple people were in the camera frame. You can now start another session in a private setting.
            </p>
            <button
              onClick={() => {
                setModerationStage('none');
                onEndSession(notes, 1);
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Start Another Session
            </button>
          </div>
        </div>
      )}

      {/* Moderation Stage 4: Permanent Ban */}
      {moderationStage === 'permanent_ban' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md">
          <div className="bg-stone-900 p-6 rounded-2xl max-w-md w-full text-center border border-rose-600">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">
              Zero-Tolerance Violation
            </h3>
            <p className="text-xs text-stone-300 mb-5 leading-relaxed">
              Harsh language, verbal abuse, or inappropriate bodily exposure has been identified. This account is permanently banned to protect all members.
            </p>
            <button
              onClick={onTriggerPermanentBan}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Acknowledge Ban
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
