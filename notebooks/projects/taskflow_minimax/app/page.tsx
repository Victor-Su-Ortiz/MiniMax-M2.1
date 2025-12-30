'use client';

import { useTask } from '@/context/TaskContext';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

function StatCard({ title, value, icon: Icon, color, suffix }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 group">
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-xl transition-transform group-hover:scale-150 duration-500",
        color
      )} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2 tracking-tight animate-count-up">
            {value}{suffix && <span className="text-lg text-slate-500 font-normal ml-1">{suffix}</span>}
          </h3>
        </div>
        <div className={cn("p-3 rounded-xl", `bg-${color.split('-')[1]}-500/10`)}>
          <Icon className={cn("w-6 h-6", `text-${color.split('-')[1]}-400`)} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { tasks } = useTask();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Recent activity (mocked based on tasks)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={total} icon={ListTodo} color="bg-blue-500" />
        <StatCard title="In Progress" value={inProgress} icon={Clock} color="bg-purple-500" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Overdue" value={overdue} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Task Completion</h2>
            <span className="text-2xl font-bold text-white">{completionRate}%</span>
          </div>
          
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Backlog</p>
              <p className="text-xl font-semibold text-white">
                {tasks.filter(t => t.status === 'backlog').length}
              </p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">To Do</p>
              <p className="text-xl font-semibold text-white">
                {tasks.filter(t => t.status === 'todo').length}
              </p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Done</p>
              <p className="text-xl font-semibold text-white">
                {tasks.filter(t => t.status === 'done').length}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 group">
                <div className="mt-1">
                  {task.assignee ? (
                    <Avatar name={task.assignee.name} src={task.assignee.avatar} className="w-8 h-8" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">
                    <span className="font-medium text-white">{task.assignee?.name || 'User'}</span> 
                    {' '}created task{' '}
                    <span className="text-indigo-400 font-medium">{task.title}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(task.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}