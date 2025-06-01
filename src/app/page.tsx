import Link from 'next/link';
import AuthorBio from '@/components/AuthorBio';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { books } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredBooks = books.slice(0, 3); // Show first 3 books as featured

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="author-intro" className="mb-12">
        <AuthorBio />
      </section>

      <section id="featured-books" className="mb-12">
        <h2 className="text-3xl font-headline font-semibold text-primary mb-6 text-center">
          Featured Books
        </h2>
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-muted-foreground">No featured books at the moment. Check back soon!</p>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/books">
              View All Books <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
