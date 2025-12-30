'use client';

import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { useTask } from '@/context/TaskContext';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function KanbanColumn({ status, title, tasks, onDragStart }: KanbanColumnProps) {
  const { moveTask } = useTask();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  return (
    <div 
      className="flex flex-col h-full min-w-[300px] w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-200">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 font-medium border border-white/5">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className={cn(
        "flex-1 rounded-xl p-3 transition-colors duration-200 min-h-[150px]",
        "bg-slate-900/30 border border-dashed border-white/5 hover:border-white/10"
      )}>
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDragStart={onDragStart} 
            />
          ))}
          {tasks.length === 0 && (
            <div className="h-24 flex items-center justify-center text-slate-600 text-sm border border-dashed border-slate-800 rounded-lg">
              Drop items here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}