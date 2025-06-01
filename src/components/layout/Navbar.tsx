import Link from 'next/link';
import { navLinks } from '@/lib/constants';
import { BookMarked } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookMarked size={28} />
          <h1 className="text-2xl font-headline font-semibold">Hembram Writes</h1>
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm sm:text-base font-medium hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
