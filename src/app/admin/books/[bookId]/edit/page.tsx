
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '@/components/admin/BookForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, AlertTriangle, PlusCircle, Trash2, Link as LinkIcon, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { BookFormDataValues } from '@/app/actions/admin/bookActions'; // Schema type can still be used
import type { Book, PurchaseLink } from '@/lib/types';
import { getBooksData, updateBookInStorage, addPurchaseLinkToBookInStorage, deletePurchaseLinkFromBookInStorage } from "@/lib/localStorageUtils"; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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


export default function EditBookPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;

  const [bookToEdit, setBookToEdit] = useState<Book | null | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true);
  const [newLinkRetailer, setNewLinkRetailer] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<PurchaseLink | null>(null);


  useEffect(() => {
    if (bookId) {
      const books = getBooksData();
      const foundBook = books.find(b => b.id === bookId);
      setBookToEdit(foundBook || null);
      setIsLoading(false);
    }
  }, [bookId]);

  const handleSubmit = async (data: BookFormDataValues) => {
    if (!bookToEdit) return;

    try {
      const updatedBook = updateBookInStorage(bookToEdit.id, data); // Call util directly
      if (updatedBook) {
        toast({
          title: "Book Updated!",
          description: `"${updatedBook.title}" has been updated in localStorage.`,
        });
        setBookToEdit(updatedBook); // Update local state after core details update
        // router.push('/admin/books'); // Don't push, stay on page
      } else {
        toast({
          title: "Error Updating Book",
          description: `Book with ID ${bookToEdit.id} not found for update or update failed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating book directly:", error);
      toast({
        title: "Error Updating Book",
        description: (error instanceof Error ? error.message : "An unexpected error occurred."),
        variant: "destructive",
      });
    }
  };

  const handleAddPurchaseLink = async () => {
    if (!bookId || !newLinkRetailer || !newLinkUrl) {
      toast({ title: "Missing Fields", description: "Please provide retailer and URL.", variant: "destructive" });
      return;
    }
    setIsAddingLink(true);
    try {
      const updatedBook = addPurchaseLinkToBookInStorage(bookId, { retailer: newLinkRetailer, url: newLinkUrl });
      if (updatedBook) {
        setBookToEdit(updatedBook);
        setNewLinkRetailer('');
        setNewLinkUrl('');
        toast({ title: "Purchase Link Added", description: "The new link has been added." });
      } else {
        toast({ title: "Error", description: "Failed to add purchase link.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not add purchase link.", variant: "destructive" });
    } finally {
      setIsAddingLink(false);
    }
  };

  const handleDeletePurchaseLink = async (retailer: string) => {
    if (!bookId || !linkToDelete || linkToDelete.retailer !== retailer) return;
    
    try {
      const updatedBook = deletePurchaseLinkFromBookInStorage(bookId, retailer);
      if (updatedBook) {
        setBookToEdit(updatedBook);
        toast({ title: "Purchase Link Deleted", description: `Link for ${retailer} removed.` });
      } else {
        toast({ title: "Error", description: "Failed to delete purchase link.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not delete purchase link.", variant: "destructive" });
    } finally {
      setLinkToDelete(null);
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-7xl font-headline font-bold text-primary animate-pulse">H.</span>
      </div>
    );
  }

  if (!bookToEdit) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <CardTitle className="text-3xl font-headline text-destructive">Book Not Found</CardTitle>
            </div>
          <CardDescription className="text-md">
            The book you are trying to edit could not be found in localStorage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/books">Back to Books List</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <AlertDialog open={!!linkToDelete} onOpenChange={(isOpen) => !isOpen && setLinkToDelete(null)}>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Pencil className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-headline">Edit Book: {bookToEdit.title}</CardTitle>
            </div>
            <CardDescription className="text-md">
              Modify the details for the book. Changes will be saved to localStorage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookForm onSubmit={handleSubmit} initialData={bookToEdit} isEditMode={true} />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <LinkIcon className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl font-headline">Manage Purchase Links</CardTitle>
            </div>
            <CardDescription>Add or remove purchase links for this book.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Current Links:</h4>
              {bookToEdit.purchaseLinks && bookToEdit.purchaseLinks.length > 0 ? (
                <ul className="space-y-2">
                  {bookToEdit.purchaseLinks.map(link => (
                    <li key={link.retailer} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div>
                        <span className="font-medium">{link.retailer}</span>: <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate max-w-[150px] sm:max-w-xs inline-block">{link.url}</a>
                      </div>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-8 w-8" onClick={() => setLinkToDelete(link)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No purchase links added yet.</p>
              )}
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3">Add New Link:</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="retailerName">Retailer Name</Label>
                  <Input 
                    id="retailerName" 
                    value={newLinkRetailer} 
                    onChange={(e) => setNewLinkRetailer(e.target.value)} 
                    placeholder="e.g., Amazon, Barnes & Noble" 
                  />
                </div>
                <div>
                  <Label htmlFor="retailerUrl">URL</Label>
                  <Input 
                    id="retailerUrl" 
                    type="url" 
                    value={newLinkUrl} 
                    onChange={(e) => setNewLinkUrl(e.target.value)} 
                    placeholder="https://www.example.com/book-link"
                  />
                </div>
                <Button onClick={handleAddPurchaseLink} disabled={isAddingLink} className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {isAddingLink ? "Adding..." : "Add Link"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Link?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the purchase link for <span className="font-semibold">&quot;{linkToDelete?.retailer}&quot;</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLinkToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => linkToDelete && handleDeletePurchaseLink(linkToDelete.retailer)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Yes, Delete Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

      </div>
    </AlertDialog>
  );
}
