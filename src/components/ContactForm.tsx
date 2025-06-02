
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
// react-hook-form, zod, useToast, and server action (submitContactForm) are no longer needed for Formspree.

export default function ContactForm() {
  // Client-side validation and toast messages are handled by Formspree or can be added with custom JS if needed.
  // For simplicity with Formspree, we'll rely on its built-in mechanisms or simple HTML5 validation.

  return (
    // VERY IMPORTANT: Replace "YOUR_FORM_ID" with your actual Formspree form ID.
    <form
      action="https://formspree.io/f/YOUR_FORM_ID"
      method="POST"
      className="space-y-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Full Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Your Name"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Address</Label>
        <Input
          type="email"
          name="email" // Formspree uses this 'name' attribute
          id="email"
          placeholder="your.email@example.com"
          required
          className="w-full"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          name="message" // Formspree uses this 'name' attribute
          id="message"
          placeholder="Your message..."
          className="min-h-[120px] w-full"
          required
          minLength={10}
        />
        {/* Basic HTML5 validation like minLength can still be useful.
            Formspree also provides its own validation. */}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Send className="mr-2 h-5 w-5" />
        Send Message
      </Button>
    </form>
  );
}
