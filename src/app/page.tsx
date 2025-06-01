
import Link from 'next/link';
import AuthorBio from '@/components/AuthorBio';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { books } from '@/lib/constants';
import { ArrowRight, PenTool } from 'lucide-react';
import TypingAnimation from '@/components/TypingAnimation'; // Import the new component

export default function HomePage() {
  const featuredBooks = books.slice(0, 3); // Show first 3 books as featured
  const currentlyWritingBook = "The Serpent's Cipher"; // Placeholder for now

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="author-intro" className="mb-12">
        <AuthorBio />
      </section>

      <section id="currently-writing" className="mb-16"> {/* Increased mb for spacing */}
        <div className="flex justify-center"> {/* Removed mb-6 */}
          <div className="bg-card/80 backdrop-blur-lg shadow-md rounded-tl-2xl rounded-br-2xl py-2 px-5 flex items-center gap-3">
            <PenTool className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-headline font-semibold text-primary">
              Currently Crafting
            </h2>
          </div>
        </div>
        <Card className="max-w-3xl mx-auto overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 bg-card text-center">
          <div className="relative z-10">
            <p className="text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
              Hembram is currently weaving magic into a new tale:
            </p>
            <h3
              className="mt-3 mb-2 text-2xl sm:text-3xl font-headline font-semibold text-primary min-h-[2.5em] sm:min-h-[1.5em]">
              <TypingAnimation
                text={currentlyWritingBook}
                speed={100}
                cursorClassName="ml-1"
              />
            </h3>
            <p className="text-sm text-foreground/70 max-w-xl mx-auto">
              Stay tuned for updates on this exciting new adventure!
            </p>
          </div>
        </Card>
      </section>

      <section id="featured-books" className="mb-12">
        <Card className="max-w-3xl mx-auto overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 relative bg-card text-center">
          <div
            className="absolute -top-8 -right-8 w-28 h-28 sm:-top-10 sm:-right-10 sm:w-36 sm:h-36 md:-top-12 md:-right-12 md:w-44 md:h-44 lg:-top-14 lg:-right-14 bg-accent/10 rounded-full transform rotate-12 pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h2 className="inline-block text-3xl font-headline font-semibold text-primary pb-3 border-b-2 border-accent/70">
              Featured Books
            </h2>
            <p className="mt-4 text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
              A curated selection of Hembram&apos;s most captivating works to start your journey.
            </p>
          </div>
        </Card>

        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-muted-foreground mt-10">No featured books at the moment. Check back soon!</p>
        )}
        <div className="text-center mt-10">
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
