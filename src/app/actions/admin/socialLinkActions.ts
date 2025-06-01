
'use server';

import { z } from 'zod';
import type { SocialLink } from '@/lib/types'; // Assuming iconName is optional or handled differently for new links

const socialLinkSchema = z.object({
  platform: z.string().min(2),
  url: z.string().url(),
  // iconName is not part of the form input for simplicity in this simulation
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
  newLink?: Omit<SocialLink, 'iconName'> & { iconName?: SocialLink['iconName'] }; // Allow iconName to be undefined
}

export async function addSocialLink(
  values: SocialLinkFormValues
): Promise<SubmissionResult> {
  const parsedValues = socialLinkSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  const { platform, url } = parsedValues.data;

  // --- SIMULATION ---
  // In a real application, you would add this to the database.
  // For this simulation, we'll log it and return the new link structure.
  console.log('Simulating adding new Social Link:');
  console.log('Platform:', platform);
  console.log('URL:', url);

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Construct a new link object similar to what would be stored.
  // Icon selection would be more complex in a real app.
  const newLinkEntry: Omit<SocialLink, 'iconName'> & { iconName?: SocialLink['iconName'] } = { 
    platform, 
    url 
  };


  return { 
    success: true, 
    message: 'Social link (simulated) addition successful! Data logged to console.',
    newLink: newLinkEntry
  };
}

// Placeholder for future actions (update, delete)
// export async function updateSocialLink(id: string, values: SocialLinkFormValues): Promise<SubmissionResult> { ... }
// export async function deleteSocialLink(id: string): Promise<SubmissionResult> { ... }
