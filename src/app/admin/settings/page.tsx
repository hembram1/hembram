
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
import { Settings, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getAuthorData, updateSiteSettingsInStorage } from '@/lib/localStorageUtils';
// import type { Author } from '@/lib/types'; // Not strictly needed if not storing full author object in state

const siteSettingsSchema = z.object({
  siteTitle: z.string().min(3, { message: 'Site title must be at least 3 characters.' }),
  logoUrl: z.string().url({ message: 'Please enter a valid URL for the logo.' }).or(z.literal('')), 
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial load
  // const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null); // Can be removed if not directly used

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: '', // Initialize as controlled
      logoUrl: '',   // Initialize as controlled
    },
  });

  useEffect(() => {
    const authorData = getAuthorData();
    // setCurrentAuthor(authorData); // Can be removed
    form.reset({
      siteTitle: authorData.siteTitle || 'Hembram - Official Author Website',
      logoUrl: authorData.logoUrl || '',
    });
    setIsLoading(false);
  }, [form]);

  async function onSubmit(values: SiteSettingsFormValues) {
    setIsSubmitting(true);
    try {
      updateSiteSettingsInStorage(values.siteTitle, values.logoUrl); // This dispatches 'authorDataUpdated'
      
      // No need to setCurrentAuthor or getAuthorData here for local state,
      // as Navbar listens to 'authorDataUpdated' event.
      // const updatedAuthorData = getAuthorData();
      // setCurrentAuthor(updatedAuthorData);

      toast({
        title: 'Site Settings Updated!',
        description: 'Your changes have been saved to localStorage.',
      });
    } catch (error) {
      toast({
        title: 'Error Updating Settings',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (isLoading) { // Check isLoading instead of currentAuthor
    return (
      <Card className="shadow-lg">
        <CardHeader><CardTitle>Loading site settings...</CardTitle></CardHeader>
        <CardContent><p>Please wait...</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Site Settings</CardTitle>
        </div>
        <CardDescription className="text-md">
          Manage global site settings like the header title/logo. Changes are saved to localStorage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Website Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              The site title will update browser tabs and SEO metadata (requires layout integration). The logo URL, if provided, can be used to display an image logo in the header (requires Navbar component update).
            </p>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              <Save className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
