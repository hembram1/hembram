
// src/lib/localStorageUtils.ts
'use client'; // Ensure this can be used client-side for localStorage access

import { author as defaultAuthorConst, books as defaultBooksConst } from '@/lib/constants';
import type { Author, Book, SocialLink, Review, PurchaseLink } from '@/lib/types';

const AUTHOR_KEY = 'hembram_author_data_v2'; // Incremented version due to schema change
const BOOKS_KEY = 'hembram_books_data_v1';

function safeJsonParse<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Error parsing JSON from localStorage', e);
    return defaultValue;
  }
}

// --- Author Data ---
export function getAuthorData(): Author {
  if (typeof window === 'undefined') return { ...defaultAuthorConst };
  const storedData = localStorage.getItem(AUTHOR_KEY);
  const parsedAuthor = safeJsonParse<Author>(storedData, { ...defaultAuthorConst });
  
  if (parsedAuthor.socialLinks && defaultAuthorConst.socialLinks) {
    parsedAuthor.socialLinks = parsedAuthor.socialLinks.map(link => {
      const defaultLink = defaultAuthorConst.socialLinks.find(dl => dl.platform === link.platform);
      return { ...link, iconName: defaultLink?.iconName || link.iconName };
    });
  }
  // Ensure new fields have defaults if loading older data structure
  if (parsedAuthor.siteTitle === undefined) {
    parsedAuthor.siteTitle = defaultAuthorConst.siteTitle;
  }
  if (parsedAuthor.logoUrl === undefined) {
    parsedAuthor.logoUrl = defaultAuthorConst.logoUrl;
  }

  return parsedAuthor;
}

export function saveAuthorData(authorData: Author): void {
  if (typeof window === 'undefined') return;
  const serializableAuthor = {
    ...authorData,
    socialLinks: authorData.socialLinks?.map(sl => ({ platform: sl.platform, url: sl.url })),
    siteTitle: authorData.siteTitle,
    logoUrl: authorData.logoUrl,
  };
  localStorage.setItem(AUTHOR_KEY, JSON.stringify(serializableAuthor));
  window.dispatchEvent(new CustomEvent('authorDataUpdated'));
}

// --- Books Data ---
export function getBooksData(): Book[] {
  if (typeof window === 'undefined') return [...defaultBooksConst];
  const storedData = localStorage.getItem(BOOKS_KEY);
  const parsedBooks = safeJsonParse<Book[]>(storedData, [...defaultBooksConst]);

   return parsedBooks.map(book => {
    const defaultBook = defaultBooksConst.find(db => db.id === book.id);
    const purchaseLinks = book.purchaseLinks.map(pl => {
        const defaultPurchaseLink = defaultBook?.purchaseLinks.find(dpl => dpl.retailer === pl.retailer);
        return {...pl, iconName: defaultPurchaseLink?.iconName || pl.iconName};
    });
    return { ...book, genreIconName: defaultBook?.genreIconName || book.genreIconName, purchaseLinks };
  });
}

export function saveBooksData(booksData: Book[]): void {
  if (typeof window === 'undefined') return;
  const serializableBooks = booksData.map(book => ({
    ...book,
    genreIconName: undefined, 
    purchaseLinks: book.purchaseLinks.map(pl => ({retailer: pl.retailer, url: pl.url}))
  }));
  localStorage.setItem(BOOKS_KEY, JSON.stringify(serializableBooks));
  window.dispatchEvent(new CustomEvent('booksDataUpdated'));
}

// --- Specific Helpers ---

// Site Settings (part of Author object)
export function updateSiteSettingsInStorage(siteTitle: string, logoUrl: string): Author {
  const authorData = getAuthorData();
  authorData.siteTitle = siteTitle;
  authorData.logoUrl = logoUrl;
  saveAuthorData(authorData);
  return authorData;
}

// Author Bio
export function updateAuthorBioInStorage(name: string, bio: string): Author {
  const authorData = getAuthorData();
  authorData.name = name;
  authorData.bio = bio;
  saveAuthorData(authorData);
  return authorData;
}

// Currently Crafting
export function getCurrentlyCraftingTitleFromStorage(): string {
  const authorData = getAuthorData();
  return authorData.currentlyCraftingBookTitle || '';
}

export function saveCurrentlyCraftingTitleToStorage(title: string): Author {
  const authorData = getAuthorData();
  authorData.currentlyCraftingBookTitle = title;
  saveAuthorData(authorData);
  return authorData;
}

// Social Links (Part of Author object)
export function getSocialLinksFromStorage(): SocialLink[] {
  const authorData = getAuthorData();
  return authorData.socialLinks || [];
}

