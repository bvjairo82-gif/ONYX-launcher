import React, { useState } from 'react';
import { FileEdit, Check } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface QuickNotesWidgetProps {
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
}

export const QuickNotesWidget: React.FC<QuickNotesWidgetProps> = ({
  accentColor,
  borderStyle = 'none',
  bgStyle = 'black',
}) => {
  const [note, setNote] = useState<string>('Nota rápida: modo OLED ahorra hasta 40% de batería con píxeles apagados.');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  return (
    <div
      className={`w-full p-3 rounded-2xl flex flex-col gap-2 select-none transition-all ${container.className}`}
      style={container.style}
    >
      <div className="flex items-center justify-between text-xs text-white/50 font-mono pb-1 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <FileEdit size={12} color={accentColor} />
          <span className="font-semibold text-white/80">Nota Rápida</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-[10px] text-white/60 hover:text-white flex items-center gap-1"
        >
          {isEditing ? (
            <>
              <Check size={10} color={accentColor} /> Listo
            </>
          ) : (
            'Editar'
          )}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full bg-white/5 text-xs text-white rounded p-1.5 outline-none border border-white/20 resize-none font-sans"
        />
      ) : (
        <p className="text-xs text-white/80 italic font-sans leading-relaxed line-clamp-2">
          &quot;{note}&quot;
        </p>
      )}
    </div>
  );
};
