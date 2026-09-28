import React from 'react';
import { CameraPunchHoleConfig, RingEffect } from '../types/launcher';

interface PunchHoleCameraProps {
  config: CameraPunchHoleConfig;
  hasUnreadNotifications: boolean;
  onCameraTap?: () => void;
}

export const PunchHoleCamera: React.FC<PunchHoleCameraProps> = ({
  config,
  hasUnreadNotifications,
  onCameraTap,
}) => {
  if (!config.enabled) return null;

  // Active or idle ring state
  const isNotificationActive = config.activeOnNotification && hasUnreadNotifications;
  const isAlwaysOn = config.idleState === 'always-on';
  const isDimIdle = config.idleState === 'dim' && !isNotificationActive;
  const isAuraActive = isNotificationActive || isAlwaysOn;

  const ringColor = config.ringColor || '#00FF66';
  const size = config.size || 16;

  // Determine effect class
  const getEffectClass = (effect: RingEffect) => {
    switch (effect) {
      case 'pulse':
        return 'animate-ring-pulse';
      case 'spin':
        return 'animate-ring-spin';
      case 'breathing':
        return 'animate-ring-breathing';
      case 'wave':
        return 'animate-ring-wave';
      case 'draw':
        return 'animate-ring-draw';
      case 'static':
      default:
        return '';
    }
  };

  if (config.position === 'teardrop') {
    return (
      <div className="flex flex-col items-center justify-start pointer-events-auto">
        <div
          onClick={onCameraTap}
          title="Cámara frontal (toca para probar notificación)"
          className="relative cursor-pointer transition-transform hover:scale-105"
        >
          {/* Teardrop notch outline */}
          <div
            className="w-10 h-7 bg-black rounded-b-full flex items-center justify-center -mt-1 shadow-md border-b border-white/20"
            style={{
              boxShadow: isAuraActive
                ? `0 4px 14px ${ringColor}`
                : isDimIdle
                ? `0 2px 8px ${ringColor}40`
                : undefined,
            }}
          >
            <div
              className="rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center"
              style={{ width: size, height: size }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#151c2e] border border-[#0d121c]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onCameraTap}
      title="Cámara Punch-Hole (Toca para probar o inspeccionar)"
      className="relative flex items-center justify-center cursor-pointer pointer-events-auto z-30"
      style={{
        width: size + 16,
        height: size + 16,
      }}
    >
      {/* Sutil halo atenuado (a media prendida) cuando no hay alerta pero está en modo dim */}
      {isDimIdle && (
        <div
          className="absolute rounded-full pointer-events-none transition-all duration-500"
          style={{
            width: size + 4,
            height: size + 4,
            border: `1.5px solid ${ringColor}50`,
            boxShadow: `0 0 6px ${ringColor}40`,
          }}
        />
      )}

      {/* Dynamic Aura / Glow Ring when fully active */}
      {isAuraActive && (
        <>
          {/* Outer Wave effect if selected */}
          {config.ringEffect === 'wave' && (
            <div
              className="absolute rounded-full pointer-events-none animate-ring-wave"
              style={{
                width: size + 14,
                height: size + 14,
                border: `2px solid ${ringColor}`,
              }}
            />
          )}

          {/* Sweeping spin gradient if 'spin' */}
          {config.ringEffect === 'spin' ? (
            <div
              className="absolute rounded-full pointer-events-none animate-ring-spin"
              style={{
                width: size + 8,
                height: size + 8,
                background: `conic-gradient(from 0deg, transparent 0%, ${ringColor} 70%, #ffffff 100%)`,
                padding: '2px',
              }}
            >
              <div className="w-full h-full bg-black rounded-full" />
            </div>
          ) : config.ringEffect === 'draw' ? (
            /* Circle forming / drawing svg animation */
            <svg
              className="absolute pointer-events-none animate-ring-draw"
              style={{
                width: size + 10,
                height: size + 10,
              }}
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={ringColor}
                strokeWidth="3"
                strokeDasharray="60"
                strokeDashoffset="20"
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 4px ${ringColor})`,
                }}
              />
            </svg>
          ) : (
            /* Pulsing or breathing or static ring */
            <div
              className={`absolute rounded-full pointer-events-none ${getEffectClass(config.ringEffect)}`}
              style={{
                width: size + 6,
                height: size + 6,
                border: `2px solid ${ringColor}`,
                color: ringColor,
                boxShadow: `0 0 12px ${ringColor}, 0 0 20px ${ringColor}80, inset 0 0 4px ${ringColor}60`,
              }}
            />
          )}
        </>
      )}

      {/* Physical Camera Lens Cutout */}
      <div
        className="rounded-full bg-[#030303] flex items-center justify-center shadow-inner relative z-10"
        style={{
          width: size,
          height: size,
          border: '1px solid #1a1a1a',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#0a1525] border border-[#1b2b45] shadow-xs" />
      </div>
    </div>
  );
};
