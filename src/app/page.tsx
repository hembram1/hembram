
import Link from 'next/link';
import AuthorBio from '@/components/AuthorBio';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { books } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredBooks = books.slice(0, 3); // Show first 3 books as featured

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="featured-books" className="mb-12">
        <Card className="max-w-3xl mx-auto mb-10 overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 relative bg-card text-center">
          <div
            className="absolute -top-10 -left-10 w-32 h-32 sm:-top-12 sm:-left-12 md:-top-16 md:-left-16 sm:w-40 sm:h-40 md:w-52 md:h-52 bg-accent/10 rounded-full transform -rotate-12 pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h2 className="inline-block text-3xl font-headline font-semibold text-primary pb-3 border-b-2 border-accent/70">
              Featured Books
            </h2>
            <p className="mt-4 text-md text-foreground/70 max-w-2xl mx-auto">
              A curated selection of Hembram&apos;s most captivating works to start your journey.
            </p>
          </div>
        </Card>
        
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-muted-foreground">No featured books at the moment. Check back soon!</p>
        )}
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/books">
              View All Books <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section id="author-intro" className="mb-12">
        <AuthorBio />
      </section>
    </div>
  );
}
