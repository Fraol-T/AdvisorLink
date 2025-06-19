
"use client";

import type { Task, Column } from './kanban-board';
import { KanbanTaskCard } from './kanban-task-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  allColumns: Column[];
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isFirstColumn: boolean;
  isLastColumn: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  allColumns,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
  isFirstColumn,
  isLastColumn,
}: KanbanColumnProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 flex flex-col h-full min-w-[300px] max-h-[calc(100vh-18rem)] shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-primary font-headline sticky top-0 bg-muted/50 py-2 z-10">
        {column.title} ({tasks.length})
      </h2>
      <ScrollArea className="flex-grow pr-3 -mr-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                allColumns={allColumns}
                onMoveTask={onMoveTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                isFirstColumn={isFirstColumn && column.id === allColumns[0].id}
                isLastColumn={isLastColumn && column.id === allColumns[allColumns.length - 1].id}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
