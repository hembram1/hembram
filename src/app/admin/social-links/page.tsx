
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link2, PlusCircle, Save } from "lucide-react";
import { author } from "@/lib/constants"; // To display current links and pre-fill
import type { SocialLink } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addSocialLink } from '@/app/actions/admin/socialLinkActions';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

const socialLinkSchema = z.object({
  platform: z.string().min(2, { message: 'Platform name must be at least 2 characters.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

export default function AdminSocialLinksPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLinks, setCurrentLinks] = useState<SocialLink[]>(author.socialLinks || []);

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: '',
      url: '',
    },
  });

  async function onSubmit(values: SocialLinkFormValues) {
    setIsSubmitting(true);
    try {
      // For iconName, this simulation doesn't include dynamic icon selection.
      // In a real app, you might have a dropdown or a way to pick icons.
      const newLinkData = { ...values, iconName: undefined }; 
      const result = await addSocialLink(newLinkData);
      
      if (result.success && result.newLink) {
        toast({
          title: 'Social Link Added!',
          description: `${result.newLink.platform} link has been (simulated) added.`,
        });
        // Simulate adding to the list for UI feedback. This won't persist.
        setCurrentLinks(prevLinks => [...prevLinks, result.newLink as SocialLink]);
        form.reset();
      } else {
        toast({
          title: 'Error Adding Link',
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
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Link2 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Social Links</CardTitle>
          </div>
          <CardDescription className="text-md">
            Manage social media links and contact information.
            <br />
            <strong className="text-destructive-foreground bg-destructive/70 px-1 rounded-sm">Note:</strong> Changes are simulated and won't permanently update website data without database integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4 text-foreground/80">Current Links</h3>
          {currentLinks.length > 0 ? (
            <ul className="space-y-3 mb-6">
              {currentLinks.map((link) => (
                <li key={link.platform} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    {link.iconName && <link.iconName className="h-5 w-5 text-primary" />}
                    <span className="font-medium">{link.platform}</span>
                  </div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline truncate max-w-xs">
                    {link.url}
                  </a>
                  {/* Edit/Delete buttons would go here in a full implementation */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mb-6">No social links configured yet.</p>
          )}
        </CardContent>
        <Separator />
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <PlusCircle className="h-6 w-6 text-primary" />
                Add New Social Link
            </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Twitter, Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/profile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Adding...' : 'Add Link'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
