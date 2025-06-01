import { Card } from "@/components/ui/card";
import { author } from "@/lib/constants";

export default function AuthorBio() {
  // The bio text from constants.ts already includes the main paragraphs and signature
  // We'll use whitespace-pre-line to preserve the formatting.

  return (
    <Card 
      className="max-w-2xl mx-auto my-8 overflow-hidden shadow-xl rounded-2xl p-8 md:p-10 relative bg-card"
      aria-label={`Author Bio Card of ${author.name}`}
    >
      {/* Decorative element inspired by the provided CSS */}
      <div 
        className="absolute -top-12 -right-16 sm:-top-16 sm:-right-20 w-48 h-48 sm:w-52 sm:h-52 bg-accent/10 rounded-full transform rotate-45 pointer-events-none"
        aria-hidden="true"
      />
      
      <div className="relative z-10">
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl mb-6 text-primary">
          {author.name}
        </h1>
        
        {/* The author.bio string contains multiple paragraphs and the signature, separated by newlines.
            The whitespace-pre-line class will handle rendering these correctly. */}
        <div className="font-body text-base sm:text-lg leading-relaxed text-foreground/90 space-y-4 whitespace-pre-line">
          {author.bio.split('\n\n').map((paragraph, index, arr) => {
            // Check if this is the signature paragraph
            if (paragraph.startsWith("Thank you,") || paragraph.startsWith("– Hembram")) {
               // Combine last two paragraphs if they are the signature lines.
              if (index > 0 && arr[index-1].startsWith("Thank you,")) {
                return null; // Already handled
              }
              let signatureText = paragraph;
              if (index + 1 < arr.length && arr[index+1].startsWith("– Hembram")) {
                signatureText += "\n" + arr[index+1];
              }
              
              return (
                <p key={index} className="font-body text-lg sm:text-xl italic text-accent text-right mt-8">
                  {signatureText}
                </p>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </div>
    </Card>
  );
}
