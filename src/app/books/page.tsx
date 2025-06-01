
import BookCard from '@/components/BookCard';
import { books } from '@/lib/constants';
// import { Separator } from '@/components/ui/separator'; // Separator no longer needed here
import { Library } from 'lucide-react';

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 text-center py-8 bg-secondary/30 rounded-lg shadow-sm">
        <div className="flex justify-center items-center gap-3 mb-2">
          <Library className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-primary">Discover Hembram&apos;s Worlds</h1>
        </div>
        <p className="mt-2 text-lg text-foreground/80 max-w-xl mx-auto">
          Journey through captivating stories and unforgettable characters, each a portal to a new adventure.
        </p>
      </header>
      {/* <Separator className="my-8" /> */} {/* Removed as the new header is more distinct */}
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
