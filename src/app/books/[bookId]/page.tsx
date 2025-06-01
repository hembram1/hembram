import { books, author } from '@/lib/constants';
import type { Book, Review, PurchaseLink } from '@/lib/types';
import { generateBookBlurb, type GenerateBookBlurbInput } from '@/ai/flows/generate-book-blurb';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, BookOpenCheck, Bot, ExternalLink, MessageSquare, ShoppingCart, Star, Users, ThumbsUp } from 'lucide-react';
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

  const blurbInput: GenerateBookBlurbInput = {
    title: book.title,
    genre: book.genre,
    themes: book.themes,
    targetAudience: book.targetAudience,
    summary: book.summary,
  };

  let aiBlurb = "The promotional blurb is currently being crafted by our AI. Check back in a moment!";
  try {
    const blurbOutput = await generateBookBlurb(blurbInput);
    aiBlurb = blurbOutput.blurb;
  } catch (error) {
    console.error("Error generating AI blurb:", error);
    aiBlurb = "We encountered an issue generating the promotional blurb. Please enjoy the book's summary in the meantime.";
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 p-4 md:p-6">
            <Image
              src={book.coverArtUrl}
              alt={`Cover of ${book.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-md object-cover w-full"
              data-ai-hint={book.coverArtHint}
            />
          </div>
          <div className="md:w-2/3 p-4 md:p-6">
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">by {author.name}</p>
            
            <div className="flex items-center gap-2 mb-4">
              {book.genreIconName && <book.genreIconName className="h-5 w-5 text-accent" />}
              <Badge variant="default" className="bg-accent text-accent-foreground">{book.genre}</Badge>
            </div>

            <Card className="mb-6 bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline text-primary">
                  <Bot className="mr-2 h-6 w-6" /> AI Generated Blurb
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 italic leading-relaxed">{aiBlurb}</p>
              </CardContent>
            </Card>
            
            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-headline font-semibold text-primary mb-2 flex items-center">
                  <BookOpenCheck className="mr-2 h-5 w-5" /> Summary
                </h3>
                <p className="text-foreground/90 leading-relaxed">{book.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-headline font-semibold text-primary mb-2 flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Target Audience
                </h3>
                <p className="text-foreground/90">{book.targetAudience}</p>
              </div>

              <div>
                <h3 className="text-xl font-headline font-semibold text-primary mb-2 flex items-center">
                    <ThumbsUp className="mr-2 h-5 w-5" /> Key Themes
                </h3>
                <p className="text-foreground/90">{book.themes}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4 flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" /> Purchase This Book
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
            <p className="text-muted-foreground">Purchase links are not available at this moment.</p>
          )}
        </div>
        
        <Separator className="my-6" />

        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-headline font-semibold text-primary mb-6 flex items-center">
            <MessageSquare className="mr-2 h-6 w-6" /> Reader Reviews
          </h2>
          {book.reviews.length > 0 ? (
            <div className="space-y-6">
              {book.reviews.map((review, index) => (
                <Card key={index} className="bg-background shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-headline">{review.reviewer}</CardTitle>
                      <StarRating rating={review.rating} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">&ldquo;{review.text}&rdquo;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </Card>
    </div>
  );
}
