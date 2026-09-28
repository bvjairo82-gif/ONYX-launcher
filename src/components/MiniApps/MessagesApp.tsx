import React, { useState } from 'react';
import { MessageSquare, Send, ArrowLeft, X } from 'lucide-react';
import { playTapSound } from '../../utils/audio';

interface MessagesAppProps {
  onClose: () => void;
  accentColor: string;
  soundEnabled: boolean;
  onSendSimulationNotification?: (title: string, msg: string) => void;
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export const MessagesApp: React.FC<MessagesAppProps> = ({
  onClose,
  accentColor,
  soundEnabled,
  onSendSimulationNotification,
}) => {
  const [selectedChat, setSelectedChat] = useState<{ id: string; name: string } | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: 'm1', sender: 'other', text: '¡Hola! ¿Probaste el nuevo Onyx Launcher?', time: '14:20' },
      { id: 'm2', sender: 'me', text: 'Sí, la pantalla negra OLED y el aro en la cámara se ven brutales.', time: '14:21' },
      { id: 'm3', sender: 'other', text: '¡Genial! Ahorra mucha batería con los píxeles apagados.', time: '14:22' },
    ],
    '2': [
      { id: 'm4', sender: 'other', text: 'Te envié los diseños del nuevo widget minimalista.', time: 'Ayer' },
    ],
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChat) return;

    playTapSound(soundEnabled);
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }));
    setInputText('');

    // Simulate auto-reply after 2 seconds to test punch-hole notification ring!
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        text: '¡Mensaje recibido! El aro de la cámara debería iluminarse ahora mismo.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), replyMsg],
      }));
      if (onSendSimulationNotification) {
        onSendSimulationNotification(
          selectedChat.name,
          '¡Mensaje recibido! El aro de la cámara parpadea.'
        );
      }
    }, 2200);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          {selectedChat ? (
            <button
              onClick={() => setSelectedChat(null)}
              className="p-1 text-white/70 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <MessageSquare size={18} color={accentColor} />
          )}
          <span className="text-base font-medium">
            {selectedChat ? selectedChat.name : 'Mensajes'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {selectedChat ? (
        /* Conversation view */
        <div className="flex-1 flex flex-col justify-between overflow-hidden pt-2">
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-2">
            {(messages[selectedChat.id] || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'me' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${
                    msg.sender === 'me'
                      ? 'bg-white text-black font-medium'
                      : 'bg-[#151515] border border-white/15 text-white'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'me' ? accentColor : undefined,
                    color: msg.sender === 'me' && accentColor === '#FFFFFF' ? '#000000' : undefined,
                  }}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-white/40 mt-0.5 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-[#111] border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/40 outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-white text-black disabled:opacity-30 active:scale-90 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        /* Chats list */
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-white/5">
          {[
            { id: '1', name: 'Laura Gómez', snippet: 'Ahorra mucha batería...', time: '14:22', unread: 1 },
            { id: '2', name: 'Equipo de Diseño', snippet: 'Te envié los diseños del nuevo widget...', time: 'Ayer', unread: 0 },
          ].map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat({ id: chat.id, name: chat.name })}
              className="py-3 px-2 flex items-center justify-between hover:bg-white/5 cursor-pointer rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-[#111] border flex items-center justify-center font-bold text-sm"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {chat.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{chat.name}</div>
                  <div className="text-xs text-white/40 truncate max-w-[190px]">
                    {chat.snippet}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-white/40 font-mono">{chat.time}</span>
                {chat.unread > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-black"
                    style={{ backgroundColor: accentColor }}
                  >
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
