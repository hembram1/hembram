
import { author } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Share2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ContactForm from "./ContactForm";

export default function ContactDisplay() {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl my-8">
      <CardHeader className="text-center bg-secondary p-6 rounded-t-lg">
        <MessageSquare className="h-12 w-12 text-primary mx-auto mb-3" />
        <CardTitle className="text-3xl font-headline text-primary">Send a Message</CardTitle>
        <CardDescription className="text-md text-foreground/80 mt-1">
          {author.name} would love to hear from you! Fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <ContactForm />

        {author.socialLinks && author.socialLinks.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-headline text-primary mb-6 flex items-center justify-center">
                <Share2 className="mr-3 h-6 w-6" /> Follow Me
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {author.socialLinks.map((link) => (
                  <Button 
                    key={link.platform} 
                    asChild 
                    variant="outline" 
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transform transition-transform duration-150 ease-in-out hover:scale-105"
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.iconName && <link.iconName className="mr-2 h-5 w-5" />}
                      {link.platform}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
