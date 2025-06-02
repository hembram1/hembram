
'use client';

import { BookForm } from '@/components/admin/BookForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";
import { addBook } from '@/app/actions/admin/bookActions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { BookFormData } from '@/components/admin/BookForm'; 

export default function AddBookPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: BookFormData) => {
    // Server action `addBook` will now handle localStorage update
    const result = await addBook(data);
    if (result.success && result.newBook) {
      toast({
        title: "Book Added!",
        description: `"${result.newBook.title}" has been added to localStorage.`,
      });
      // `booksDataUpdated` event is dispatched by saveBooksData in localStorageUtils
      router.push('/admin/books'); 
    } else {
      toast({
        title: "Error Adding Book",
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Add New Book</CardTitle>
        </div>
        <CardDescription className="text-md">
          Fill in the details for the new book. Data will be saved to localStorage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BookForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
