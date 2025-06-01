import ContactDisplay from "@/components/ContactDisplay";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <header className="mb-10 text-center py-8 bg-secondary/30 rounded-lg shadow-sm">
        <div className="flex justify-center items-center mb-3">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-body font-medium text-primary inline-block pb-2 border-b-2 border-primary">Contact Hembram</h1>
        <p className="mt-4 text-lg text-foreground/80">
          Connect with the author, share your thoughts, or inquire about collaborations.
        </p>
      </header>
      <ContactDisplay />
    </div>
  );
}
