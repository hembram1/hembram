
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '@/components/admin/BookForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, AlertTriangle } from "lucide-react";
import { updateBook } from '@/app/actions/admin/bookActions';
import { useToast } from '@/hooks/use-toast';
import type { BookFormDataValues } from '@/app/actions/admin/bookActions';
import type { Book } from '@/lib/types';
import { getBooksData } from "@/lib/localStorageUtils"; 
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

    // Server action `updateBook` will now handle localStorage update
    const result = await updateBook(bookToEdit.id, data);
    if (result.success && result.updatedBook) {
      toast({
        title: "Book Updated!",
        description: result.message || `"${result.updatedBook.title}" has been updated in localStorage.`,
      });
      // `booksDataUpdated` event is dispatched by saveBooksData in localStorageUtils
      router.push('/admin/books'); 
    } else {
      toast({
        title: "Error Updating Book",
        description: result.message || "An unexpected error occurred.",
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
