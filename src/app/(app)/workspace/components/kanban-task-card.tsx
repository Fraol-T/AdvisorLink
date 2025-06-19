
"use client";

import type { Task, Column } from './kanban-board';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Edit2, Trash2, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTaskDialog } from './add-task-dialog'; // For editing
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface KanbanTaskCardProps {
  task: Task;
  allColumns: Column[];
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isFirstColumn: boolean;
  isLastColumn: boolean;
}

export function KanbanTaskCard({
  task,
  allColumns,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
  isFirstColumn,
  isLastColumn,
}: KanbanTaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const currentColumnIndex = allColumns.findIndex(col => col.id === task.columnId);

  const handleMoveLeft = () => {
    if (currentColumnIndex > 0) {
      onMoveTask(task.id, allColumns[currentColumnIndex - 1].id);
    }
  };

  const handleMoveRight = () => {
    if (currentColumnIndex < allColumns.length - 1) {
      onMoveTask(task.id, allColumns[currentColumnIndex + 1].id);
    }
  };
  
  const getPriorityBadgeVariant = (priority?: 'low' | 'medium' | 'high'): "secondary" | "default" | "destructive" => {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const getPriorityBadgeClass = (priority?: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-500';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/30 dark:text-yellow-300 dark:border-yellow-500';
      case 'high': return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-700/30 dark:text-red-300 dark:border-red-500';
      default: return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-500';
    }
  }


  return (
    <>
      <Card className="bg-card hover:shadow-lg transition-shadow duration-200 relative group">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base font-semibold flex justify-between items-start">
            {task.title}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Task
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task &quot;{task.title}&quot;.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteTask(task.id)} className={getPriorityBadgeClass('high').replace('bg-', 'bg-destructive-').replace('text-', 'text-destructive-foreground')}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          {task.description && (
            <CardDescription className="text-xs leading-relaxed">{task.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags && task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0.5">{tag}</Badge>
            ))}
          </div>
          {task.priority && (
             <Badge 
                variant={getPriorityBadgeVariant(task.priority)} 
                className={`text-xs px-1.5 py-0.5 capitalize ${getPriorityBadgeClass(task.priority)}`}
             >
                {task.priority} priority
            </Badge>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center p-2 border-t bg-muted/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMoveLeft}
            disabled={currentColumnIndex === 0 || isFirstColumn}
            aria-label="Move task left"
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">{allColumns[currentColumnIndex].title}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMoveRight}
            disabled={currentColumnIndex === allColumns.length - 1 || isLastColumn}
            aria-label="Move task right"
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      {isEditDialogOpen && (
        <AddTaskDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onAddTask={(updatedData) => {
            onUpdateTask({ ...task, ...updatedData });
            setIsEditDialogOpen(false);
          }}
          existingTask={task}
        />
      )}
    </>
  );
}
