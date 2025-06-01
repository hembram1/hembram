
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/constants';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
        {/* Logo / Brand Name */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
        >
          <BookMarked size={28} className="text-primary" />
          <span className="text-2xl font-headline font-semibold text-primary">
            Hembram Writes
          </span>
        </Link>

        {/* Navigation Links Pill */}
        <nav className="bg-card/80 backdrop-blur-sm shadow-md rounded-full py-1.5 px-3 sm:py-2 sm:px-5 flex items-center space-x-1 sm:space-x-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs sm:text-sm font-medium transition-colors relative group py-2 px-2 sm:px-3 rounded-full",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary hover:bg-muted/50",
                   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-0 bottom-0.5 block h-[2px] w-full bg-primary transition-transform duration-300 ease-out",
                    isActive ? "scale-x-75" : "scale-x-0 group-hover:scale-x-75"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
