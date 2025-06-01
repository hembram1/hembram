
'use server';

import { z } from 'zod';
import type { SocialLink } from '@/lib/types'; 

const socialLinkSchema = z.object({
  platform: z.string().min(2),
  url: z.string().url(),
  // iconName is not part of the form input for simplicity in this simulation
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
  newLink?: Omit<SocialLink, 'iconName'> & { iconName?: SocialLink['iconName'] }; 
  updatedLink?: Omit<SocialLink, 'iconName'> & { iconName?: SocialLink['iconName'] };
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

  console.log('Simulating adding new Social Link:');
  console.log('Platform:', platform);
  console.log('URL:', url);

  await new Promise(resolve => setTimeout(resolve, 500));

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

export async function updateSocialLink(
  originalPlatform: string, // Used as an ID for simulation
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

  console.log(`Simulating update for Social Link (original platform: ${originalPlatform}):`);
  console.log('New Platform:', platform);
  console.log('New URL:', url);

  await new Promise(resolve => setTimeout(resolve, 500));

  const updatedLinkEntry: Omit<SocialLink, 'iconName'> & { iconName?: SocialLink['iconName'] } = { 
    platform, 
    url 
  };

  return { 
    success: true, 
    message: 'Social link (simulated) update successful! Data logged to console.',
    updatedLink: updatedLinkEntry
  };
}

export async function deleteSocialLink(
  platformToDelete: string // Used as an ID for simulation
): Promise<SubmissionResult> {
  console.log(`Simulating delete for Social Link (platform: ${platformToDelete}):`);
  
  await new Promise(resolve => setTimeout(resolve, 500));

  return { 
    success: true, 
    message: `Social link for ${platformToDelete} (simulated) deletion successful! Data logged to console.`
  };
}

    