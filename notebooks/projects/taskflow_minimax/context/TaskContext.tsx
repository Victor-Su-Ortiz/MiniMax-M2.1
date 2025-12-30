'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Task, User, Toast, TaskStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // You'll need uuid installed or replace with simple random string

// Simple ID generator if uuid not installed
const generateId = () => Math.random().toString(36).substring(2, 9);

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design System Audit',
    description: 'Review current color palette and typography',
    status: 'done',
    priority: 'high',
    dueDate: '2023-10-15',
    assignee: { id: 'u1', name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=1' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Connect frontend to the new REST API endpoints',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2023-10-24',
    assignee: { id: 'u2', name: 'Sarah Jones', avatar: 'https://i.pravatar.cc/150?u=2' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'User Onboarding Flow',
    description: 'Create wireframes for the new signup process',
    status: 'backlog',
    priority: 'medium',
    assignee: { id: 'u3', name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=3' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Fix Navigation Bug',
    description: 'Mobile menu closes unexpectedly on scroll',
    status: 'todo',
    priority: 'low',
    dueDate: '2023-10-25',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Q4 Marketing Strategy',
    description: 'Prepare documents for the Q4 planning meeting',
    status: 'backlog',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
];

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('taskflow-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(INITIAL_TASKS);
    }
    setMounted(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task created successfully', 'success');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task deleted', 'info');
  };

  const moveTask = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    addToast('Task status updated', 'success');
  };

  const addToast = (message: string, type: Toast['type']) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, toasts, addToast, removeToast }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within TaskProvider');
  return context;
};