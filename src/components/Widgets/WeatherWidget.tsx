import React from 'react';
import { Sun, Wind, Droplets } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface WeatherWidgetProps {
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
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
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-xl bg-black border border-white/20 flex items-center justify-center shrink-0"
          style={{ borderColor: accentColor }}
        >
          <Sun size={20} color={accentColor} />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-sans text-white">22°C</span>
            <span className="text-xs text-white/50">Despejado</span>
          </div>
          <div className="text-[11px] text-white/40">Madrid · Mín 15° / Máx 24°</div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-white/50 font-mono">
        <div className="flex items-center gap-1">
          <Droplets size={12} className="opacity-70" />
          <span>45%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind size={12} className="opacity-70" />
          <span>12km/h</span>
        </div>
      </div>
    </div>
  );
};
