
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
import { User, Save } from "lucide-react";
import { author } from "@/lib/constants"; // To pre-fill the form
import { useToast } from '@/hooks/use-toast';
import { updateAuthorBio } from '@/app/actions/admin/authorActions';
import { useState } from 'react';

const authorBioSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters.' }),
});

export type AuthorBioFormValues = z.infer<typeof authorBioSchema>;

export default function AdminAuthorBioPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthorBioFormValues>({
    resolver: zodResolver(authorBioSchema),
    defaultValues: {
      name: author.name || '',
      bio: author.bio || '',
    },
  });

  async function onSubmit(values: AuthorBioFormValues) {
    setIsSubmitting(true);
    try {
      const result = await updateAuthorBio(values);
      if (result.success) {
        toast({
          title: 'Author Bio Updated!',
          description: result.message || 'Your changes have been (simulated) saved.',
        });
      } else {
        toast({
          title: 'Error Updating Bio',
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
          <User className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Author Bio</CardTitle>
        </div>
        <CardDescription className="text-md">
          Edit the author biography and profile information.
          <br />
          <strong className="text-destructive-foreground bg-destructive/70 px-1 rounded-sm">Note:</strong> Changes saved here are simulated and will not permanently update the website data without database integration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
