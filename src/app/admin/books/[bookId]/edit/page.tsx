
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
import { books as initialBooks } from "@/lib/constants"; // To find the book for editing
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditBookPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;

  const [bookToEdit, setBookToEdit] = useState<Book | null | undefined>(undefined); // undefined for loading, null if not found
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      // Simulate fetching the book. In a real app, this would be an API call.
      // For now, we find it in the constants.
      // If managing a dynamic list (e.g. currentBooks from AdminBooksPage), you'd check that first.
      const foundBook = initialBooks.find(b => b.id === bookId);
      setBookToEdit(foundBook || null);
      setIsLoading(false);
    }
  }, [bookId]);

  const handleSubmit = async (data: BookFormDataValues) => {
    if (!bookToEdit) return;

    const result = await updateBook(bookToEdit.id, data);
    if (result.success) {
      toast({
        title: "Book Updated!",
        description: result.message || `"${data.title}" has been (simulated) updated.`,
      });
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
                <p>Please wait while we fetch the book information.</p>
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
            The book you are trying to edit could not be found. It might have been deleted or the ID is incorrect.
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
          Modify the details for the book.
           <br />
            <strong className="text-destructive-foreground bg-destructive/70 px-1 rounded-sm">Note:</strong> Book updates are simulated. Data changes will not be permanently saved.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BookForm onSubmit={handleSubmit} initialData={bookToEdit} isEditMode={true} />
      </CardContent>
    </Card>
  );
}
