
'use server';

import { z } from 'zod';

const currentlyCraftingSchema = z.object({
  title: z.string().max(100, { message: 'Title must be 100 characters or less.' }).optional(), // Allow empty string to "clear"
});

export type CurrentlyCraftingFormValues = z.infer<typeof currentlyCraftingSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
}

export async function updateCurrentlyCraftingTitle(
  values: CurrentlyCraftingFormValues
): Promise<SubmissionResult> {
  const parsedValues = currentlyCraftingSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your input.',
    };
  }

  const { title } = parsedValues.data;

  // --- SIMULATION ---
  // In a real application, you would update this value in the database.
  // For this simulation, we'll just log it and return success.
  console.log('Simulating update for "Currently Crafting" title:');
  console.log('New Title:', title);
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return { 
    success: true, 
    message: `Currently Crafting title (simulated) update successful! ${title ? `Set to "${title}"` : 'Cleared'}. Data logged to console.` 
  };
}
