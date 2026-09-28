import React, { useState } from 'react';
import { Phone, Delete, PhoneCall, Clock, User } from 'lucide-react';
import { playKeypadTone } from '../../utils/audio';

interface PhoneAppProps {
  onClose: () => void;
  accentColor: string;
  soundEnabled: boolean;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ onClose, accentColor, soundEnabled }) => {
  const [number, setNumber] = useState('');
  const [activeTab, setActiveTab] = useState<'keypad' | 'recents'>('keypad');
  const [isCalling, setIsCalling] = useState(false);

  const dialKeys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  const handleKeyPress = (num: string) => {
    if (number.length < 15) {
      setNumber((prev) => prev + num);
      const frequencies: Record<string, number> = {
        '1': 697, '2': 770, '3': 852,
        '4': 697, '5': 770, '6': 852,
        '7': 697, '8': 770, '9': 852,
        '0': 941, '*': 941, '#': 941,
      };
      playKeypadTone(frequencies[num] || 700, soundEnabled);
    }
  };

  const handleBackspace = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number.trim()) {
      setIsCalling(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="text-base font-medium flex items-center gap-2">
          <Phone size={18} color={accentColor} />
          <span>Teléfono</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs px-2.5 py-1 rounded-full border border-white/20 hover:bg-white/10"
        >
          Cerrar
        </button>
      </div>

      {isCalling ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-fade-in">
          <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center animate-pulse">
            <User size={48} className="text-white/70" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono">{number}</div>
            <div className="text-xs text-white/50 mt-1">Llamando... (Simulador)</div>
          </div>
          <button
            onClick={() => setIsCalling(false)}
            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <PhoneCall size={28} className="rotate-135" />
          </button>
        </div>
      ) : activeTab === 'keypad' ? (
        <div className="flex-1 flex flex-col justify-end gap-4 max-w-xs mx-auto w-full py-4">
          {/* Number Display */}
          <div className="h-16 flex items-center justify-center relative">
            <span className="text-3xl font-mono tracking-wider font-light">
              {number || <span className="text-white/20">Ingresar número</span>}
            </span>
            {number && (
              <button
                onClick={handleBackspace}
                className="absolute right-0 p-2 text-white/60 hover:text-white"
              >
                <Delete size={20} />
              </button>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3">
            {dialKeys.map((k) => (
              <button
                key={k.num}
                onClick={() => handleKeyPress(k.num)}
                className="h-16 rounded-full bg-[#111111] hover:bg-[#1a1a1a] active:bg-[#252525] border border-white/10 flex flex-col items-center justify-center transition-all cursor-pointer"
              >
                <span className="text-2xl font-mono font-medium">{k.num}</span>
                {k.letters && (
                  <span className="text-[9px] font-sans text-white/40 tracking-widest">
                    {k.letters}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Call Action Button */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleCall}
              disabled={!number}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                number
                  ? 'bg-white text-black active:scale-95 shadow-lg'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <Phone size={26} />
            </button>
          </div>
        </div>
      ) : (
        /* Recents */
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-white/5">
          {[
            { name: 'Mamá', num: '+34 612 345 678', time: 'Hoy 14:15', type: 'incoming' },
            { name: 'Oficina Central', num: '+34 911 223 344', time: 'Ayer 18:30', type: 'outgoing' },
            { name: 'Alex García', num: '+34 689 001 234', time: '25 Sep', type: 'missed' },
          ].map((c, i) => (
            <div
              key={i}
              onClick={() => {
                setNumber(c.num);
                setActiveTab('keypad');
              }}
              className="py-3 px-2 flex items-center justify-between hover:bg-white/5 cursor-pointer rounded-lg"
            >
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-white/40 font-mono">{c.num}</div>
              </div>
              <span className="text-[11px] text-white/40">{c.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Tabs */}
      <div className="flex items-center justify-around pt-3 border-t border-white/10 text-xs font-mono">
        <button
          onClick={() => setActiveTab('keypad')}
          className={`px-4 py-2 rounded-full ${
            activeTab === 'keypad' ? 'bg-white/10 text-white' : 'text-white/40'
          }`}
        >
          Teclado
        </button>
        <button
          onClick={() => setActiveTab('recents')}
          className={`flex items-center gap-1 px-4 py-2 rounded-full ${
            activeTab === 'recents' ? 'bg-white/10 text-white' : 'text-white/40'
          }`}
        >
          <Clock size={14} /> Recientes
        </button>
      </div>
    </div>
  );
};
