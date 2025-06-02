
'use client';

import * as React from 'react'; // Added import
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
import { Link2, PlusCircle, Save, Trash2, Pencil } from "lucide-react";
import type { SocialLink, Author } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
  getSocialLinksFromStorage, 
  addSocialLinkToStorage, 
  updateSocialLinkInStorage, 
  deleteSocialLinkFromStorage 
} from '@/lib/localStorageUtils'; // Using direct utils
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const socialLinkSchema = z.object({
  platform: z.string().min(1, { message: 'Platform name must be at least 1 character.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

interface EditableSocialLink extends SocialLink {
  originalPlatform?: string; 
}

export default function AdminSocialLinksPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLinks, setCurrentLinks] = useState<EditableSocialLink[]>([]);
  const [editingLink, setEditingLink] = useState<EditableSocialLink | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<EditableSocialLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const links = getSocialLinksFromStorage().map(link => ({ ...link, originalPlatform: link.platform }));
    setCurrentLinks(links);
    setIsLoading(false);

    const handleAuthorUpdate = () => {
      const updatedLinks = getSocialLinksFromStorage().map(link => ({ ...link, originalPlatform: link.platform }));
      setCurrentLinks(updatedLinks);
    };
    window.addEventListener('authorDataUpdated', handleAuthorUpdate);
    return () => window.removeEventListener('authorDataUpdated', handleAuthorUpdate);
  }, []);

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: { platform: '', url: '' },
  });

  const editForm = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
  });

  async function onAddSubmit(values: SocialLinkFormValues) {
    setIsSubmitting(true);
    try {
      const updatedAuthor = addSocialLinkToStorage(values); // Direct call
      if (updatedAuthor) {
        toast({
          title: 'Social Link Added!',
          description: `${values.platform} link has been added to localStorage.`,
        });
        setCurrentLinks((updatedAuthor.socialLinks || []).map(l => ({ ...l, originalPlatform: l.platform })));
        form.reset();
      } else {
        throw new Error("Failed to add social link.");
      }
    } catch (error) {
      toast({ title: 'Error Adding Link', description: (error instanceof Error ? error.message : 'Unexpected error.'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onEditSubmit(values: SocialLinkFormValues) {
    if (!editingLink || !editingLink.originalPlatform) return;
    setIsSubmitting(true);
    try {
      const updatedAuthor = updateSocialLinkInStorage(editingLink.originalPlatform, values); // Direct call
      if (updatedAuthor) {
        toast({
          title: 'Social Link Updated!',
          description: `${values.platform} link has been updated in localStorage.`,
        });
        setCurrentLinks((updatedAuthor.socialLinks || []).map(l => ({ ...l, originalPlatform: l.platform })));
        setShowEditModal(false);
        setEditingLink(null);
      } else {
         throw new Error("Failed to update social link.");
      }
    } catch (error) {
      toast({ title: 'Error Updating Link', description: (error instanceof Error ? error.message : 'Unexpected error.'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = (linkToEdit: EditableSocialLink) => {
    setEditingLink(linkToEdit);
    editForm.reset({ platform: linkToEdit.platform, url: linkToEdit.url });
    setShowEditModal(true);
  };

  async function handleDelete(platformToDelete: string) {
    if (!linkToDelete) return;
    setIsSubmitting(true);
    try {
      const originalPlatform = linkToDelete.originalPlatform || linkToDelete.platform;
      const updatedAuthor = deleteSocialLinkFromStorage(originalPlatform); // Direct call
      if (updatedAuthor) {
        toast({
          title: 'Social Link Deleted!',
          description: `The link for ${originalPlatform} has been deleted from localStorage.`,
        });
        setCurrentLinks((updatedAuthor.socialLinks || []).map(l => ({ ...l, originalPlatform: l.platform })));
      } else {
        throw new Error("Failed to delete social link.");
      }
    } catch (error) {
      toast({ title: 'Error Deleting Link', description: (error instanceof Error ? error.message : 'Unexpected error.'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
      setLinkToDelete(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-7xl font-headline font-bold text-primary animate-pulse">H.</span>
      </div>
    );
  }

  return (
    <AlertDialog open={!!linkToDelete} onOpenChange={(isOpen) => !isOpen && setLinkToDelete(null)}>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Link2 className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-headline">Social Links</CardTitle>
            </div>
            <CardDescription className="text-md">
              Manage social media links. Changes are saved to localStorage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4 text-foreground/80">Current Links</h3>
            {currentLinks.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {currentLinks.map((link) => (
                  <li key={link.originalPlatform || link.platform} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      {/* Icon rendering relies on mapping in localStorageUtils or component */}
                      {link.iconName && React.createElement(link.iconName, { className: "h-5 w-5 text-primary" })}
                      <span className="font-medium">{link.platform}</span>
                    </div>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline truncate max-w-[200px] sm:max-w-xs">
                      {link.url}
                    </a>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(link)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setLinkToDelete(link)} className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                    </div>
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
              <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-6">
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

        <Dialog open={showEditModal} onOpenChange={(isOpen) => { if (!isOpen) setEditingLink(null); setShowEditModal(isOpen);}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Social Link</DialogTitle>
              <DialogDescription>
                Update the platform name or URL for this social link.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setEditingLink(null);}}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the social link for <span className="font-semibold">{linkToDelete?.platform}</span> from localStorage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setLinkToDelete(null)} disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => linkToDelete && handleDelete(linkToDelete.originalPlatform || linkToDelete.platform)} 
            disabled={isSubmitting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
