
import { books, author } from '@/lib/constants';
import type { Book } from '@/lib/types';
// import Image from 'next/image'; // Image component no longer directly used here for the main cover
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, BookOpenCheck, ExternalLink, MessageSquare, ShoppingCart, Star, Users, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}

export default async function BookDetailPage({ params }: { params: { bookId: string } }) {
  const book = books.find(b => b.id === params.bookId);

  if (!book) {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Background Image */}
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
            {book.genreIconName && <book.genreIconName className="h-6 w-6 text-gray-200" />}
            <Badge 
              variant="outline" 
              className="border-gray-300 text-gray-100 bg-black/30 backdrop-blur-sm text-md px-3 py-1"
            >
              {book.genre}
            </Badge>
          </div>
        </div>
      </div>
      {/* End Hero Section */}

      {/* Main Content Card */}
      <Card className="overflow-hidden shadow-xl rounded-lg">
        <div className="p-6 md:p-8">
          {/* Summary, Target Audience, Key Themes */}
          <div className="space-y-8 mb-8">
            <div>
              <h3 className="text-2xl font-headline font-semibold text-primary mb-3 flex items-center">
                <BookOpenCheck className="mr-3 h-6 w-6" /> Summary
              </h3>
              <p className="text-foreground/90 leading-relaxed text-base md:text-lg">{book.description}</p>
            </div>

            <div>
              <h3 className="text-2xl font-headline font-semibold text-primary mb-3 flex items-center">
                <Users className="mr-3 h-6 w-6" /> Target Audience
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

          {/* Purchase This Book */}
          <div>
            <h2 className="text-3xl font-headline font-semibold text-primary mb-6 flex items-center">
              <ShoppingCart className="mr-3 h-7 w-7" /> Purchase This Book
            </h2>
            {book.purchaseLinks.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {book.purchaseLinks.map((link, index) => (
                  <Button key={index} asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.iconName ? <link.iconName className="mr-2 h-5 w-5" /> : <ExternalLink className="mr-2 h-5 w-5" />}
                      Buy from {link.retailer}
                    </a>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-base md:text-lg">Purchase links are not available at this moment.</p>
            )}
          </div>

          <Separator className="my-8" />

          {/* Reader Reviews */}
          <div>
            <h2 className="text-3xl font-headline font-semibold text-primary mb-8 flex items-center">
              <MessageSquare className="mr-3 h-7 w-7" /> Reader Reviews
            </h2>
            {book.reviews.length > 0 ? (
              <div className="space-y-8">
                {book.reviews.map((review, index) => (
                  <Card key={index} className="bg-background shadow-md rounded-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-headline text-primary">{review.reviewer}</CardTitle>
                        <StarRating rating={review.rating} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground italic text-base leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-base md:text-lg">No reviews yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      </Card>
      {/* End Main Content Card */}
    </div>
  );
}
