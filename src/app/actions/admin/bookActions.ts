
'use server';

import { z } from 'zod';
import type { Book } from '@/lib/types'; // Assuming this type matches the data structure

// This schema should match BookFormData from BookForm.tsx
const bookFormSchema = z.object({
  title: z.string().min(3),
  coverArtUrl: z.string().url().or(z.literal('')),
  coverArtHint: z.string().optional(),
  summary: z.string().min(10),
  description: z.string().min(20),
  genre: z.string().min(3),
  themes: z.string().min(5),
  targetAudience: z.string().min(5),
});

export type BookFormDataValues = z.infer<typeof bookFormSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
  newBook?: Partial<Book>; 
  updatedBook?: Partial<Book>;
}

export async function addBook(
  values: BookFormDataValues
): Promise<SubmissionResult> {
  const parsedValues = bookFormSchema.safeParse(values);

  if (!parsedValues.success) {
    console.error("Add Book validation errors:", parsedValues.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs. Details in console.',
    };
  }

  const newBookData = parsedValues.data;

  console.log('Simulating adding new Book:');
  console.log('Title:', newBookData.title);
  console.log('Genre:', newBookData.genre);
  // ... log other fields as needed

  await new Promise(resolve => setTimeout(resolve, 500));

  const simulatedNewBook: Partial<Book> = {
    id: `simulated-${Date.now()}`, 
    ...newBookData,
    reviews: [], 
    purchaseLinks: [], 
  };

  return { 
    success: true, 
    message: `Book "${newBookData.title}" (simulated) addition successful! Data logged to console.`,
    newBook: simulatedNewBook
  };
}

export async function updateBook(
  bookId: string, 
  values: BookFormDataValues
): Promise<SubmissionResult> {
  const parsedValues = bookFormSchema.safeParse(values);

  if (!parsedValues.success) {
    console.error(`Update Book (ID: ${bookId}) validation errors:`, parsedValues.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Invalid form data for update. Please check your inputs. Details in console.',
    };
  }

  const bookDataToUpdate = parsedValues.data;

  console.log(`Simulating update for Book ID: ${bookId}`);
  console.log('Updated Title:', bookDataToUpdate.title);
  // ... log other fields as needed

  await new Promise(resolve => setTimeout(resolve, 500));

  // Construct the updated book object to return
  const simulatedUpdatedBook: Partial<Book> = {
    id: bookId, // Keep the original ID
    ...bookDataToUpdate,
    // reviews and purchaseLinks would typically be handled separately or merged if also editable here
  };

  return {
    success: true,
    message: `Book "${bookDataToUpdate.title}" (ID: ${bookId}) (simulated) update successful! Data logged to console.`,
    updatedBook: simulatedUpdatedBook
  };
}
    
