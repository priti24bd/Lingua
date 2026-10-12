import React, { useEffect, useRef } from 'react';
import { Partner } from '../types';

interface LiveVideoRendererProps {
  partner: Partner;
  remoteMediaStream: MediaStream | null;
  isSpeaking: boolean;
  isMuted: boolean;
}

export const LiveVideoRenderer: React.FC<LiveVideoRendererProps> = ({
  partner,
  remoteMediaStream,
  isSpeaking,
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

  // 30 FPS Canvas video generator with natural motion & audio reactivity
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

      // Draw background room
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, width, height);

      if (partnerImgRef.current) {
        // Natural gentle head motion (breathing & speaking sway)
        const breatheY = Math.sin(frame * 0.03) * 2;
        const speakY = isSpeaking ? Math.sin(frame * 0.25) * 3 : 0;
        const scale = isSpeaking ? 1.015 : 1.0;

        ctx.save();
        ctx.translate(width / 2, height / 2 + breatheY + speakY);
        ctx.scale(scale, scale);
        ctx.drawImage(
          partnerImgRef.current,
          -width / 2,
          -height / 2,
          width,
          height
        );

        // Speaking lip motion / jaw micro-movement simulation
        if (isSpeaking) {
          const mouthOpen = Math.abs(Math.sin(frame * 0.35)) * 4;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.beginPath();
          ctx.ellipse(0, height * 0.08, 12, 4 + mouthOpen, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Subtle lighting overlay
      const gradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
      gradient.addColorStop(0, 'rgba(12, 10, 9, 0)');
      gradient.addColorStop(1, 'rgba(12, 10, 9, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Audio waveform equalizer in bottom-right corner when speaking
      if (isSpeaking && !isMuted) {
        ctx.fillStyle = '#10b981';
        for (let i = 0; i < 6; i++) {
          const barHeight = Math.abs(Math.sin(frame * 0.2 + i * 0.8)) * 14 + 4;
          ctx.fillRect(width - 50 + i * 7, height - 20 - barHeight, 4, barHeight);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [remoteMediaStream, isSpeaking, isMuted, partner]);

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
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-stone-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800 text-[11px] text-stone-300">
        <span
          className={`w-2 h-2 rounded-full ${
            remoteMediaStream
              ? 'bg-emerald-500 animate-pulse'
              : isSpeaking
              ? 'bg-amber-400 animate-pulse'
              : 'bg-stone-500'
          }`}
        />
        <span className="font-medium">
          {remoteMediaStream
            ? 'Live WebRTC Video Stream'
            : isSpeaking
            ? 'Speaking'
            : 'Live Video Feed'}
        </span>
        <span className="text-stone-500">· 720p 30fps</span>
      </div>
    </div>
  );
};
