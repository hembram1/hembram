
import type { Book } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const averageRating = book.reviews.length > 0
    ? book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length
    : 0;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/books/${book.id}`} className="block">
          <Image
            src={book.coverArtUrl}
            alt={`Cover of ${book.title}`}
            width={400}
            height={600}
            className="w-full h-72 object-cover"
            data-ai-hint={book.coverArtHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2 hover:text-primary transition-colors">
          <Link href={`/books/${book.id}`}>{book.title}</Link>
        </CardTitle>
        <div className="flex items-center gap-2 mb-2">
          {book.genreIconName && <book.genreIconName className="h-4 w-4 text-muted-foreground" />}
          <Badge variant="secondary">{book.genre}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {book.summary}
        </p>
        {averageRating > 0 && (
          <div className="flex items-center text-sm text-amber-500 mb-2">
            <Star className="h-4 w-4 fill-amber-500 mr-1" />
            {averageRating.toFixed(1)} ({book.reviews.length} reviews)
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          asChild 
          variant="outline" 
          className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <Link href={`/books/${book.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
