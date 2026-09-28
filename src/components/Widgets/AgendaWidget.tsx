import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { WidgetBorderStyle, WidgetBgStyle } from '../../types/launcher';
import { getWidgetContainerStyle } from '../../utils/widgetStyles';

interface AgendaWidgetProps {
  accentColor: string;
  borderStyle?: WidgetBorderStyle;
  bgStyle?: WidgetBgStyle;
}

interface Task {
  id: string;
  time: string;
  title: string;
  completed: boolean;
}

export const AgendaWidget: React.FC<AgendaWidgetProps> = ({
  accentColor,
  borderStyle = 'none',
  bgStyle = 'black',
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', time: '10:00', title: 'Reunión de Diseño UI/UX', completed: true },
    { id: '2', time: '14:30', title: 'Revisión código Onyx Launcher', completed: false },
    { id: '3', time: '18:00', title: 'Gimnasio & Cardio', completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const container = getWidgetContainerStyle(borderStyle, bgStyle, accentColor);

  return (
    <div
      className={`w-full p-3 rounded-2xl flex flex-col gap-2 select-none transition-all ${container.className}`}
      style={container.style}
    >
      <div className="flex items-center justify-between text-xs text-white/50 font-mono pb-1 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} color={accentColor} />
          <span className="font-semibold text-white/80">Agenda de Hoy</span>
        </div>
        <span>{tasks.filter(t => t.completed).length}/{tasks.length}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              {task.completed ? (
                <CheckCircle2 size={13} color={accentColor} className="shrink-0" />
              ) : (
                <Circle size={13} className="text-white/40 shrink-0" />
              )}
              <span
                className={`text-xs truncate ${
                  task.completed ? 'line-through text-white/40' : 'text-white/90'
                }`}
              >
                {task.title}
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/40 shrink-0 ml-2">
              {task.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
