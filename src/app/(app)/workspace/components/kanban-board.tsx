
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { KanbanColumn } from './kanban-column';
import { AddTaskDialog } from './add-task-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface Column {
  id: string;
  title: string;
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Project Proposal Draft', description: 'Complete the first draft of the project proposal document, including scope, objectives, and methodology.', columnId: 'todo', priority: 'high', tags: ['writing', 'planning'] },
  { id: 'task-2', title: 'Literature Review - Phase 1', description: 'Gather and review 10 key academic papers related to the project topic.', columnId: 'todo', priority: 'medium', tags: ['research'] },
  { id: 'task-3', title: 'Setup Development Environment', description: 'Install all necessary software, libraries, and tools for development.', columnId: 'inprogress', priority: 'high', tags: ['setup', 'dev'] },
  { id: 'task-4', title: 'Initial UI Mockups Design', description: 'Create basic wireframes and mockups for the main application screens.', columnId: 'todo', priority: 'medium', tags: ['design', 'ux'] },
  { id: 'task-5', title: 'User Persona Definition', description: 'Define 2-3 target user personas based on initial research.', columnId: 'done', priority: 'low', tags: ['research', 'ux'] },
  { id: 'task-6', title: 'API Endpoint Specification', description: 'Document the required API endpoints, request/response formats.', columnId: 'inprogress', priority: 'medium', tags: ['api', 'dev'] },
  { id: 'task-7', title: 'Weekly Progress Report', description: 'Prepare and submit the weekly progress report to the advisor.', columnId: 'review', priority: 'medium', tags: ['reporting'] },
];


export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem('kanbanTasks');
      return savedTasks ? JSON.parse(savedTasks) : initialTasks;
    }
    return initialTasks;
  });
  const [columns] = useState<Column[]>(initialColumns);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (newTask: Omit<Task, 'id' | 'columnId'>) => {
    setTasks(prevTasks => [
      ...prevTasks,
      { ...newTask, id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, columnId: 'todo' },
    ]);
  };

  const moveTask = (taskId: string, targetColumnId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, columnId: targetColumnId } : task
      )
    );
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  const resetBoard = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('kanbanTasks');
    }
    setTasks(initialTasks);
  }

  if (!isMounted) {
    // Render nothing or a loading indicator on the server or before hydration
    return <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto p-1">
        {columns.map(column => (
            <div key={column.id} className="bg-muted/50 rounded-lg p-4 min-w-[300px] flex flex-col">
                <h2 className="text-xl font-semibold mb-4 text-primary font-headline">{column.title}</h2>
                 <div className="space-y-3 animate-pulse">
                    <div className="h-20 bg-card/50 rounded-md"></div>
                    <div className="h-20 bg-card/50 rounded-md"></div>
                 </div>
            </div>
        ))}
    </div>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="mb-6 flex justify-between items-center">
        <AddTaskDialog onAddTask={addTask} />
        <Button variant="outline" onClick={resetBoard} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Board
        </Button>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto p-1">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks.filter(task => task.columnId === column.id)}
            allColumns={columns}
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            isFirstColumn={index === 0}
            isLastColumn={index === columns.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
