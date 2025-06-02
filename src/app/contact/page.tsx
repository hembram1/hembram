
import ContactDisplay from "@/components/ContactDisplay";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <Card className="max-w-3xl mx-auto mb-10 overflow-hidden shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 relative bg-card text-center">
        <div
          className="absolute -top-8 -right-8 w-28 h-28 sm:-top-10 sm:-right-10 sm:w-36 sm:h-36 md:-top-12 md:-right-12 md:w-44 md:h-44 lg:-top-16 lg:-right-16 bg-primary/5 rounded-full transform rotate-12 pointer-events-none -z-0"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex justify-center items-center mb-3">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-semibold text-primary inline-block pb-2 border-b-2 border-primary">Contact Hembram</h1>
          <p className="mt-4 text-lg text-foreground/80">
            Connect with the author, share your thoughts, or inquire about collaborations.
          </p>
        </div>
      </Card>
      <ContactDisplay />
    </div>
  );
}
