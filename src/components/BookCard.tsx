
'use client'; // Needs to be client if it uses hooks or client-side data indirectly

import type { Book } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const GenreIcon = book.genreIconName; // Handle potential undefined icon from localStorage data

  return (
    <Card className="relative flex flex-col shadow-xl transition-shadow duration-300 h-full rounded-2xl bg-card">
      <div
        className="absolute -bottom-8 -right-8 w-28 h-28 sm:-bottom-10 sm:-right-10 sm:w-32 sm:h-32 bg-primary/5 rounded-full pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader className="p-0">
          <Link href={`/books/${book.id}`} className="block">
            <Image
              src={book.coverArtUrl}
              alt={`Cover of ${book.title}`}
              width={400}
              height={600}
              className="w-full h-72 object-cover rounded-t-2xl"
              data-ai-hint={book.coverArtHint}
            />
          </Link>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl font-headline mb-2 hover:text-primary transition-colors">
            <Link href={`/books/${book.id}`}>{book.title}</Link>
          </CardTitle>
          <div className="flex items-center gap-2 mb-2">
            {GenreIcon && <GenreIcon className="h-4 w-4 text-muted-foreground" />}
            <Badge variant="secondary">{book.genre}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
            {book.summary}
          </p>
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
      </div>
    </Card>
  );
}
