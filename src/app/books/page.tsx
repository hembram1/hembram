import BookCard from '@/components/BookCard';
import { books } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Discover Hembram&apos;s Worlds</h1>
        <p className="mt-2 text-lg text-foreground/80">
          Journey through captivating stories and unforgettable characters.
        </p>
      </header>
      <Separator className="my-8" />
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
