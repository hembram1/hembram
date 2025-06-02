
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/constants'; // navLinks is static
import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getAuthorData } from '@/lib/localStorageUtils';
import type { Author } from '@/lib/types';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [siteTitle, setSiteTitle] = useState('Hembram'); // Default title
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const updateNavbarData = () => {
      const authorData = getAuthorData();
      setSiteTitle(authorData.siteTitle || 'Hembram');
      setLogoUrl(authorData.logoUrl || '');
    };

    updateNavbarData(); // Initial load

    window.addEventListener('authorDataUpdated', updateNavbarData);
    return () => {
      window.removeEventListener('authorDataUpdated', updateNavbarData);
    };
  }, []);


  return (
    <>
      {/* Top Header (Logo + Desktop Nav) */}
      <header className="bg-background/80 backdrop-blur-lg sticky top-0 z-50 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-4">
          {/* Logo / Brand Name Pill */}
          <div className="bg-card/80 backdrop-blur-lg shadow-md rounded-tl-2xl rounded-br-2xl py-1.5 px-4 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-80"
            >
              {logoUrl ? (
                 <Image src={logoUrl} alt={`${siteTitle} logo`} width={24} height={24} className="h-5 w-5 sm:h-6 sm:w-6 object-contain" />
              ) : (
                <BookMarked className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              )}
              <span className="text-lg sm:text-xl font-headline font-semibold text-primary">
                {siteTitle}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Individual Pills */}
          <nav className="hidden md:flex items-center space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div 
                  key={link.href}
                  className="bg-card/80 backdrop-blur-lg shadow-md rounded-tl-2xl rounded-br-2xl py-1.5 px-3"
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background"
                    )}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-lg border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.08)] h-14">
        <div className="mx-auto h-full flex justify-around items-center px-2 space-x-1 sm:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div
                key={link.href}
                className="bg-card/80 backdrop-blur-lg shadow-md rounded-tl-xl rounded-br-xl py-1.5 px-2.5 flex-1 text-center"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-xs font-medium transition-colors w-full inline-block",
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary",
                  )}
                >
                  <span className="truncate">{link.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
