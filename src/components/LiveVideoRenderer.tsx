import React, { useEffect, useRef } from 'react';
import { Partner } from '../types';

interface LiveVideoRendererProps {
  partner: Partner;
  remoteMediaStream: MediaStream | null;
  isSpeaking: boolean;
  isLaughing?: boolean;
  isMuted: boolean;
}

export const LiveVideoRenderer: React.FC<LiveVideoRendererProps> = ({
  partner,
  remoteMediaStream,
  isSpeaking,
  isLaughing = false,
  isMuted
}) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partnerImgRef = useRef<HTMLImageElement | null>(null);

  // Bind real remote WebRTC stream if present
  useEffect(() => {
    if (remoteVideoRef.current && remoteMediaStream) {
      remoteVideoRef.current.srcObject = remoteMediaStream;
      remoteVideoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented on remote stream', err);
      });
    }
  }, [remoteMediaStream]);

  // Load avatar for live video canvas simulation if no peer connected
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = partner.avatar;
    img.onload = () => {
      partnerImgRef.current = img;
    };
  }, [partner.avatar]);

  // 30 FPS Canvas video generator with natural human motion, breathing, blinking, laughing & audio reactivity
  useEffect(() => {
    if (remoteMediaStream) return; // real video active

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep studio background
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      bgGrad.addColorStop(0, '#262220');
      bgGrad.addColorStop(1, '#12100f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (partnerImgRef.current) {
        // Natural human micro-movements
        const breatheY = Math.sin(frame * 0.025) * 2.5;
        const speakY = isSpeaking ? Math.sin(frame * 0.22) * 2.5 : 0;
        const laughY = isLaughing ? Math.sin(frame * 0.45) * 4.5 : 0;
        const headTilt = isLaughing ? Math.sin(frame * 0.3) * 0.02 : Math.sin(frame * 0.015) * 0.008;
        const scale = isLaughing ? 1.025 : isSpeaking ? 1.012 : 1.0;

        ctx.save();
        ctx.translate(width / 2, height / 2 + breatheY + speakY + laughY);
        ctx.rotate(headTilt);
        ctx.scale(scale, scale);

        // Aspect fit / cover
        const img = partnerImgRef.current;
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let drawW = width;
        let drawH = height;
        if (imgAspect > canvasAspect) {
          drawW = height * imgAspect;
        } else {
          drawH = width / imgAspect;
        }

        ctx.drawImage(
          img,
          -drawW / 2,
          -drawH / 2,
          drawW,
          drawH
        );

        // Natural eye-blink cycle (~every 140 frames = 4.6 seconds)
        const blinkCycle = frame % 150;
        if (blinkCycle >= 144 && blinkCycle <= 148 && !isLaughing) {
          ctx.fillStyle = 'rgba(30, 24, 20, 0.45)';
          // Subtle eye eyelid shadow
          ctx.beginPath();
          ctx.ellipse(-drawW * 0.07, -drawH * 0.06, 14, 4, 0, 0, Math.PI * 2);
          ctx.ellipse(drawW * 0.07, -drawH * 0.06, 14, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Speaking mouth / jaw movement simulation
        if (isSpeaking && !isLaughing) {
          const mouthOpen = Math.abs(Math.sin(frame * 0.32)) * 4.5;
          ctx.fillStyle = 'rgba(28, 16, 12, 0.32)';
          ctx.beginPath();
          ctx.ellipse(0, drawH * 0.11, 14, 3 + mouthOpen, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Laughing mouth & joyful smile expression
        if (isLaughing) {
          const laughOpen = Math.abs(Math.sin(frame * 0.4)) * 6 + 3;
          ctx.fillStyle = 'rgba(26, 14, 10, 0.4)';
          ctx.beginPath();
          ctx.ellipse(0, drawH * 0.11, 18, 5 + laughOpen, 0, 0, Math.PI * 2);
          ctx.fill();

          // Warm cheek blush highlight
          ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
          ctx.beginPath();
          ctx.ellipse(-drawW * 0.15, drawH * 0.04, 26, 14, 0, 0, Math.PI * 2);
          ctx.ellipse(drawW * 0.15, drawH * 0.04, 26, 14, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      } else {
        // Fallback placeholder while image is caching
        ctx.fillStyle = '#3f3f46';
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.42, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(width / 2, height * 0.85, 130, 80, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle atmospheric lighting gradient at bottom for subtitle contrast
      const gradient = ctx.createLinearGradient(0, height * 0.55, 0, height);
      gradient.addColorStop(0, 'rgba(12, 10, 9, 0)');
      gradient.addColorStop(1, 'rgba(12, 10, 9, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Audio waveform equalizer in bottom-right corner when speaking
      if ((isSpeaking || isLaughing) && !isMuted) {
        ctx.fillStyle = isLaughing ? '#f59e0b' : '#10b981';
        for (let i = 0; i < 5; i++) {
          const barHeight = Math.abs(Math.sin(frame * 0.25 + i * 0.8)) * 14 + 4;
          ctx.fillRect(width - 48 + i * 7, height - 20 - barHeight, 4, barHeight);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [remoteMediaStream, isSpeaking, isLaughing, isMuted, partner]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-900 flex items-center justify-center">
      {remoteMediaStream ? (
        // Real Live WebRTC Video Track from Real Human
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        // Live Generated Video Feed
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover"
        />
      )}

      {/* Video Stream Quality & Status Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-stone-950/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] text-stone-300 shadow-md">
        <span
          className={`w-2 h-2 rounded-full ${
            remoteMediaStream
              ? 'bg-emerald-500 animate-pulse'
              : isLaughing
              ? 'bg-amber-400 animate-ping'
              : isSpeaking
              ? 'bg-emerald-400 animate-pulse'
              : 'bg-stone-500'
          }`}
        />
        <span className="font-semibold">
          {remoteMediaStream
            ? 'Live WebRTC Video Stream'
            : isLaughing
            ? 'Laughing warmly'
            : isSpeaking
            ? 'Speaking'
            : 'Live Video Feed'}
        </span>
        <span className="text-stone-500">· 720p HD</span>
      </div>
    </div>
  );
};
