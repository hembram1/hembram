
'use client';

import { BookForm } from '@/components/admin/BookForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { BookFormData } from '@/components/admin/BookForm'; 
import { addBookToStorage } from '@/lib/localStorageUtils'; // Import directly

export default function AddBookPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: BookFormData) => {
    try {
      const newBook = addBookToStorage(data); // Call util directly
      if (newBook) {
        toast({
          title: "Book Added!",
          description: `"${newBook.title}" has been added to localStorage.`,
        });
        // localStorageUtils dispatches 'booksDataUpdated', so other components will react.
        router.push('/admin/books'); 
      } else {
        // This case should ideally not happen if addBookToStorage is implemented correctly
        throw new Error("Failed to add book directly to storage.");
      }
    } catch (error) {
      console.error("Error adding book directly:", error);
      toast({
        title: "Error Adding Book",
        description: (error instanceof Error ? error.message : "An unexpected error occurred."),
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
