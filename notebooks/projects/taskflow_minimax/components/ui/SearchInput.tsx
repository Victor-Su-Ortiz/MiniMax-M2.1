'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn(
      "relative flex items-center transition-all duration-300 rounded-xl bg-slate-800/50 border",
      isFocused ? "border-indigo-500/50 ring-4 ring-indigo-500/10" : "border-slate-700/50",
      className
    )}>
      <Search className="absolute left-3 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search tasks..."
        className="w-full py-2 pl-10 pr-4 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500"
      />
    </div>
  );
}