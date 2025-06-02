
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, AlertTriangle, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import type { Book } from "@/lib/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getBooksData, deleteBookFromStorage } from "@/lib/localStorageUtils"; // Import directly
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


export default function AdminBooksPage() {
  const { toast } = useToast();
  const [currentBooks, setCurrentBooks] = useState<Book[]>([]);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentBooks(getBooksData());
    setIsLoading(false);

    const handleBooksUpdate = () => {
        setCurrentBooks(getBooksData());
    };
    window.addEventListener('booksDataUpdated', handleBooksUpdate);
    return () => window.removeEventListener('booksDataUpdated', handleBooksUpdate);
  }, []);

  const handleDeleteBook = async (bookId: string) => {
    if (!bookToDelete || bookToDelete.id !== bookId) return;

    setIsDeleting(true);
    try {
      const remainingBooks = deleteBookFromStorage(bookId); // Call util directly
      toast({
        title: "Book Deleted",
        description: `Book "${bookToDelete.title}" has been deleted from localStorage.`,
      });
      setCurrentBooks(remainingBooks); // Update state from direct call
      // localStorageUtils dispatches 'booksDataUpdated' event.
    } catch (error) {
      console.error("Error deleting book directly:", error);
      toast({
        title: "Error Deleting Book",
        description: (error instanceof Error ? error.message : "An unexpected error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
    }
  };

  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader><CardTitle>Loading books...</CardTitle></CardHeader>
            <CardContent><p>Please wait.</p></CardContent>
        </Card>
    );
  }

  return (
    <AlertDialog open={!!bookToDelete} onOpenChange={(isOpen) => !isOpen && setBookToDelete(null)}>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-headline">Manage Books</CardTitle>
              </div>
              <Button asChild>
                <Link href="/admin/books/add">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add New Book
                </Link>
              </Button>
            </div>
            <CardDescription className="text-md">
              Add, edit, or delete books. Changes are saved to localStorage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentBooks.length > 0 ? (
              <div className="space-y-4">
                {currentBooks.map(book => (
                  <Card key={book.id} className="p-4 flex justify-between items-center bg-muted/50">
                    <div>
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.genre}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Link href={`/admin/books/${book.id}/edit`}>
                            <span>
                              <Pencil className="mr-1 h-4 w-4" /> Edit
                            </span>
                          </Link>
                        </span>
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setBookToDelete(book)}>
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
                <p>No books found in localStorage. Add your first book!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the book <span className="font-semibold">&quot;{bookToDelete?.title}&quot;</span> from localStorage.
              This is a destructive action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBookToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookToDelete && handleDeleteBook(bookToDelete.id)}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete book'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
