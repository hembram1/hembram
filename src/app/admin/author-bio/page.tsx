
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Image as ImageIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getAuthorData, saveAuthorData } from '@/lib/localStorageUtils';
import type { Author } from '@/lib/types';

const authorBioSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters.' }),
  authorImageUrl: z.string().url({ message: 'Please enter a valid URL for the image.' }).or(z.literal('')),
  authorImageHint: z.string().max(50, {message: 'AI hint must be 50 characters or less.'}).optional(),
});

export type AuthorBioFormValues = z.infer<typeof authorBioSchema>;

export default function AdminAuthorBioPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AuthorBioFormValues>({
    resolver: zodResolver(authorBioSchema),
    defaultValues: {
      name: '',
      bio: '',
      authorImageUrl: '',
      authorImageHint: '',
    },
  });

  useEffect(() => {
    const authorData = getAuthorData();
    form.reset({
      name: authorData.name || '',
      bio: authorData.bio || '',
      authorImageUrl: authorData.authorImageUrl || 'https://placehold.co/250x250.png',
      authorImageHint: authorData.authorImageHint || 'author portrait',
    });
    setIsLoading(false);
  }, [form]);

  async function onSubmit(values: AuthorBioFormValues) {
    setIsSubmitting(true);
    try {
      const authorData = getAuthorData();
      authorData.name = values.name;
      authorData.bio = values.bio;
      authorData.authorImageUrl = values.authorImageUrl;
      authorData.authorImageHint = values.authorImageHint;
      saveAuthorData(authorData);

      toast({
        title: 'Author Bio Updated!',
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
  
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader><CardTitle>Loading author data...</CardTitle></CardHeader>
        <CardContent><p>Please wait...</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Author Bio & Profile Image</CardTitle>
        </div>
        <CardDescription className="text-md">
          Edit the author biography, profile information, image URL, and AI hint for the image. Changes are saved to localStorage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Author's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the author's biography..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    Author Image URL
                  </FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/author-image.jpg or leave blank for placeholder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorImageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Image AI Hint (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., author portrait, professional headshot" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
