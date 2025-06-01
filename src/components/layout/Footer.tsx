import { author } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 text-center relative overflow-hidden">
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32 md:-bottom-12 md:-left-12 sm:w-40 sm:h-40 bg-accent/10 rounded-full transform -rotate-12 pointer-events-none -z-0"
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
