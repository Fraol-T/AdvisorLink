"use server";

import { z } from "zod";
// To use actual Genkit flows, uncomment the import and runFlow call.
// import { runFlow } from '@genkit-ai/next/server';
// import { advisorSuggestionFlow } from '@/ai/flows/advisorSuggestion'; // Assumed flow

export interface AdvisorSuggestion {
  name: string;
  expertise: string;
  availability: string;
  reason?: string;
}

export interface SuggestionState {
  message?: string | null;
  suggestions?: AdvisorSuggestion[] | null;
  errors?: {
    topic?: string[];
    keywords?: string[];
  };
}

const SuggestionSchema = z.object({
  topic: z.string().min(5, { message: "Project topic must be at least 5 characters." }),
  keywords: z.string().optional(),
});

export async function suggestAdvisorsAction(prevState: SuggestionState, formData: FormData): Promise<SuggestionState> {
  const validatedFields = SuggestionSchema.safeParse({
    topic: formData.get('topic'),
    keywords: formData.get('keywords'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input.',
      suggestions: null,
    };
  }

  const { topic, keywords } = validatedFields.data;

  try {
    // const result = await runFlow(advisorSuggestionFlow, { topic, keywords });
    // Using mocked response as actual flow integration is external
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    const mockSuggestions: AdvisorSuggestion[] = [
      { name: 'Dr. Eleanor Vance', expertise: 'Machine Learning, NLP', availability: 'High', reason: 'Extensive publications in NLP relevant to your topic.' },
      { name: 'Prof. Samuel Green', expertise: 'Distributed Systems, Cloud Computing', availability: 'Medium', reason: 'Oversees the university cloud infrastructure project.' },
      { name: 'Dr. Olivia Chen', expertise: 'Human-Computer Interaction, UX Design', availability: 'High', reason: 'Currently mentoring two projects on similar UX challenges.' },
    ];
    
    // Filter mock suggestions if keywords are provided (simple match)
    let filteredSuggestions = mockSuggestions;
    if (keywords) {
      const searchTerms = keywords.toLowerCase().split(',').map(term => term.trim()).filter(term => term);
      if (searchTerms.length > 0) {
        filteredSuggestions = mockSuggestions.filter(s => 
          searchTerms.some(term => 
            s.expertise.toLowerCase().includes(term) || 
            s.name.toLowerCase().includes(term) ||
            (s.reason && s.reason.toLowerCase().includes(term))
          )
        );
      }
    }


    if (filteredSuggestions.length === 0 && mockSuggestions.length > 0) {
         return { message: `No specific matches for keywords, but here are general suggestions for topic: ${topic}.`, suggestions: mockSuggestions };
    }


    return { message: `Successfully generated advisor suggestions for topic: ${topic}.`, suggestions: filteredSuggestions };
  } catch (error) {
    console.error("Error in suggestAdvisorsAction:", error);
    return { message: "An error occurred while generating suggestions. Please try again.", suggestions: null };
  }
}


export interface TitleSubmissionState {
  message?: string | null;
  errors?: {
    groupName?: string[];
    projectTitle?: string[];
    members?: string[];
  };
  success?: boolean;
}

const TitleSubmissionSchema = z.object({
  groupName: z.string().min(3, "Group name must be at least 3 characters."),
  projectTitle: z.string().min(10, "Project title must be at least 10 characters."),
  members: z.string().min(1, "At least one member email is required.").refine(val => val.split(',').every(email => z.string().email().safeParse(email.trim()).success), "Please provide valid email addresses, separated by commas."),
  description: z.string().optional(),
});


export async function submitGroupTitleAction(prevState: TitleSubmissionState, formData: FormData): Promise<TitleSubmissionState> {
  const validatedFields = TitleSubmissionSchema.safeParse({
    groupName: formData.get('groupName'),
    projectTitle: formData.get('projectTitle'),
    members: formData.get('members'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input.',
      success: false,
    };
  }
  
  const { groupName, projectTitle, members, description } = validatedFields.data;

  // Simulate database operation
  console.log("Submitting group title:", { groupName, projectTitle, members, description });
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { message: `Project title "${projectTitle}" for group "${groupName}" submitted successfully!`, success: true };
}