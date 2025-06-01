
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
        <div className="text-center mb-8 pt-8">
          <h2 className="inline-block text-3xl font-headline font-semibold text-primary pb-3 border-b-2 border-accent/70">
            Featured Books
          </h2>
          <p className="mt-4 text-md text-foreground/70 max-w-2xl mx-auto">
            A curated selection of Hembram&apos;s most captivating works to start your journey.
          </p>
        </div>
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-muted-foreground">No featured books at the moment. Check back soon!</p>
        )}
        <div className="text-center mt-10"> {/* Increased margin-top slightly */}
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/books">
              View All Books <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
