'use client';

import { useTask } from '@/context/TaskContext';
import { SearchInput } from '@/ui/SearchInput';
import { Avatar } from '@/ui/Avatar';
import { Bell, Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/ui/Modal';
import { Button } from '@/ui/Button';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';

export function Header() {
  const { addToast } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex-1 max-w-md ml-12 lg:ml-0">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Plus size={16} />
              New Task
            </button>
            <Avatar name="John Doe" src="https://i.pravatar.cc/150?u=99" className="w-8 h-8" />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <AddTaskForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </header>
  );
}