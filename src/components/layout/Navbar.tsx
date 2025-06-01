
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/constants';
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-4">
        {/* Logo / Brand Name Pill */}
        <div className="bg-card/80 backdrop-blur-sm shadow-md rounded-tl-2xl rounded-br-2xl py-1.5 px-4 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            <BookMarked className="h-7 w-7 text-primary" />
            <span className="text-2xl font-headline font-semibold text-primary">
              Hembram
            </span>
          </Link>
        </div>

        {/* Navigation Links Pill */}
        <nav className="bg-card/80 backdrop-blur-sm shadow-md rounded-tl-2xl rounded-br-2xl py-2 px-5 flex items-center space-x-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group py-2 px-3 rounded-full", // Adjusted text size and padding
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
