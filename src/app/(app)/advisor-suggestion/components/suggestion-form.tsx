
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { suggestAdvisorsAction, type SuggestionState, type AdvisorSuggestion } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, UserCheck, Info } from "lucide-react";

const initialState: SuggestionState = {
  message: null,
  suggestions: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Get Suggestions
    </Button>
  );
}

export function SuggestionForm() {
  const [state, formAction] = useActionState(suggestAdvisorsAction, initialState);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-primary" />
          AI Advisor Suggestion
        </CardTitle>
        <CardDescription>
          Enter your project topic and optional keywords to get AI-powered advisor suggestions.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="font-semibold">Project Topic / Abstract</Label>
            <Textarea
              id="topic"
              name="topic"
              placeholder="e.g., Developing a machine learning model for sentiment analysis of social media data..."
              rows={4}
              aria-required="true"
              className={state.errors?.topic ? "border-destructive" : ""}
            />
            {state.errors?.topic && <p className="text-sm text-destructive">{state.errors.topic[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords" className="font-semibold">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="e.g., NLP, Python, Deep Learning, Social Media Analytics"
              className={state.errors?.keywords ? "border-destructive" : ""}
            />
            {state.errors?.keywords && <p className="text-sm text-destructive">{state.errors.keywords[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <SubmitButton />
          {state.message && !state.suggestions && (
            <Alert variant={state.errors ? "destructive" : "default"} className="w-full">
              <Info className="h-4 w-4" />
              <AlertTitle>{state.errors ? "Error" : "Information"}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>

      {state.suggestions && state.suggestions.length > 0 && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-4 font-headline">Suggested Advisors:</h3>
          <Alert variant="default" className="mb-6 bg-primary/5 border-primary/20">
             <Info className="h-4 w-4 text-primary" />
             <AlertTitle className="text-primary">Note</AlertTitle>
             <AlertDescription className="text-primary/80">{state.message}</AlertDescription>
          </Alert>
          <div className="space-y-4">
            {state.suggestions.map((advisor, index) => (
              <Card key={index} className="bg-card/50 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center font-headline">
                    <UserCheck className="mr-2 h-5 w-5 text-accent" />
                    {advisor.name}
                  </CardTitle>
                  <CardDescription>Expertise: {advisor.expertise}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm"><strong>Availability:</strong> {advisor.availability}</p>
                  {advisor.reason && <p className="text-sm mt-1 text-muted-foreground italic"><strong>Reason:</strong> {advisor.reason}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {state.suggestions && state.suggestions.length === 0 && state.message && !state.errors && (
         <div className="p-6 border-t">
            <Alert variant="default" className="w-full">
                <Info className="h-4 w-4" />
                <AlertTitle>No Suggestions Found</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
         </div>
      )}
    </Card>
  );
}
