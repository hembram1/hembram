
'use server';

import { z } from 'zod';
import { saveCurrentlyCraftingTitleToStorage } from '@/lib/localStorageUtils';
import type { Author } from '@/lib/types';

const currentlyCraftingSchema = z.object({
  title: z.string().max(100, { message: 'Title must be 100 characters or less.' }).optional(), 
});

export type CurrentlyCraftingFormValues = z.infer<typeof currentlyCraftingSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
  updatedAuthor?: Author;
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

  try {
    const updatedAuthor = saveCurrentlyCraftingTitleToStorage(title || ''); // Pass empty string if title is undefined
    return { 
      success: true, 
      message: `Currently Crafting title updated in localStorage! ${title ? `Set to "${title}"` : 'Cleared'}.`,
      updatedAuthor: updatedAuthor
    };
  } catch (e) {
    console.error("Error in updateCurrentlyCraftingTitle action:", e);
    return {
      success: false,
      message: 'Failed to update currently crafting title in localStorage.',
    };
  }
}
