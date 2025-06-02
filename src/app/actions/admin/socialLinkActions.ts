
'use server';

import { z } from 'zod';
import type { SocialLink, Author } from '@/lib/types'; 
import { addSocialLinkToStorage, updateSocialLinkInStorage, deleteSocialLinkFromStorage } from '@/lib/localStorageUtils';

const socialLinkSchema = z.object({
  platform: z.string().min(1, {message: "Platform cannot be empty."}), // Min 1 to ensure it's not empty
  url: z.string().url(),
  // iconName is not part of the form input for simplicity in this simulation
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
  updatedAuthor?: Author; // Return the whole author object as it's updated
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
  
  try {
    // The iconName will be undefined here, or mapped if a string key system was in place
    const linkToAdd = { platform: values.platform, url: values.url };
    const updatedAuthor = addSocialLinkToStorage(linkToAdd);
    return { 
      success: true, 
      message: 'Social link added to localStorage.',
      updatedAuthor: updatedAuthor,
    };
  } catch (e) {
    console.error("Error in addSocialLink action:", e);
    return {
      success: false,
      message: 'Failed to add social link to localStorage.',
    };
  }
}

export async function updateSocialLink(
  originalPlatform: string, 
  values: SocialLinkFormValues
): Promise<SubmissionResult> {
  const parsedValues = socialLinkSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  try {
    const linkToUpdate = { platform: values.platform, url: values.url };
    const updatedAuthor = updateSocialLinkInStorage(originalPlatform, linkToUpdate);
    return { 
      success: true, 
      message: 'Social link updated in localStorage.',
      updatedAuthor: updatedAuthor,
    };
  } catch (e) {
    console.error("Error in updateSocialLink action:", e);
     return {
      success: false,
      message: 'Failed to update social link in localStorage.',
    };
  }
}

export async function deleteSocialLink(
  platformToDelete: string 
): Promise<SubmissionResult> {
  try {
    const updatedAuthor = deleteSocialLinkFromStorage(platformToDelete);
    return { 
      success: true, 
      message: `Social link for ${platformToDelete} deleted from localStorage.`,
      updatedAuthor: updatedAuthor,
    };
  } catch (e) {
    console.error("Error in deleteSocialLink action:", e);
    return {
      success: false,
      message: 'Failed to delete social link from localStorage.',
    };
  }
}
