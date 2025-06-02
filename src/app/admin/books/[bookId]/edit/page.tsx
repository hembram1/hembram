
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '@/components/admin/BookForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { BookFormDataValues } from '@/app/actions/admin/bookActions'; // Schema type can still be used
import type { Book } from '@/lib/types';
import { getBooksData, updateBookInStorage } from "@/lib/localStorageUtils"; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditBookPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;

  const [bookToEdit, setBookToEdit] = useState<Book | null | undefined>(undefined); 
  const [isLoading, setIsLoading] = useState(true);

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
        // localStorageUtils dispatches 'booksDataUpdated'
        router.push('/admin/books'); 
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

  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Loading Book Details...</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Please wait while we fetch the book information from localStorage.</p>
            </CardContent>
        </Card>
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
  );
}
