
"use client";

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import type { Task } from './kanban-board';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddTaskDialogProps {
  onAddTask: (taskData: Omit<Task, 'id' | 'columnId'>) => void;
  existingTask?: Task;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTaskDialog({ onAddTask, existingTask, isOpen, onOpenChange }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState('');
  
  const [internalOpen, setInternalOpen] = useState(false);

  const currentIsOpen = isOpen !== undefined ? isOpen : internalOpen;
  const setCurrentIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;


  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setPriority(existingTask.priority || 'medium');
      setTags(existingTask.tags?.join(', ') || '');
    } else {
      // Reset for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags('');
    }
  }, [existingTask, currentIsOpen]); // Depend on currentIsOpen to reset form when dialog opens for a new task

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        // Basic validation, can be enhanced
        alert("Title is required.");
        return;
    }
    onAddTask({ 
        title, 
        description: description.trim() ? description : undefined,
        priority,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag) 
    });
    setCurrentIsOpen(false); // Close dialog after submission
  };

  const dialogTitle = existingTask ? "Edit Task" : "Add New Task";
  const dialogDescription = existingTask ? "Update the details of this task." : "Fill in the details for your new task.";
  const buttonText = existingTask ? "Save Changes" : "Add Task";

  const dialogContent = (
    <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle className="font-headline">{dialogTitle}</DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Design new homepage"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Add more details about the task..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3"
              placeholder="e.g., design, frontend, bug (comma-separated)"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">{buttonText}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  // If isOpen and onOpenChange are managed externally (like for editing), use that.
  if (isOpen !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }
  
  // Otherwise, use internal state for triggering (like for the "Add New Task" button).
  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
