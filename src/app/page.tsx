
'use client';

import Link from 'next/link';
import AuthorBio from '@/components/AuthorBio';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, PenTool, Library } from 'lucide-react';
import TypingAnimation from '@/components/TypingAnimation';
import { useState, useEffect } from 'react';
import { getBooksData, getAuthorData } from '@/lib/localStorageUtils';
import type { Book, Author } from '@/lib/types';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const booksData = getBooksData();
    setFeaturedBooks(booksData.slice(0, 3));
    setAuthor(getAuthorData());
    setIsLoading(false);

    const handleBooksUpdate = () => {
      const updatedBooks = getBooksData();
      setFeaturedBooks(updatedBooks.slice(0, 3));
    };
    const handleAuthorUpdate = () => {
      setAuthor(getAuthorData());
    };

    window.addEventListener('booksDataUpdated', handleBooksUpdate);
    window.addEventListener('authorDataUpdated', handleAuthorUpdate);

    return () => {
      window.removeEventListener('booksDataUpdated', handleBooksUpdate);
      window.removeEventListener('authorDataUpdated', handleAuthorUpdate);
    };
  }, []);

  if (isLoading || !author) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading page content...
      </div>
    );
  }
  
  const currentlyWritingBook = author.currentlyCraftingBookTitle || "Stay tuned for the next adventure!";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section id="author-intro" className="mb-12">
        <AuthorBio /> {/* AuthorBio now fetches its own data or receives it */}
      </section>

      <section id="currently-writing" className="mb-16">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg shadow-md rounded-tl-2xl rounded-br-2xl py-2 px-5 flex items-center gap-3">
            <PenTool className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-headline font-semibold text-primary">
              Currently Crafting
            </h2>
          </div>
          <Card className="relative max-w-3xl mx-auto shadow-xl rounded-2xl bg-card text-center p-6 sm:p-8 md:p-10 pt-12 sm:pt-14 md:pt-16">
            <div
              className="absolute -bottom-8 -left-8 w-28 h-28 sm:-bottom-10 sm:-left-10 sm:w-36 sm:h-36 md:-bottom-12 md:-left-12 md:w-44 md:h-44 lg:-bottom-16 lg:-left-16 bg-primary/10 rounded-full transform -rotate-12 pointer-events-none -z-0"
              aria-hidden="true"
            />
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
                  loop={true}
                  delayBeforeRestart={2000}
                />
              </h3>
              <p className="text-sm text-foreground/70 max-w-xl mx-auto">
                Stay tuned for updates on this exciting new adventure!
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section id="featured-books" className="mb-12">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-lg shadow-md rounded-tl-2xl rounded-br-2xl py-2 px-5 flex items-center gap-3">
            <Library className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-headline font-semibold text-primary">
              Featured Books
            </h2>
          </div>
          <Card className="relative max-w-3xl mx-auto shadow-xl rounded-2xl bg-card text-center px-6 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10 pt-12 sm:pt-14 md:pt-16">
            <div
              className="absolute -top-8 -right-8 w-28 h-28 sm:-top-10 sm:-right-10 sm:w-36 sm:h-36 md:-top-12 md:-right-12 md:w-44 md:h-44 lg:-top-16 lg:-right-16 bg-accent/10 rounded-full transform rotate-12 pointer-events-none -z-0"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <p className="mt-4 text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
                A curated selection of Hembram&apos;s most captivating works to start your journey.
              </p>
            </div>
          </Card>
        </div>

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
