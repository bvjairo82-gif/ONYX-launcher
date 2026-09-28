import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, X, ExternalLink, Search } from 'lucide-react';

interface BrowserAppProps {
  onClose: () => void;
  accentColor: string;
  initialUrl?: string;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({
  onClose,
  accentColor,
  initialUrl = 'https://duckduckgo.com',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputVal.trim();
    if (!target) return;
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
    }
    setUrl(target);
    setInputVal(target);
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const bookmarks = [
    { title: 'DuckDuckGo', url: 'https://duckduckgo.com' },
    { title: 'Wikipedia OLED', url: 'https://es.wikipedia.org' },
    { title: 'Hacker News', url: 'https://news.ycombinator.com' },
    { title: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Top Browser Bar */}
      <div className="p-3 bg-[#0a0a0a] border-b border-white/10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>

          <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#141414] border border-white/20 rounded-full px-3 py-1.5 text-xs">
            <Globe size={13} className="text-white/40 mr-2 shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-transparent text-white outline-none font-mono text-[11px] truncate"
            />
          </form>

          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="p-1.5 text-white/60 hover:text-white"
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Bookmarks bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {bookmarks.map((b) => (
            <button
              key={b.title}
              onClick={() => {
                setUrl(b.url);
                setInputVal(b.url);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 shrink-0 border border-white/10"
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

      {/* Browser Content Area */}
      <div className="flex-1 bg-black flex flex-col items-center justify-center p-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl border border-white/20 flex items-center justify-center mb-4 bg-[#0a0a0a]"
          style={{ borderColor: accentColor }}
        >
          <Globe size={32} color={accentColor} />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Navegación Web Segura</h3>
        <p className="text-xs text-white/50 max-w-xs mb-6">
          URL actual: <span className="font-mono text-white/80">{url}</span>
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
            style={{ backgroundColor: accentColor, color: accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
          >
            <ExternalLink size={14} />
            <span>Abrir en nueva pestaña externa</span>
          </a>

          <button
            onClick={() => {
              const query = prompt('Buscar en la web:');
              if (query) {
                const searchTarget = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                setUrl(searchTarget);
                setInputVal(searchTarget);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-white/20 text-xs text-white hover:bg-white/5 flex items-center justify-center gap-2"
          >
            <Search size={14} />
            <span>Nueva búsqueda rápida</span>
          </button>
        </div>
      </div>
    </div>
  );
};
