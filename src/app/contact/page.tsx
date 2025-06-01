import ContactDisplay from "@/components/ContactDisplay";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Contact Hembram</h1>
        <p className="mt-2 text-lg text-foreground/80">
          Connect with the author, share your thoughts, or inquire about collaborations.
        </p>
      </header>
      <Separator className="my-8" />
      <ContactDisplay />
    </div>
  );
}
