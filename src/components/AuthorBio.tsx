import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { author } from "@/lib/constants";
import { Feather } from "lucide-react";

export default function AuthorBio() {
  return (
    <Card className="overflow-hidden shadow-xl my-8">
      <CardHeader className="bg-secondary p-6">
        <div className="flex items-center gap-4">
          <Feather className="h-10 w-10 text-primary" />
          <CardTitle className="text-3xl font-headline text-primary">{author.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 flex justify-center">
          <Image
            src="https://placehold.co/300x300.png"
            alt={`Portrait of ${author.name}`}
            width={250}
            height={250}
            className="rounded-full shadow-lg border-4 border-accent object-cover"
            data-ai-hint="author portrait"
          />
        </div>
        <div className="md:col-span-2">
          <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
            {author.bio}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
