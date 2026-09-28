import React, { useState } from 'react';
import { Search, Globe, ArrowRight } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface SearchWidgetProps {
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
  onSearchSubmit: (query: string) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  accentColor,
  borderStyle = 'subtle',
  bgStyle = 'black',
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex items-center rounded-full px-3.5 py-2.5 transition-all shadow-lg ${container.className}`}
      style={container.style}
    >
      <Search size={16} className="text-white/60 mr-2.5 shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar en la web..."
        className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none font-sans"
      />
      {query ? (
        <button
          type="submit"
          className="p-1 rounded-full text-black bg-white transition-transform active:scale-90"
        >
          <ArrowRight size={13} />
        </button>
      ) : (
        <Globe size={14} className="text-white/30 ml-1" />
      )}
    </form>
  );
};
