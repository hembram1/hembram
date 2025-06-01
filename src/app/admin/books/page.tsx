
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle, AlertTriangle, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { books as initialBooks } from "@/lib/constants"; // To display current books
import type { Book } from "@/lib/types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
// import { deleteBook } from "@/app/actions/admin/bookActions"; // Will be created
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

// Placeholder for actual deleteBook action
async function deleteBook(bookId: string): Promise<{success: boolean, message?: string}> {
  console.log(`Simulating delete for Book ID: ${bookId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, you'd interact with your backend here.
  // For now, always return success for simulation.
  // const isSuccess = Math.random() > 0.1; // 90% chance of success for simulation
  // if (!isSuccess) return { success: false, message: "Simulated error deleting book."};
  return { success: true, message: `Book (ID: ${bookId}) (simulated) deletion successful! Data logged to console.` };
}


export default function AdminBooksPage() {
  const { toast } = useToast();
  const [currentBooks, setCurrentBooks] = useState<Book[]>([]);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCurrentBooks(initialBooks);
  }, []);

  const handleDeleteBook = async (bookId: string) => {
    if (!bookToDelete || bookToDelete.id !== bookId) return;

    setIsDeleting(true);
    try {
      const result = await deleteBook(bookId);
      if (result.success) {
        toast({
          title: "Book Deleted",
          description: result.message || `Book "${bookToDelete.title}" has been (simulated) deleted.`,
        });
        setCurrentBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      } else {
        toast({
          title: "Error Deleting Book",
          description: result.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the book.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setBookToDelete(null);
    }
  };


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
              Add, edit, or delete books. Manage which books are featured.
              <br />
              <strong className="text-destructive-foreground bg-destructive/70 px-1 rounded-sm">Note:</strong> Add, Edit, and Delete operations are simulated. Data changes are not persisted.
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
                        {/* Wrap Link in a span to ensure Slot gets a simple child */}
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
                <p>No books found. Add your first book!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog for Books */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will (simulated) delete the book <span className="font-semibold">&quot;{bookToDelete?.title}&quot;</span>.
              This is a destructive action and cannot be undone from the UI.
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
