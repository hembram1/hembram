import type { Book } from './types';
import { BookOpen, Users, Feather, Heart, Shield, Rocket, Microscope, Drama } from 'lucide-react';

export const author = {
  name: 'Hembram',
  bio: "Hembram is a passionate storyteller, weaving intricate narratives that explore the depths of human emotion and the complexities of the world around us. With a unique voice and a keen eye for detail, Hembram's works transport readers to other realms, challenge perspectives, and linger in the imagination long after the final page is turned. Welcome to a world crafted from words.",
  contactEmail: 'contact@hembramwrites.com',
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
    reviews: [
      { reviewer: 'Lit Monthly', text: 'A breathtaking debut, Hembram is a new voice to watch in fantasy.', rating: 5 },
      { reviewer: 'Reader Digest', text: 'Compelling characters and a richly imagined world.', rating: 4 },
    ],
    purchaseLinks: [
      { retailer: 'Amazon', url: '#', iconName: BookOpen },
      { retailer: 'Local Bookstore', url: '#', iconName: BookOpen },
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
    reviews: [
      { reviewer: 'Sci-Fi Chronicle', text: 'A thought-provoking tale that resonates with current anxieties.', rating: 4 },
      { reviewer: 'TechReads', text: 'Intriguing plot with a chillingly plausible future.', rating: 5 },
    ],
    purchaseLinks: [
      { retailer: 'E-Reads Central', url: '#', iconName: BookOpen },
      { retailer: 'Galaxy Books', url: '#', iconName: BookOpen },
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
    reviews: [
      { reviewer: 'Romance Times', text: 'Sweeping and romantic, a true escape!', rating: 5 },
      { reviewer: 'Historical Fiction Review', text: 'Hembram captures the spirit of the Highlands beautifully.', rating: 4 },
    ],
    purchaseLinks: [
      { retailer: 'Amazon', url: '#', iconName: BookOpen },
      { retailer: 'Book Depository', url: '#', iconName: BookOpen },
    ],
  },
];

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/contact', label: 'Contact' },
];
