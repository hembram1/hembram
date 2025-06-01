import Image from "next/image";
import { Card } from "@/components/ui/card";
import { author } from "@/lib/constants";

export default function AuthorBio() {
  return (
    <Card
      className="max-w-3xl mx-auto my-8 overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 relative bg-card"
      aria-label={`Author Bio Card of ${author.name}`}
    >
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
        {/* Image Section (Left) */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="relative aspect-square w-full max-w-[200px] md:max-w-full mx-auto md:mx-0 rounded-lg overflow-hidden shadow-md">
            <Image
              src={author.authorImageUrl || 'https://placehold.co/250x250.png'}
              alt={`Portrait of ${author.name}`}
              fill
              className="object-cover"
              data-ai-hint={author.authorImageHint || 'author portrait'}
              priority
            />
          </div>
        </div>

        {/* Text Section (Right) */}
        <div className="w-full md:w-2/3 relative">
          <div
            className="absolute -top-12 -right-12 md:-top-16 md:-right-20 w-40 h-40 md:w-52 md:h-52 bg-accent/10 rounded-full transform rotate-45 pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h1 className="font-headline text-3xl sm:text-4xl mb-4 text-primary">
              {author.name}
            </h1>
            <div className="font-body text-base sm:text-lg leading-relaxed text-foreground/90 space-y-4 whitespace-pre-line">
              {author.bio.split('\n\n').map((paragraph, index, arr) => {
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
