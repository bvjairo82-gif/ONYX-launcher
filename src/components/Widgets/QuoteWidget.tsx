import React, { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface QuoteWidgetProps {
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
}

const QUOTES = [
  { text: 'La simplicidad es la máxima sofisticación.', author: 'Leonardo da Vinci' },
  { text: 'Menos, pero mejor.', author: 'Dieter Rams' },
  { text: 'El diseño no es solo lo que se ve y siente. El diseño es cómo funciona.', author: 'Steve Jobs' },
  { text: 'El silencio visual es la mejor forma de enfoque.', author: 'Onyx Mind' },
];

export const QuoteWidget: React.FC<QuoteWidgetProps> = ({
  accentColor,
  borderStyle = 'none',
  bgStyle = 'black',
}) => {
  const [index, setIndex] = useState(0);
  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const current = QUOTES[index];

  return (
    <div
      className={`w-full p-3.5 rounded-2xl flex flex-col justify-between gap-2 select-none transition-all ${container.className}`}
      style={container.style}
    >
      <div className="flex items-start justify-between">
        <Quote size={13} color={accentColor} className="opacity-80" />
        <button
          onClick={nextQuote}
          className="text-white/30 hover:text-white transition-colors p-0.5"
          title="Siguiente frase"
        >
          <RefreshCw size={11} />
        </button>
      </div>

      <p className="text-xs font-sans italic text-white/85 leading-snug line-clamp-2">
        &quot;{current.text}&quot;
      </p>

      <span className="text-[10px] font-mono text-white/40 self-end">
        — {current.author}
      </span>
    </div>
  );
};
