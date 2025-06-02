
'use server';

import { z } from 'zod';
import type { Book, PurchaseLink, Review } from '@/lib/types'; 
import { addBookToStorage, updateBookInStorage, deleteBookFromStorage } from '@/lib/localStorageUtils';

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
  // For simplicity, purchaseLinks and reviews are not part of direct form submission here
  // but could be handled by more complex logic or separate admin sections.
});

export type BookFormDataValues = z.infer<typeof bookFormSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
  newBook?: Book; 
  updatedBook?: Book;
  books?: Book[]; // For delete action
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

  try {
    // Assuming default empty arrays for reviews and purchase links for a new book from this simple form
    const bookWithDefaults = { 
        ...newBookData, 
        reviews: [] as Review[], 
        purchaseLinks: [] as PurchaseLink[] 
    };
    const addedBook = addBookToStorage(bookWithDefaults);
    return { 
      success: true, 
      message: `Book "${addedBook.title}" added to localStorage.`,
      newBook: addedBook
    };
  } catch (e) {
    console.error("Error in addBook action:", e);
    return {
      success: false,
      message: 'Failed to add book to localStorage.',
    };
  }
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
  
  try {
    // For update, we assume reviews and purchase links are managed elsewhere or merged if part of form
    const bookWithPotentiallyExistingComplexFields = {
         ...bookDataToUpdate,
         // reviews and purchaseLinks would be merged if part of form.
         // For this schema, they are not, so they'd remain as they are in localStorage.
    };
    const updatedBook = updateBookInStorage(bookId, bookWithPotentiallyExistingComplexFields);
    if (updatedBook) {
      return {
        success: true,
        message: `Book "${updatedBook.title}" (ID: ${bookId}) updated in localStorage.`,
        updatedBook: updatedBook
      };
    }
    return {
      success: false,
      message: `Book with ID ${bookId} not found for update.`,
    };
  } catch (e) {
    console.error("Error in updateBook action:", e);
    return {
      success: false,
      message: 'Failed to update book in localStorage.',
    };
  }
}

export async function deleteBookAction(bookId: string): Promise<SubmissionResult> {
  try {
    const remainingBooks = deleteBookFromStorage(bookId);
    return {
      success: true,
      message: `Book (ID: ${bookId}) deleted from localStorage.`,
      books: remainingBooks,
    };
  } catch (e) {
    console.error("Error in deleteBookAction:", e);
    return {
      success: false,
      message: 'Failed to delete book from localStorage.',
    };
  }
}
