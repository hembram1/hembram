
import type { Book, Author } from './types';
import { BookOpen, Users, Feather, Heart, Shield, Rocket, Microscope, Drama, Library, Mail, Twitter, Instagram, Linkedin, Facebook, X, PenTool } from 'lucide-react';

export const author: Author = {
  name: 'Hembram',
  bio: "I’m Hembram — someone who doesn’t just live life but truly feels it… and through stories, I try to express those emotions to the world.\n\nWriting, for me, isn’t just an art — it’s a journey. Every word, every scene, every character is tied to something real inside me. I write the kind of stories that come not just from the mind, but straight from the heart. Whether it’s childhood memories or moments from youth, the colors of love or the silence of loneliness — I try to bring every emotion to life through my words.\n\nPeople often ask me, “Why do you write?” And my answer is simple — because some things can only be said through writing.\n\nIf you love stories filled with raw emotions — a bit of truth, a touch of dreams, some pain, and a little smile — then maybe my books will speak to your heart.\n\nThank you,\n– Hembram",
  contactEmail: 'contact@hembramwrites.com',
  authorImageUrl: 'https://placehold.co/250x250.png',
  authorImageHint: 'author portrait',
  socialLinks: [
    { platform: 'X (Twitter)', url: 'https://twitter.com/hembramwrites', iconName: X },
    { platform: 'Instagram', url: 'https://instagram.com/hembramwrites', iconName: Instagram },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/hembramwrites', iconName: Linkedin },
    { platform: 'Facebook', url: 'https://facebook.com/hembramwrites', iconName: Facebook },
  ],
  currentlyCraftingBookTitle: "The Serpent's Cipher",
  siteTitle: "Hembram - Official Author Website",
  logoUrl: "", // Intentionally empty, can be set via admin
};

export const books: Book[] = [
  {
    id: 'the-crimson-river',
    title: 'The Crimson River',
    coverArtUrl: 'https://placehold.co/300x450.png',
    coverArtHint: 'fantasy river',
    summary: 'A young sorceress must harness her forbidden powers to save her kingdom from a creeping darkness that flows through the ancient Crimson River.',
    description: 'In the mystical realm of Eldoria, the Crimson River is both a source of life and a harbinger of shadow. Elara, a young woman discovering her latent magical abilities, finds herself at the center of a prophecy foretelling the return of an ancient evil. She must navigate treacherous political landscapes, master her powers, and confront the darkness threatening to consume everything she holds dear.',
    genre: 'Fantasy',
    genreIconName: Feather,
    themes: 'good vs evil, magic, destiny, courage',
    targetAudience: 'Young adults, fantasy lovers',
    reviews: [], // Reviews removed
    purchaseLinks: [
      { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=The+Crimson+River+Hembram', iconName: BookOpen },
      // { retailer: 'Local Bookstore', url: '#', iconName: BookOpen }, // Other links can be kept for data completeness but won't show if Amazon link is prioritized
    ],
  },
  {
    id: 'echoes-of-tomorrow',
    title: 'Echoes of Tomorrow',
    coverArtUrl: 'https://placehold.co/300x450.png',
    coverArtHint: 'futuristic city',
    summary: 'In a dystopian future, a historian uncovers a truth that could shatter their rigidly controlled society or be their only salvation.',
    description: 'The year is 2242. Society is governed by the OmniMind, an AI that ensures peace and order at the cost of individual freedom. Kael, a state-sanctioned historian, stumbles upon fragmented records of a past filled with rebellion and hope. As he pieces together forbidden knowledge, he must decide whether to conform or risk everything to awaken a complacent populace.',
    genre: 'Science Fiction',
    genreIconName: Rocket,
    themes: 'dystopia, technology, rebellion, truth',
    targetAudience: 'Sci-fi enthusiasts, fans of dystopian stories',
    reviews: [], // Reviews removed
    purchaseLinks: [
      { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=Echoes+of+Tomorrow+Hembram', iconName: BookOpen },
      // { retailer: 'E-Reads Central', url: '#', iconName: BookOpen },
      // { retailer: 'Galaxy Books', url: '#', iconName: BookOpen },
    ],
  },
  {
    id: 'whispers-in-the-heather',
    title: 'Whispers in the Heather',
    coverArtUrl: 'https://placehold.co/300x450.png',
    coverArtHint: 'scottish highlands',
    summary: 'A historical romance set in the rugged Scottish Highlands, where a laird\'s daughter finds love in the most unexpected of places amidst clan rivalries.',
    description: 'Isobel, daughter of the powerful Clan MacLeod, is caught between her duty to her family and the stirrings of her heart. When a mysterious stranger from a rival clan arrives, secrets unravel and passions ignite. Amidst the backdrop of breathtaking landscapes and ancient feuds, Isobel must choose her path, one that could either unite or destroy the clans.',
    genre: 'Historical Romance',
    genreIconName: Heart,
    themes: 'love, duty, clan rivalry, Scotland',
    targetAudience: 'Readers of historical romance, Scottish history buffs',
    reviews: [], // Reviews removed
    purchaseLinks: [
      { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=Whispers+in+the+Heather+Hembram', iconName: BookOpen },
      // { retailer: 'Book Depository', url: '#', iconName: BookOpen },
    ],
  },
];

export const navLinks = [
  { href: '/', label: 'About' },
  { href: '/books', label: 'Books' },
  { href: '/contact', label: 'Contact' },
];
