
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
import { Link2, PlusCircle, Save, Trash2, Pencil, AlertTriangle } from "lucide-react";
import { author } from "@/lib/constants"; 
import type { SocialLink } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addSocialLink, updateSocialLink, deleteSocialLink } from '@/app/actions/admin/socialLinkActions';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from "@/components/ui/alert-dialog"

const socialLinkSchema = z.object({
  platform: z.string().min(2, { message: 'Platform name must be at least 2 characters.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

// For identifying the link being edited/deleted. Could be the original platform name or an index.
// Using original platform name for simplicity in this simulation.
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

  useEffect(() => {
    // Initialize with potentially modifiable originalPlatform
    setCurrentLinks(author.socialLinks.map(link => ({ ...link, originalPlatform: link.platform })) || []);
  }, []);

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: '',
      url: '',
    },
  });

  const editForm = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
  });

  async function onAddSubmit(values: SocialLinkFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addSocialLink(values);
      
      if (result.success && result.newLink) {
        toast({
          title: 'Social Link Added!',
          description: `${result.newLink.platform} link has been (simulated) added.`,
        });
        setCurrentLinks(prevLinks => [...prevLinks, { ...result.newLink, originalPlatform: result.newLink.platform } as EditableSocialLink]);
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

  async function onEditSubmit(values: SocialLinkFormValues) {
    if (!editingLink || !editingLink.originalPlatform) return;
    setIsSubmitting(true);
    try {
      const result = await updateSocialLink(editingLink.originalPlatform, values);
      if (result.success && result.updatedLink) {
        toast({
          title: 'Social Link Updated!',
          description: `${result.updatedLink.platform} link has been (simulated) updated.`,
        });
        setCurrentLinks(prevLinks => 
          prevLinks.map(link => 
            link.originalPlatform === editingLink.originalPlatform 
            ? { ...result.updatedLink, originalPlatform: result.updatedLink.platform } as EditableSocialLink
            : link
          )
        );
        setShowEditModal(false);
        setEditingLink(null);
      } else {
        toast({
          title: 'Error Updating Link',
          description: result.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
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
    setIsSubmitting(true);
    try {
      const result = await deleteSocialLink(platformToDelete);
      if (result.success) {
        toast({
          title: 'Social Link Deleted!',
          description: `The link for ${platformToDelete} has been (simulated) deleted.`,
        });
        setCurrentLinks(prevLinks => prevLinks.filter(link => link.originalPlatform !== platformToDelete));
      } else {
        toast({
          title: 'Error Deleting Link',
          description: result.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setLinkToDelete(null);
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
                <li key={link.originalPlatform || link.platform} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    {link.iconName && <link.iconName className="h-5 w-5 text-primary" />}
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

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
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
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!linkToDelete} onOpenChange={(isOpen) => !isOpen && setLinkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will (simulated) delete the social link for <span className="font-semibold">{linkToDelete?.platform}</span>. This cannot be undone from the current UI.
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

    </div>
  );
}

    