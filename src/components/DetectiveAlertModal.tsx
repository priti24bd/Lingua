import React, { useEffect, useState } from 'react';
import { ModerationWarningStage } from '../types';
import { Users, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ModerationAlertModalProps {
  stage: ModerationWarningStage;
  onDismissWarning: () => void;
  onRematchSession: () => void;
  onAcknowledgeBan: () => void;
}

export const DetectiveAlertModal: React.FC<ModerationAlertModalProps> = ({
  stage,
  onDismissWarning,
  onRematchSession,
  onAcknowledgeBan
}) => {
  const [countdown, setCountdown] = useState<number>(10);

  useEffect(() => {
    if (stage === 'warning_2_final') {
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  if (stage === 'none') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Notice 1: Crowded space notice */}
        {stage === 'warning_1_crowded' && (
          <div className="p-6">
            <div className="flex items-center gap-3 text-amber-800 mb-3">
              <Users className="w-6 h-6 text-amber-700" />
              <h3 className="text-lg font-bold text-stone-900">
                1-on-1 Rule Notice: Multiple People Detected
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              More than one person was detected in your camera frame or crowded noise was identified. LinguaConnect conversations are strictly one-on-one. Please step into a private quiet space where only you are on camera.
            </p>

            <button
              onClick={onDismissWarning}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Confirmed 1-on-1 Setting
            </button>
          </div>
        )}

        {/* Notice 2: Final Warning */}
        {stage === 'warning_2_final' && (
          <div className="p-6">
            <div className="flex items-center gap-3 text-rose-700 mb-3">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <h3 className="text-lg font-bold text-stone-900">
                Final Notice: Call Will End in {countdown} Seconds
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Multiple people remain in frame. To maintain privacy, the call will disconnect unless only one person is visible.
            </p>

            <div className="flex gap-2">
              <button
                onClick={onDismissWarning}
                className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Clear Frame Now
              </button>
              <button
                onClick={onRematchSession}
                className="py-2 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
              >
                End and Match Again
              </button>
            </div>
          </div>
        )}

        {/* Notice 3: Terminated by Crowd */}
        {stage === 'terminated_crowd' && (
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              Session Ended: 1-on-1 Setting Required
            </h3>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              The conversation ended because multiple people were visible on camera. You may start a new call now from a quiet private space.
            </p>
            <button
              onClick={onRematchSession}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Find Another Partner
            </button>
          </div>
        )}

        {/* Notice 4: Permanent Ban */}
        {stage === 'permanent_ban' && (
          <div className="p-6 text-center bg-stone-900 text-white">
            <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">
              Account Permanently Banned
            </h3>
            <p className="text-xs text-stone-300 mb-6 leading-relaxed text-left bg-stone-800 p-3.5 rounded-xl border border-stone-700">
              Harsh words, abusive language, or inappropriate bodily exposure was identified. LinguaConnect enforces a strict zero-tolerance safety policy. This account has been permanently removed.
            </p>
            <button
              onClick={onAcknowledgeBan}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Acknowledge and Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
