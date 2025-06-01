
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useState } from 'react';
import type { Book } from '@/lib/types';

// Define a Zod schema for book form validation
// For simulation, keeping it simpler. A real app might have more complex validation.
const bookFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  coverArtUrl: z.string().url({ message: "Please enter a valid URL for cover art." }).or(z.literal('')),
  coverArtHint: z.string().optional(),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  genre: z.string().min(3, { message: "Genre must be at least 3 characters." }),
  themes: z.string().min(5, { message: "Themes must be at least 5 characters." }),
  targetAudience: z.string().min(5, { message: "Target audience must be at least 5 characters." }),
  // PurchaseLinks and Reviews are complex and omitted for this simulated form.
});

export type BookFormData = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  onSubmit: (data: BookFormData) => Promise<void>;
  initialData?: Partial<Book>; // For pre-filling the form in edit mode
  isEditMode?: boolean;
}

export function BookForm({ onSubmit, initialData, isEditMode = false }: BookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      coverArtUrl: initialData?.coverArtUrl || 'https://placehold.co/300x450.png',
      coverArtHint: initialData?.coverArtHint || 'book cover',
      summary: initialData?.summary || '',
      description: initialData?.description || '',
      genre: initialData?.genre || '',
      themes: initialData?.themes || '',
      targetAudience: initialData?.targetAudience || '',
    },
  });

  async function handleFormSubmit(values: BookFormData) {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
    if (!isEditMode) {
        form.reset(); // Reset form only if not in edit mode after submission
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverArtUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Art URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/cover.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="coverArtHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Art AI Hint (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., fantasy landscape, abstract patterns" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Summary (for cards)</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of the book..." {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description (for detail page)</FormLabel>
              <FormControl>
                <Textarea placeholder="The full, detailed description of the book..." {...field} className="min-h-[150px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Fantasy, Sci-Fi, Romance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="themes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Themes</FormLabel>
              <FormControl>
                <Input placeholder="e.g., adventure, love, betrayal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Young Adults, Sci-Fi readers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          <Save className="mr-2 h-5 w-5" />
          {isSubmitting ? (isEditMode ? 'Saving Changes...' : 'Adding Book...') : (isEditMode ? 'Save Changes' : 'Add Book')}
        </Button>
      </form>
    </Form>
  );
}

    