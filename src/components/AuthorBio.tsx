
'use client';

import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAuthorData } from "@/lib/localStorageUtils";
import type { Author } from "@/lib/types";

export default function AuthorBio() {
  const [authorData, setAuthorData] = useState<Author | null>(null);

  useEffect(() => {
    setAuthorData(getAuthorData());

    const handleUpdate = () => {
      setAuthorData(getAuthorData());
    };
    window.addEventListener('authorDataUpdated', handleUpdate);
    return () => window.removeEventListener('authorDataUpdated', handleUpdate);
  }, []);

  if (!authorData) {
    return (
      <Card className="max-w-3xl mx-auto my-8 p-6 sm:p-8 md:p-10 text-center">
        Loading author information...
      </Card>
    );
  }

  const { name, bio, socialLinks, authorImageUrl, authorImageHint } = authorData;

  return (
    <Card
      className="max-w-3xl mx-auto my-8 overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 relative bg-card"
      aria-label={`Author Bio Card of ${name}`}
    >
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col items-center md:items-start">
          <div className="relative aspect-square w-full max-w-[200px] md:max-w-full mx-auto md:mx-0 rounded-tl-2xl rounded-br-2xl overflow-hidden shadow-md">
            <Image
              src={authorImageUrl || 'https://placehold.co/250x250.png'}
              alt={`Portrait of ${name}`}
              fill
              className="object-cover"
              data-ai-hint={authorImageHint || 'author portrait'}
              priority
            />
          </div>
          {socialLinks && socialLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              {socialLinks.map((link) => (
                link.iconName ? ( // Check if iconName exists and is a component
                  <Button
                    key={link.platform}
                    asChild
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                    title={`Follow ${name} on ${link.platform}`}
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.iconName className="h-5 w-5" />
                      <span className="sr-only">{link.platform}</span>
                    </a>
  
                  </Button>
                ) : (
                  // Fallback if iconName is not a component (e.g. string from localStorage without mapping)
                  <Button
                    key={link.platform}
                    asChild
                    variant="secondary"
                    size="sm" 
                    className="rounded-full"
                    title={`Follow ${name} on ${link.platform}`}
                  >
                     <a href={link.url} target="_blank" rel="noopener noreferrer">
                       {link.platform}
                     </a>
                  </Button>
                )
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 relative">
          <div
            className="absolute -top-8 -right-8 w-28 h-28 sm:-top-10 sm:-right-10 sm:w-36 sm:h-36 md:-top-12 md:-right-12 md:w-44 md:h-44 lg:-top-16 lg:-right-16 bg-accent/10 rounded-full transform rotate-12 pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h1 className="font-headline text-3xl sm:text-4xl mb-4 text-primary">
              {name}
            </h1>
            <div className="font-body text-base sm:text-lg leading-relaxed text-foreground/90 space-y-4 whitespace-pre-line">
              {bio.split('\n\n').map((paragraph, index, arr) => {
                if (paragraph.startsWith("Thank you,") || paragraph.startsWith("– Hembram")) {
                  if (index > 0 && arr[index - 1].startsWith("Thank you,")) {
                    return null; 
                  }
                  let signatureText = paragraph;
                  if (index + 1 < arr.length && arr[index + 1].startsWith("– Hembram")) {
                    signatureText += "\n" + arr[index + 1];
                  }
                  return (
                    <p key={index} className="font-body text-lg sm:text-xl italic text-accent text-right mt-6">
                      {signatureText}
                    </p>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
