'use client';

import { Task } from '@/types';
import { Badge } from '@/ui/Badge';
import { Avatar } from '@/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { Calendar, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={cn(
        "group relative bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-sm border border-white/5 hover:border-indigo-500/30 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5",
        "before:absolute before:inset-0 before:rounded-xl before:ring-1 before:ring-white/5 before:content-[''] before:pointer-events-none"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-slate-200 text-sm leading-snug group-hover:text-white transition-colors">
          {task.title}
        </h4>
        <button className="text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={14} />
        </button>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Badge variant={task.priority} />
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              new Date(task.dueDate) < new Date() ? "text-red-400" : "text-slate-500"
            )}>
              <Calendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar 
            name={task.assignee.name} 
            src={task.assignee.avatar} 
            className="w-6 h-6 text-[10px]" 
          />
        )}
      </div>
    </div>
  );
}