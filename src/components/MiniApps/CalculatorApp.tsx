import React, { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { playTapSound } from '../../utils/audio';

interface CalculatorAppProps {
  onClose: () => void;
  accentColor: string;
  soundEnabled: boolean;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({
  onClose,
  accentColor,
  soundEnabled,
}) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    playTapSound(soundEnabled);
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    playTapSound(soundEnabled);
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    playTapSound(soundEnabled);
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOp: string) => {
    playTapSound(soundEnabled);
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          break;
      }

      setPrevValue(newValue);
      setDisplay(String(Number(newValue.toFixed(6))));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleEquals = () => {
    if (!operation || prevValue === null) return;
    performOperation(operation);
    setOperation(null);
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="text-base font-medium flex items-center gap-2">
          <Calculator size={18} color={accentColor} />
          <span>Calculadora OLED</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Screen Display */}
      <div className="flex-1 flex flex-col justify-end items-end px-2 py-6">
        {prevValue !== null && operation && (
          <div className="text-sm font-mono text-white/40 mb-1">
            {prevValue} {operation}
          </div>
        )}
        <div className="text-5xl font-mono font-light tracking-tight truncate max-w-full">
          {display}
        </div>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-4 gap-2.5 pb-2">
        <button
          onClick={clearAll}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white/80 font-mono text-lg font-bold border border-white/10 active:scale-95 transition-all"
        >
          AC
        </button>
        <button
          onClick={toggleSign}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white/80 font-mono text-lg border border-white/10 active:scale-95 transition-all"
        >
          ±
        </button>
        <button
          onClick={handlePercent}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white/80 font-mono text-lg border border-white/10 active:scale-95 transition-all"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white font-mono text-2xl border border-white/20 active:scale-95 transition-all"
          style={{ borderColor: operation === '÷' ? accentColor : undefined }}
        >
          ÷
        </button>

        <button
          onClick={() => inputDigit('7')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          9
        </button>
        <button
          onClick={() => performOperation('×')}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white font-mono text-2xl border border-white/20 active:scale-95 transition-all"
          style={{ borderColor: operation === '×' ? accentColor : undefined }}
        >
          ×
        </button>

        <button
          onClick={() => inputDigit('4')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          6
        </button>
        <button
          onClick={() => performOperation('-')}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white font-mono text-2xl border border-white/20 active:scale-95 transition-all"
          style={{ borderColor: operation === '-' ? accentColor : undefined }}
        >
          -
        </button>

        <button
          onClick={() => inputDigit('1')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          3
        </button>
        <button
          onClick={() => performOperation('+')}
          className="h-14 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white font-mono text-2xl border border-white/20 active:scale-95 transition-all"
          style={{ borderColor: operation === '+' ? accentColor : undefined }}
        >
          +
        </button>

        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all pl-6 text-left"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="h-14 rounded-2xl bg-[#0c0c0c] hover:bg-[#1a1a1a] text-white font-mono text-xl border border-white/10 active:scale-95 transition-all"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-14 rounded-2xl text-black font-mono text-2xl font-bold active:scale-95 transition-all shadow-lg"
          style={{ backgroundColor: accentColor }}
        >
          =
        </button>
      </div>
    </div>
  );
};
