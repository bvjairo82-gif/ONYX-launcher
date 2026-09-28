import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, X, Check } from 'lucide-react';

interface NotesAppProps {
  onClose: () => void;
  accentColor: string;
}

interface Note {
  id: string;
  title: string;
  body: string;
  date: string;
}

export const NotesApp: React.FC<NotesAppProps> = ({ onClose, accentColor }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('onyx_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: '1',
        title: 'Optimización OLED',
        body: 'El fondo negro puro (#000000) apaga físicamente los subpíxeles orgánicos de la pantalla AMOLED. Esto ahorra energía en un 30% a 50% frente a fondos grises o blancos.',
        date: 'Hoy',
      },
      {
        id: '2',
        title: 'Ideas para el lanzador',
        body: 'Agregar soporte para aros de notificación dinámicos alrededor del punch-hole de la cámara frontal con efecto respiración y colores configurables.',
        date: 'Ayer',
      },
    ];
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    localStorage.setItem('onyx_notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newN: Note = {
      id: Date.now().toString(),
      title: 'Nueva Nota',
      body: '',
      date: 'Ahora',
    };
    setNotes([newN, ...notes]);
    setActiveNote(newN);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(notes.filter((n) => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null);
  };

  const updateCurrentNote = (title: string, body: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, title, body };
    setActiveNote(updated);
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="text-base font-medium flex items-center gap-2">
          <FileText size={18} color={accentColor} />
          <span>Notas OLED</span>
        </div>
        <div className="flex items-center gap-2">
          {!activeNote && (
            <button
              onClick={createNewNote}
              className="p-1 rounded-full text-white/80 hover:text-white"
              title="Nueva nota"
            >
              <Plus size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {activeNote ? (
        /* Edit Note */
        <div className="flex-1 flex flex-col pt-3 gap-2">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateCurrentNote(e.target.value, activeNote.body)}
              placeholder="Título"
              className="text-lg font-bold bg-transparent text-white outline-none w-full"
            />
            <button
              onClick={() => setActiveNote(null)}
              className="text-xs px-2.5 py-1 rounded-full border border-white/20 text-white shrink-0 hover:bg-white/10 flex items-center gap-1"
            >
              <Check size={12} /> Listo
            </button>
          </div>
          <textarea
            value={activeNote.body}
            onChange={(e) => updateCurrentNote(activeNote.title, e.target.value)}
            placeholder="Escribe tu nota aquí..."
            className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/30 outline-none resize-none pt-2 font-sans leading-relaxed"
          />
        </div>
      ) : (
        /* Notes list */
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notes.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-white/30 text-sm gap-2">
              <FileText size={32} className="opacity-20" />
              <span>Sin notas creadas</span>
              <button
                onClick={createNewNote}
                className="text-xs underline text-white/60 hover:text-white"
              >
                Crear primera nota
              </button>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note)}
                className="p-3 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-white/30 cursor-pointer flex items-start justify-between group transition-all"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm font-semibold text-white truncate">
                    {note.title || 'Sin título'}
                  </div>
                  <div className="text-xs text-white/50 line-clamp-2 mt-1">
                    {note.body || 'Nota vacía...'}
                  </div>
                  <div className="text-[10px] text-white/30 mt-2 font-mono">
                    {note.date}
                  </div>
                </div>
                <button
                  onClick={(e) => deleteNote(note.id, e)}
                  className="p-1.5 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
