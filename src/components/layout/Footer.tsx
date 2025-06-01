
import { author } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 text-center relative overflow-hidden">
          <div
            className="absolute -bottom-8 -left-8 w-28 h-28 sm:-bottom-10 sm:-left-10 sm:w-32 sm:h-32 md:-bottom-12 md:-left-12 md:w-40 md:h-40 bg-accent/10 rounded-full transform -rotate-12 pointer-events-none -z-0"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <p className="text-sm">&copy; {currentYear} {author.name}. All rights reserved.</p>
            <p className="text-xs mt-1">Discover the worlds crafted by Hembram.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
