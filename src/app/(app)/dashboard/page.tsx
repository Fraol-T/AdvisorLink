
import { GanttChart } from "./components/gantt-chart";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline md:text-5xl">
          Project Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          An overview of your project's progress and timeline.
        </p>
      </header>
      
      <section>
        <GanttChart />
      </section>
    </div>
  );
}
