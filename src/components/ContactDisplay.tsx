
import { author } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtSign, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactForm from "./ContactForm";

export default function ContactDisplay() {
  return (
    <div className="space-y-10">
      <Card className="max-w-2xl mx-auto shadow-xl overflow-hidden rounded-2xl relative bg-card">
        <div 
          className="absolute -top-8 -right-10 w-32 h-32 sm:-top-10 sm:-right-12 sm:w-36 sm:h-36 md:-top-12 md:-right-16 md:w-40 md:h-40 bg-accent/10 rounded-full transform rotate-12 pointer-events-none -z-0" 
          aria-hidden="true" 
        />
        <div className="relative z-10">
          <CardHeader className="text-center p-6 md:p-8">
            <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl font-headline text-primary">Send a Message</CardTitle>
            <CardDescription className="text-md text-foreground/80 mt-2">
              {author.name} would love to hear from you! Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
            <ContactForm />
          </CardContent>
        </div>
      </Card>

      {author.socialLinks && author.socialLinks.length > 0 && (
        <Card className="max-w-2xl mx-auto shadow-xl overflow-hidden rounded-2xl relative bg-card">
          <div 
            className="absolute -bottom-8 -left-10 w-32 h-32 sm:-bottom-10 sm:-left-12 sm:w-36 sm:h-36 md:-bottom-12 md:-left-16 md:w-40 md:h-40 bg-primary/5 rounded-full transform -rotate-12 pointer-events-none -z-0" 
            aria-hidden="true" 
          />
           <div className="relative z-10">
            <CardHeader className="text-center p-6 md:p-8">
              <AtSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-headline text-primary">Follow Me</CardTitle>
              <CardDescription className="text-md text-foreground/80 mt-2">
                Connect with {author.name} on social media.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0 text-center">
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
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
}
