'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { KanbanColumn } from '@/components/tasks/KanbanColumn';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Filter } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { AddTaskForm } from '@/components/tasks/AddTaskForm';

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'backlog', title: 'Backlog' },
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' },
];

export default function TaskBoardPage() {
  const { tasks } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Board</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage and organize your workflow</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-full sm:w-64">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="relative group">
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <div className="absolute right-0 top-full mt-2 w-40 py-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button 
                onClick={() => setPriorityFilter('all')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${priorityFilter === 'all' ? 'text-indigo-400' : 'text-slate-300'}`}
              >
                All Priorities
              </button>
              <button 
                onClick={() => setPriorityFilter('high')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${priorityFilter === 'high' ? 'text-indigo-400' : 'text-slate-300'}`}
              >
                High Priority
              </button>
              <button 
                onClick={() => setPriorityFilter('medium')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${priorityFilter === 'medium' ? 'text-indigo-400' : 'text-slate-300'}`}
              >
                Medium Priority
              </button>
              <button 
                onClick={() => setPriorityFilter('low')}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${priorityFilter === 'low' ? 'text-indigo-400' : 'text-slate-300'}`}
              >
                Low Priority
              </button>
            </div>
          </div>

          <Button onClick={() => setIsModalOpen(true)}>
            <span className="sm:hidden">+</span>
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max lg:min-w-0 h-full">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={filteredTasks.filter(t => t.status === column.status)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <AddTaskForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}