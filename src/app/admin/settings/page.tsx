
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
import { useState } from 'react';

// Simulated Server Action
async function updateSiteSettings(values: SiteSettingsFormValues): Promise<{success: boolean, message?: string}> {
  console.log('Simulating update for Site Settings:');
  console.log('Site Title:', values.siteTitle);
  console.log('Logo URL:', values.logoUrl);
  
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real application, you would update these settings in a database or config file.
  // Here, we just simulate success.
  return { 
    success: true, 
    message: 'Site settings (simulated) update successful! Data logged to console.' 
  };
}


const siteSettingsSchema = z.object({
  siteTitle: z.string().min(3, { message: 'Site title must be at least 3 characters.' }),
  logoUrl: z.string().url({ message: 'Please enter a valid URL for the logo.' }).or(z.literal('')), // Allow empty for placeholder
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, you'd fetch current settings to pre-fill the form.
  // For simulation, we'll use placeholders or empty defaults.
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: 'Hembram - Official Author Website', // Example prefill
      logoUrl: '', // Placeholder for logo URL
    },
  });

  async function onSubmit(values: SiteSettingsFormValues) {
    setIsSubmitting(true);
    try {
      const result = await updateSiteSettings(values);
      if (result.success) {
        toast({
          title: 'Site Settings Updated!',
          description: result.message || 'Your changes have been (simulated) saved.',
        });
      } else {
        toast({
          title: 'Error Updating Settings',
          description: result.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
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
          <Settings className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Site Settings</CardTitle>
        </div>
        <CardDescription className="text-md">
          Manage global site settings like the header title/logo.
           <br />
          <strong className="text-destructive-foreground bg-destructive/70 px-1 rounded-sm">Note:</strong> Changes are simulated and won't permanently update website data without database integration.
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
              In a full application, the site title would update browser tabs and SEO metadata. The logo URL would replace the current text/icon logo in the header.
              These changes require further integration into your layout and Navbar components.
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

    