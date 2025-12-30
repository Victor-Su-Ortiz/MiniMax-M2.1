import { cn } from '@/lib/utils';
import { TaskPriority, TaskStatus } from '@/types';

interface BadgeProps {
  variant: TaskPriority | TaskStatus;
  dot?: boolean;
}

const priorityColors = {
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusColors = {
  backlog: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  todo: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'in-progress': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const labels = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export function Badge({ variant, dot = true }: BadgeProps) {
  // @ts-ignore - Union type check
  const styles = priorityColors[variant] || statusColors[variant];
  const label = labels[variant];

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      styles
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />}
      {label}
    </span>
  );
}