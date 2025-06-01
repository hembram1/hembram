import { author } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

export default function ContactDisplay() {
  return (
    <Card className="max-w-2xl mx-auto shadow-xl my-8">
      <CardHeader className="text-center bg-secondary p-6">
        <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
        <CardTitle className="text-3xl font-headline text-primary">Get in Touch</CardTitle>
        <CardDescription className="text-md text-foreground/80">
          {author.name} loves to hear from readers. Feel free to reach out!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8 text-center">
        <p className="text-lg text-foreground/90 mb-4">
          For inquiries, comments, or just to say hello, you can contact {author.name} via email:
        </p>
        <a
          href={`mailto:${author.contactEmail}`}
          className="text-xl font-semibold text-accent hover:underline break-all"
        >
          {author.contactEmail}
        </a>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href={`mailto:${author.contactEmail}`}>
              <Send className="mr-2 h-5 w-5" /> Send an Email
            </a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Please allow a few business days for a response, especially during busy writing periods.
        </p>
      </CardContent>
    </Card>
  );
}
