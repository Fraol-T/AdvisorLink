
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { submitGroupTitleAction, type TitleSubmissionState } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Edit3, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const initialState: TitleSubmissionState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
      Submit Title
    </Button>
  );
}

export function SubmissionForm() {
  const [state, formAction] = useActionState(submitGroupTitleAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
            <Edit3 className="mr-2 h-6 w-6 text-primary" />
            Submit Group Project Title
        </CardTitle>
        <CardDescription>
          Fill in the details for your group&apos;s project title submission.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="font-semibold">Group Name</Label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="e.g., The Innovators, Team Alpha"
              aria-required="true"
              className={state.errors?.groupName ? "border-destructive" : ""}
            />
            {state.errors?.groupName && <p className="text-sm text-destructive">{state.errors.groupName[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectTitle" className="font-semibold">Project Title</Label>
            <Input
              id="projectTitle"
              name="projectTitle"
              placeholder="e.g., AI-Powered Student Collaboration Platform"
              aria-required="true"
              className={state.errors?.projectTitle ? "border-destructive" : ""}
            />
            {state.errors?.projectTitle && <p className="text-sm text-destructive">{state.errors.projectTitle[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="members" className="font-semibold">Group Members (comma-separated emails)</Label>
            <Input
              id="members"
              name="members"
              placeholder="e.g., member1@example.com, member2@example.com"
              aria-required="true"
              className={state.errors?.members ? "border-destructive" : ""}
            />
            {state.errors?.members && <p className="text-sm text-destructive">{state.errors.members[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">Brief Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A short summary of your project..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <SubmitButton />
           {state.message && (
            <Alert variant={state.success ? "default" : "destructive"} className={`w-full ${state.success ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700' : ''}`}>
              {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{state.success ? "Success!" : "Error"}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
