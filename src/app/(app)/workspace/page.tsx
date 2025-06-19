
import { KanbanBoard } from "./components/kanban-board";

export default function WorkspacePage() {
  return (
    <div className="container mx-auto py-8 h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-headline md:text-4xl">
          Project Kanban Board
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Organize and track your project tasks.
        </p>
      </header>
      <KanbanBoard />
    </div>
  );
}
