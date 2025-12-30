'use client';

import { useTask } from '@/context/TaskContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useTask();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/90 backdrop-blur-lg border border-white/10 shadow-xl animate-slide-in-right pointer-events-auto min-w-[300px]",
          )}
        >
          {icons[toast.type]}
          <span className="text-sm text-slate-200 font-medium">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-auto text-xs text-slate-500 hover:text-slate-300"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}