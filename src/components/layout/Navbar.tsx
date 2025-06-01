'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/constants';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background text-foreground shadow-sm border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <BookMarked size={28} className="text-primary" />
          <h1 className="text-2xl font-headline font-semibold text-primary">Hembram Writes</h1>
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm sm:text-base font-medium transition-colors relative group py-2",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-0 bottom-0 block h-[2px] w-full bg-primary transition-transform duration-300 ease-out",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
