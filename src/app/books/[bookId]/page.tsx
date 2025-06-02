
'use client';

import type { Book, Author } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, BookOpenCheck, ExternalLink, ShoppingCart, Users, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getBooksData, getAuthorData } from '@/lib/localStorageUtils';
import { useParams } from 'next/navigation'; // For client components

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<Book | null | undefined>(undefined); // undefined for loading, null if not found
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      const booksData = getBooksData();
      const foundBook = booksData.find(b => b.id === bookId);
      setBook(foundBook || null);
      setAuthor(getAuthorData());
      setIsLoading(false);
    }

    const handleBooksUpdate = () => {
      const booksData = getBooksData();
      const foundBook = booksData.find(b => b.id === bookId);
      setBook(foundBook || null);
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
  }, [bookId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading book details...
      </div>
    );
  }

  if (!book || !author) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-headline text-destructive mb-2">Book Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The book you are looking for does not exist or may have been moved.
        </p>
        <Button asChild variant="outline">
          <Link href="/books">Back to Books</Link>
        </Button>
      </div>
    );
  }
  
  const GenreIcon = book.genreIconName; 
  const PurchaseLinkIcon = ExternalLink; 

  const amazonLink = book.purchaseLinks.find(link => link.retailer === 'Amazon');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className="relative rounded-lg overflow-hidden shadow-xl mb-8 min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center p-6"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${book.coverArtUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-ai-hint={book.coverArtHint}
      >
        <div className="relative z-10 text-white max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-3 drop-shadow-md">{book.title}</h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-6 drop-shadow-sm">by {author.name}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            {GenreIcon && <GenreIcon className="h-6 w-6 text-gray-200" />}
            <Badge 
              variant="outline" 
              className="border-gray-300 text-gray-100 bg-black/30 backdrop-blur-sm text-md px-3 py-1"
            >
              {book.genre}
            </Badge>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden shadow-xl rounded-lg">
        <div className="p-6 md:p-8">
          <div className="space-y-8 mb-8">
            <div>
              <h3 className="text-2xl font-headline font-semibold text-primary mb-3 flex items-center">
                <BookOpenCheck className="mr-3 h-6 w-6" /> Summary
              </h3>
              <p className="text-foreground/90 leading-relaxed text-base md:text-lg">{book.description}</p>
            </div>

            <div>
              <h3 className="text-2xl font-headline font-semibold text-primary mb-3 flex items-center">
                <Users className="mr-3 h-6 w-6" /> This novel is for
              </h3>
              <p className="text-foreground/90 text-base md:text-lg">{book.targetAudience}</p>
            </div>

            <div>
              <h3 className="text-2xl font-headline font-semibold text-primary mb-3 flex items-center">
                <ThumbsUp className="mr-3 h-6 w-6" /> Key Themes
              </h3>
              <p className="text-foreground/90 text-base md:text-lg">{book.themes}</p>
            </div>
          </div>
        
          <Separator className="my-8" />

          <div>
            <h2 className="text-3xl font-headline font-semibold text-primary mb-6 flex items-center">
              <ShoppingCart className="mr-3 h-7 w-7" /> Purchase This Book
            </h2>
            {amazonLink ? (
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <a href={amazonLink.url} target="_blank" rel="noopener noreferrer">
                    {amazonLink.iconName ? <amazonLink.iconName className="mr-2 h-5 w-5" /> : <PurchaseLinkIcon className="mr-2 h-5 w-5" /> }
                    Buy from {amazonLink.retailer}
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-base md:text-lg">Purchase links are not available at this moment.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
