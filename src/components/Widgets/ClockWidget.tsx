import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface ClockWidgetProps {
  style?: 'digital-clean' | 'dot-matrix' | 'minimal-serif' | 'huge-stacked';
  size?: 'compact' | 'normal' | 'large';
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
  onClick?: () => void;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  style = 'digital-clean',
  size = 'normal',
  accentColor,
  borderStyle = 'none',
  bgStyle = 'black',
  onClick,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const dayName = days[time.getDay()];
  const monthName = months[time.getMonth()];
  const dateNum = time.getDate();

  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  const getFontSize = () => {
    if (size === 'compact') return 'text-4xl';
    if (size === 'large') return 'text-7xl';
    return 'text-6xl';
  };

  if (style === 'huge-stacked') {
    return (
      <div
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center py-3 cursor-pointer select-none rounded-2xl transition-all ${container.className}`}
        style={container.style}
      >
        <div
          className={`${size === 'compact' ? 'text-5xl' : size === 'large' ? 'text-8xl' : 'text-7xl'} font-mono font-bold leading-none tracking-tighter`}
          style={{ color: '#FFFFFF' }}
        >
          {hours}
        </div>
        <div
          className={`${size === 'compact' ? 'text-5xl' : size === 'large' ? 'text-8xl' : 'text-7xl'} font-mono font-bold leading-none tracking-tighter`}
          style={{ color: accentColor }}
        >
          {minutes}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-white/60">
          <span>{dayName}</span>
          <span>·</span>
          <span>{dateNum} {monthName}</span>
        </div>
      </div>
    );
  }

  if (style === 'dot-matrix') {
    return (
      <div
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer select-none transition-all ${container.className}`}
        style={container.style}
      >
        <div
          className={`${size === 'compact' ? 'text-3xl' : size === 'large' ? 'text-5xl' : 'text-4xl'} font-mono tracking-widest font-bold`}
          style={{
            letterSpacing: '0.2em',
            textShadow: `0 0 10px ${accentColor}80`,
            color: accentColor,
          }}
        >
          {hours}:{minutes}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-white/50">
          <span>{dayName.toUpperCase()}</span>
          <span>//</span>
          <span>{dateNum} {monthName.slice(0, 3).toUpperCase()}</span>
        </div>
      </div>
    );
  }

  // Default clean digital
  return (
    <div
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center py-3 cursor-pointer select-none rounded-2xl transition-transform active:scale-[0.98] ${container.className}`}
      style={container.style}
    >
      <div className="flex items-baseline gap-1">
        <span className={`${getFontSize()} font-light tracking-tight text-white font-sans`}>
          {hours}:{minutes}
        </span>
        <span className="text-xs font-mono text-white/40">{seconds}</span>
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-white/60 font-sans tracking-wide">
        <Calendar size={12} className="opacity-70" />
        <span>
          {dayName}, {dateNum} de {monthName}
        </span>
      </div>
    </div>
  );
};
