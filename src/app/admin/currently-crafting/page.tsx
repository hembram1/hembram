
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { updateCurrentlyCraftingTitle } from '@/app/actions/admin/craftingActions';
import { useState, useEffect } from 'react';
import { getCurrentlyCraftingTitleFromStorage, saveCurrentlyCraftingTitleToStorage } from '@/lib/localStorageUtils'; // Direct use for client component
import type { Author } from '@/lib/types';


const currentlyCraftingSchema = z.object({
  title: z.string().max(100, { message: 'Title must be 100 characters or less.' }).optional(),
});

export type CurrentlyCraftingFormValues = z.infer<typeof currentlyCraftingSchema>;

export default function AdminCurrentlyCraftingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');

  const form = useForm<CurrentlyCraftingFormValues>({
    resolver: zodResolver(currentlyCraftingSchema),
    // Default values will be set by useEffect
  });

  useEffect(() => {
    const titleFromStorage = getCurrentlyCraftingTitleFromStorage();
    setCurrentTitle(titleFromStorage);
    form.reset({
      title: titleFromStorage || '',
    });
  }, [form]);

  async function onSubmit(values: CurrentlyCraftingFormValues) {
    setIsSubmitting(true);
    try {
      // Direct client-side update to localStorage
      saveCurrentlyCraftingTitleToStorage(values.title || ''); // Dispatches 'authorDataUpdated'

      setCurrentTitle(values.title || ''); // Update local state

      toast({
        title: 'Currently Crafting Title Updated!',
        description: 'Your changes have been saved to localStorage.',
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <PenTool className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Currently Crafting Book</CardTitle>
        </div>
        <CardDescription className="text-md">
          Update the title of the book Hembram is currently writing. This will be displayed on the homepage.
          Leave blank to clear the title. Changes are saved to localStorage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the book title or leave blank to clear" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Title'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
