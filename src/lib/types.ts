import type { LucideIcon } from 'lucide-react';

export interface Review {
  reviewer: string;
  text: string;
  rating: number; // 1-5 stars
}

export interface PurchaseLink {
  retailer: string;
  url: string;
  iconName?: React.ElementType<React.SVGProps<SVGSVGElement>>; // Allow any LucideIcon
}

export interface Book {
  id: string;
  title: string;
  coverArtUrl: string;
  coverArtHint: string; // For data-ai-hint
  summary: string; // Short summary for AI blurb generation
  description: string; // Longer description for the page
  genre: string;
  genreIconName?: React.ElementType<React.SVGProps<SVGSVGElement>>;
  themes: string; // e.g., "love, loss, redemption"
  targetAudience: string;
  reviews: Review[];
  purchaseLinks: PurchaseLink[];
}
