import React from 'react';
import { BatteryCharging, HardDrive, Cpu } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface BatteryWidgetProps {
  batteryLevel: number;
  isCharging: boolean;
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
}

export const BatteryWidget: React.FC<BatteryWidgetProps> = ({
  batteryLevel,
  isCharging,
  accentColor,
  borderStyle = 'none',
  bgStyle = 'black',
}) => {
  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  return (
    <div
      className={`w-full p-3 rounded-2xl flex items-center justify-between select-none transition-all ${container.className}`}
      style={container.style}
    >
      {/* Battery stats */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeDasharray={`${batteryLevel}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke={accentColor}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold text-white">
            {batteryLevel}%
          </span>
        </div>
        <div>
          <div className="text-xs font-semibold text-white flex items-center gap-1">
            <span>Batería OLED</span>
            {isCharging && <BatteryCharging size={12} className="text-green-400" />}
          </div>
          <div className="text-[10px] text-white/50">
            {isCharging ? 'Cargando rápido' : '~18h estimadas'}
          </div>
        </div>
      </div>

      {/* Storage and RAM info */}
      <div className="flex items-center gap-3 text-[11px] font-mono text-white/50">
        <div className="flex items-center gap-1">
          <HardDrive size={12} className="opacity-70" />
          <span>128G / 256G</span>
        </div>
        <div className="flex items-center gap-1">
          <Cpu size={12} className="opacity-70" />
          <span>62°F</span>
        </div>
      </div>
    </div>
  );
};
