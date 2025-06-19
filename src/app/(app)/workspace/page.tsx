import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Edit, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function WorkspacePage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline md:text-5xl">
          Collaborative Workspace
        </h1>
        <p className="mt-3 text-lg text-muted-foreground md:text-xl">
          Work together seamlessly on your projects.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center font-headline"><Edit className="mr-2 h-5 w-5 text-accent" /> Real-time Document Editing</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/400x300.png" alt="Real-time editing" width={400} height={300} className="rounded-md mb-3" data-ai-hint="document collaboration" />
            <p className="text-sm text-muted-foreground">
              Edit documents simultaneously with your team members. Changes are synced instantly. (Feature under development)
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center font-headline"><Users className="mr-2 h-5 w-5 text-accent" /> Shared Task Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/400x300.png" alt="Task management" width={400} height={300} className="rounded-md mb-3" data-ai-hint="to-do list" />
            <p className="text-sm text-muted-foreground">
              Organize project tasks, assign responsibilities, and track progress together. (Feature under development)
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center font-headline"><MessageCircle className="mr-2 h-5 w-5 text-accent" /> In-context Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/400x300.png" alt="In-context discussions" width={400} height={300} className="rounded-md mb-3" data-ai-hint="comments feedback" />
            <p className="text-sm text-muted-foreground">
              Comment directly on documents and tasks to keep conversations focused. (Feature under development)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 rounded-lg border border-dashed border-primary/50 bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-semibold text-primary font-headline">
          Advanced Collaboration Features Coming Soon!
        </h2>
        <p className="mt-2 text-muted-foreground">
          We are actively developing a rich real-time collaboration experience. Stay tuned for updates!
        </p>
      </div>
    </div>
  );