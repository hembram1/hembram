
'use server';

import { z } from 'zod';

const authorBioSchema = z.object({
  name: z.string().min(2),
  bio: z.string().min(50),
});

export type AuthorBioFormValues = z.infer<typeof authorBioSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
}

export async function updateAuthorBio(
  values: AuthorBioFormValues
): Promise<SubmissionResult> {
  const parsedValues = authorBioSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  const { name, bio } = parsedValues.data;

  // --- SIMULATION ---
  // In a real application, you would update the database here (e.g., Firestore).
  // For this simulation, we'll just log it and return success.
  // Modifying src/lib/constants.ts directly at runtime is not feasible or recommended.
  console.log('Simulating update for Author Bio:');
  console.log('Name:', name);
  console.log('Bio:', bio);
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return { 
    success: true, 
    message: 'Author bio (simulated) update successful! Data logged to console.' 
  };
}
