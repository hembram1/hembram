import { author } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {currentYear} {author.name}. All rights reserved.</p>
        <p className="text-xs mt-1">Discover the worlds crafted by Hembram.</p>
      </div>
    </footer>
  );
}
