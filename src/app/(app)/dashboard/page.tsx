import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline md:text-5xl">
          Welcome to AdvisorLink
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Your central hub for university project collaboration.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Users className="mr-3 h-7 w-7 text-primary" />
              Collaborative Workspace
            </CardTitle>
            <CardDescription>
              Engage in real-time with your project group and advisors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Collaborative Workspace" 
              width={600} 
              height={400} 
              className="mb-4 rounded-md"
              data-ai-hint="team collaboration" 
            />
            <p className="mb-4 text-sm text-muted-foreground">
              Shared editing, version history, and task management all in one place.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/workspace">Go to Workspace <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <MessageSquare className="mr-3 h-7 w-7 text-primary" />
              Instant Chat
            </CardTitle>
            <CardDescription>
              Communicate instantly with your team and advisors.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="Instant Chat" 
              width={600} 
              height={400} 
              className="mb-4 rounded-md"
              data-ai-hint="chat bubbles"
            />
            <p className="mb-4 text-sm text-muted-foreground">
              Quickly resolve queries, share ideas, and stay connected.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/chat">Open Chat <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <FileText className="mr-3 h-7 w-7 text-primary" />
              Document Hub
            </CardTitle>
            <CardDescription>
              Share, organize, and manage all your project documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Document Hub" 
              width={600} 
              height={400} 
              className="mb-4 rounded-md"
              data-ai-hint="files folders"
            />
            <p className="mb-4 text-sm text-muted-foreground">
              Securely store and access your files from anywhere, anytime.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/documents">Manage Documents <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Get Started</h2>
        <p className="mt-3 text-md text-muted-foreground">
          Navigate using the sidebar or jump directly into a feature.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/submit-title">Submit Your Project Title</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/advisor-suggestion">Find an Advisor (Faculty)</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}