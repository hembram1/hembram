
import type { LucideIcon } from 'lucide-react';

export interface Review {
  reviewer: string;
  text: string;
  rating: number; // 1-5 stars
}

export interface PurchaseLink {
  retailer: string;
  url: string;
  iconName?: React.ElementType<React.SVGProps<SVGSVGElement>>;
}

export interface SocialLink {
  platform: string;
  url: string;
  iconName?: React.ElementType<React.SVGProps<SVGSVGElement>>;
}

export interface Author {
  name: string;
  bio: string;
  contactEmail: string;
  authorImageUrl?: string;
  authorImageHint?: string;
  socialLinks?: SocialLink[];
  currentlyCraftingBookTitle?: string;
  siteTitle?: string;
  logoUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  coverArtUrl: string;
  coverArtHint: string; 
  summary: string; 
  description: string; 
  genre: string;
  genreIconName?: React.ElementType<React.SVGProps<SVGSVGElement>>;
  themes: string; 
  targetAudience: string;
  reviews: Review[];
  purchaseLinks: PurchaseLink[];
}

