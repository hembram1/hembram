
'use client';

import BookCard from '@/components/BookCard';
import { Library } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { getBooksData } from '@/lib/localStorageUtils';
import type { Book } from '@/lib/types';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBooks(getBooksData());
    setIsLoading(false);

    const handleUpdate = () => {
      setBooks(getBooksData());
    };
    window.addEventListener('booksDataUpdated', handleUpdate);
    return () => window.removeEventListener('booksDataUpdated', handleUpdate);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-7xl font-headline font-bold text-primary animate-pulse">H.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="max-w-3xl mx-auto mb-10 overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 relative bg-card text-center">
        <div
          className="absolute -top-8 -right-8 w-28 h-28 sm:-top-10 sm:-right-10 sm:w-36 sm:h-36 md:-top-12 md:-right-12 md:w-44 md:h-44 lg:-top-16 lg:-right-16 bg-primary/5 rounded-full transform rotate-12 pointer-events-none -z-0"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex justify-center items-center mb-4">
            <Library className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-semibold text-primary inline-block pb-2 border-b-2 border-primary">
            Discover Hembram&apos;s Worlds
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-xl mx-auto">
            Journey through captivating stories and unforgettable characters, each a portal to a new adventure.
          </p>
        </div>
      </Card>
      
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No books available at the moment. Please check back soon!</p>
        </div>
      )}
    </div>
  );
}