export function addSocialLinkToStorage(newLink: Omit<SocialLink, 'iconName'>): Author {
  const authorData = getAuthorData();
  const linkToAdd: SocialLink = { ...newLink, iconName: undefined }; 
  const defaultLink = defaultAuthorConst.socialLinks?.find(sl => sl.platform.toLowerCase() === newLink.platform.toLowerCase());
  if (defaultLink) {
    linkToAdd.iconName = defaultLink.iconName;
  }
  authorData.socialLinks = [...(authorData.socialLinks || []), linkToAdd];
  saveAuthorData(authorData);
  return authorData;
}

export function updateSocialLinkInStorage(originalPlatform: string, updatedLinkValues: Omit<SocialLink, 'iconName'>): Author {
  const authorData = getAuthorData();
  const defaultLink = defaultAuthorConst.socialLinks?.find(sl => sl.platform.toLowerCase() === updatedLinkValues.platform.toLowerCase());
  authorData.socialLinks = (authorData.socialLinks || []).map(link =>
    link.platform === originalPlatform ? { ...updatedLinkValues, iconName: defaultLink?.iconName || undefined } : link
  );
  saveAuthorData(authorData);
  return authorData;
}

export function deleteSocialLinkFromStorage(platformToDelete: string): Author {
  const authorData = getAuthorData();
  authorData.socialLinks = (authorData.socialLinks || []).filter(link => link.platform !== platformToDelete);
  saveAuthorData(authorData);
  return authorData;
}

// Books
export function addBookToStorage(newBookData: Omit<Book, 'id' | 'genreIconName'> & { purchaseLinks: PurchaseLink[], reviews: Review[] }): Book {
  const books = getBooksData();
  const newBook: Book = {
    id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...newBookData,
    purchaseLinks: newBookData.purchaseLinks?.map(pl => ({ ...pl, iconName: undefined })),
    genreIconName: undefined,
  };
  const defaultBookMatch = defaultBooksConst.find(db => db.genre.toLowerCase() === newBook.genre.toLowerCase());
  if (defaultBookMatch) {
      newBook.genreIconName = defaultBookMatch.genreIconName;
      newBook.purchaseLinks = newBook.purchaseLinks.map(pl => {
          const defaultPL = defaultBookMatch.purchaseLinks.find(dpl => dpl.retailer === pl.retailer);
          return {...pl, iconName: defaultPL?.iconName};
      });
  }

  const updatedBooks = [...books, newBook];
  saveBooksData(updatedBooks);
  return newBook;
}

export function updateBookInStorage(bookId: string, updatedBookData: Omit<Book, 'id' | 'genreIconName'> & { purchaseLinks: PurchaseLink[], reviews: Review[] }): Book | undefined {
  let books = getBooksData();
  let bookToUpdate: Book | undefined;
  const updatedBooks = books.map(book => {
    if (book.id === bookId) {
      bookToUpdate = {
        ...book, // Preserve existing ID, reviews, purchase links unless explicitly changed
        ...updatedBookData, // Apply updates
        // Ensure complex fields are handled
        purchaseLinks: updatedBookData.purchaseLinks?.map(pl => ({ ...pl, iconName: undefined })) || book.purchaseLinks,
        reviews: updatedBookData.reviews || book.reviews,
        genreIconName: undefined, 
      };
      const defaultBookMatch = defaultBooksConst.find(db => db.genre.toLowerCase() === bookToUpdate!.genre.toLowerCase());
      if (defaultBookMatch) {
          bookToUpdate.genreIconName = defaultBookMatch.genreIconName;
           bookToUpdate.purchaseLinks = bookToUpdate.purchaseLinks.map(pl => {
              const defaultPL = defaultBookMatch.purchaseLinks.find(dpl => dpl.retailer === pl.retailer);
              return {...pl, iconName: defaultPL?.iconName};
          });
      }
      return bookToUpdate;
    }
    return book;
  });
  saveBooksData(updatedBooks);
  return bookToUpdate;
}


export function deleteBookFromStorage(bookId: string): Book[] {
  const books = getBooksData();
  const updatedBooks = books.filter(book => book.id !== bookId);
  saveBooksData(updatedBooks);
  return updatedBooks;
}

// Initialize if not present
if (typeof window !== 'undefined') {
  if (!localStorage.getItem(AUTHOR_KEY)) {
    // Check if siteTitle or logoUrl are missing from constants, add them if so
    const initialAuthorData = {...defaultAuthorConst};
    if (initialAuthorData.siteTitle === undefined) initialAuthorData.siteTitle = "Hembram - Official Author Website";
    if (initialAuthorData.logoUrl === undefined) initialAuthorData.logoUrl = "";
    saveAuthorData(initialAuthorData);
  }
  if (!localStorage.getItem(BOOKS_KEY)) {
    saveBooksData(defaultBooksConst);
  }
}
