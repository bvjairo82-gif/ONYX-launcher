import React, { useRef, useState, useEffect } from 'react';
import { Camera, Zap, RotateCcw, Image as ImageIcon, X } from 'lucide-react';
import { playShutterSound } from '../../utils/audio';

interface CameraAppProps {
  onClose: () => void;
  accentColor: string;
  soundEnabled: boolean;
}

export const CameraApp: React.FC<CameraAppProps> = ({ onClose, accentColor, soundEnabled }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [flash, setFlash] = useState(false);
  const [flashTriggered, setFlashTriggered] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false,
          });
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreamActive(true);
          }
        }
      } catch {
        // Fallback to high tech camera simulation
        setStreamActive(false);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    playShutterSound(soundEnabled);
    if (flash) {
      setFlashTriggered(true);
      setTimeout(() => setFlashTriggered(false), 200);
    }

    if (streamActive && videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setLastPhoto(canvas.toDataURL('image/jpeg'));
      }
    } else {
      setLastPhoto('simulated-capture');
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-black text-white overflow-hidden">
      {/* Flash overlay */}
      {flashTriggered && <div className="absolute inset-0 bg-white z-50 animate-fade-out" />}

      {/* Top Controls */}
      <div className="flex items-center justify-between p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => setFlash(!flash)}
          className={`p-2 rounded-full border ${
            flash ? 'bg-amber-400 text-black border-amber-400' : 'border-white/20 text-white'
          }`}
        >
          <Zap size={16} />
        </button>
        <span className="text-xs font-mono tracking-widest text-white/70">
          OLED CAM 4K
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/60 border border-white/20 text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative flex-1 flex items-center justify-center bg-[#050505]">
        {streamActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Viewfinder grid & reticle */}
            <div className="absolute inset-8 border border-white/10 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border border-white/5" />
              <div className="border border-white/5" />
              <div className="border border-white/5" />
              <div className="border border-white/5" />
              <div className="border border-white/5 flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full border border-dashed animate-spin"
                  style={{ borderColor: accentColor }}
                />
              </div>
              <div className="border border-white/5" />
              <div className="border border-white/5" />
              <div className="border border-white/5" />
              <div className="border border-white/5" />
            </div>

            <Camera size={48} className="text-white/20 mb-3" />
            <div className="text-xs font-mono text-white/60">
              Sensor OLED Activo
            </div>
            <div className="text-[10px] text-white/40 mt-1">
              ISO 100 · 1/250s · f/1.8 HDR
            </div>
          </div>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      <div className="flex items-center justify-around p-6 bg-black z-20">
        <div className="w-10 h-10 rounded-xl border border-white/20 overflow-hidden flex items-center justify-center bg-[#111]">
          {lastPhoto && lastPhoto !== 'simulated-capture' ? (
            <img src={lastPhoto} alt="Captura" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={18} className="text-white/40" />
          )}
        </div>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <div
            className="w-14 h-14 rounded-full bg-white transition-all active:scale-95"
            style={{ backgroundColor: accentColor }}
          />
        </button>

        <button
          onClick={() => {}}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};
