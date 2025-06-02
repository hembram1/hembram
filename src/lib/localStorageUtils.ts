
// src/lib/localStorageUtils.ts
'use client'; // Ensure this can be used client-side for localStorage access

import { author as defaultAuthorConst, books as defaultBooksConst } from '@/lib/constants';
import type { Author, Book, SocialLink, Review, PurchaseLink } from '@/lib/types';

const AUTHOR_KEY = 'hembram_author_data_v2';
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

// Helper function to ensure reviews and purchaseLinks are arrays
function ensureBookArrays(book: Book | Omit<Book, 'id'> | Partial<Book>): Book {
  const completeBook = book as Book; // Cast for easier handling, assuming id will be present or added
  return {
    ...completeBook,
    reviews: Array.isArray(completeBook.reviews) ? completeBook.reviews : [],
    purchaseLinks: Array.isArray(completeBook.purchaseLinks) ? completeBook.purchaseLinks : [],
  };
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
  if (typeof window === 'undefined') return [...defaultBooksConst].map(ensureBookArrays);
  const storedData = localStorage.getItem(BOOKS_KEY);
  // Provide defaultBooksConst, ensuring each book in it also passes through ensureBookArrays
  const parsedBooks = safeJsonParse<Book[]>(storedData, [...defaultBooksConst].map(ensureBookArrays));

   return parsedBooks.map(book => {
    const bookWithEnsuredArrays = ensureBookArrays(book); // Ensure arrays before icon mapping
    const defaultBook = defaultBooksConst.find(db => db.id === bookWithEnsuredArrays.id);

    const purchaseLinksWithIcons = (bookWithEnsuredArrays.purchaseLinks).map(pl => {
        const defaultPurchaseLink = defaultBook?.purchaseLinks.find(dpl => dpl.retailer === pl.retailer);
        return {...pl, iconName: defaultPurchaseLink?.iconName || pl.iconName};
    });
    return {
      ...bookWithEnsuredArrays,
      genreIconName: defaultBook?.genreIconName || bookWithEnsuredArrays.genreIconName,
      purchaseLinks: purchaseLinksWithIcons
    };
  });
}

export function saveBooksData(booksData: Book[]): void {
  if (typeof window === 'undefined') return;
  const serializableBooks = booksData.map(book => {
    const cleanBook = ensureBookArrays(book); // Ensure arrays are present before serialization
    return {
    ...cleanBook,
    genreIconName: undefined, 
    purchaseLinks: cleanBook.purchaseLinks.map(pl => ({retailer: pl.retailer, url: pl.url}))
    };
  });
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
// Type for newBookData in addBookToStorage ensures that if purchaseLinks/reviews are provided, they are arrays.
// For simpler forms, they might be omitted, and then ensureBookArrays will default them to [].
export function addBookToStorage(newBookData: Omit<Book, 'id' | 'genreIconName'>): Book {
  const books = getBooksData(); // Ensures existing books are clean

  // Ensure the new book data also has arrays for reviews and purchaseLinks
  const newBookWithEnsuredArrays = ensureBookArrays({
      ...newBookData, // Form data
      // Explicitly ensure reviews and purchaseLinks are arrays if not already
      reviews: Array.isArray(newBookData.reviews) ? newBookData.reviews : [],
      purchaseLinks: Array.isArray(newBookData.purchaseLinks) ? newBookData.purchaseLinks : [],
  });


  const newBook: Book = {
    id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...newBookWithEnsuredArrays, // Contains form data + ensured arrays
    genreIconName: undefined, // Will be set by logic below
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
  saveBooksData(updatedBooks); // saveBooksData will also call ensureBookArrays on each book
  return newBook;
}

// 'updates' comes from BookFormData, which doesn't include reviews or purchaseLinks.
// So we merge with the existing book from localStorage which *should* have these as arrays due to getBooksData.
export function updateBookInStorage(bookId: string, updates: Partial<Omit<Book, 'id' | 'genreIconName'>>): Book | undefined {
  let books = getBooksData(); // Ensures all books in 'books' have .reviews and .purchaseLinks as arrays
  let foundBookToUpdate: Book | undefined;

  const updatedBooks = books.map(book => {
    if (book.id === bookId) {
      // 'book' here is guaranteed by getBooksData to have .reviews and .purchaseLinks as arrays.
      // 'updates' contains only the fields from the form.
      const mergedBookData = {
        ...book,    // Existing book data (with arrays for reviews/purchaseLinks)
        ...updates, // Form updates (simple fields like title, summary, etc.)
      };
      
      // Ensure merged data still has arrays (though spread from 'book' should ensure this)
      // and then apply icon logic.
      foundBookToUpdate = ensureBookArrays(mergedBookData) as Book;


      const defaultBookMatch = defaultBooksConst.find(db => db.genre.toLowerCase() === foundBookToUpdate!.genre.toLowerCase());
      if (defaultBookMatch) {
          foundBookToUpdate.genreIconName = defaultBookMatch.genreIconName;
           foundBookToUpdate.purchaseLinks = foundBookToUpdate.purchaseLinks.map(pl => {
              const defaultPL = defaultBookMatch.purchaseLinks.find(dpl => dpl.retailer === pl.retailer);
              return {...pl, iconName: defaultPL?.iconName};
          });
      } else {
        foundBookToUpdate.genreIconName = undefined;
      }
      return foundBookToUpdate;
    }
    return book;
  });

  if (!foundBookToUpdate) {
    console.warn(`Book with ID ${bookId} not found for update.`);
    return undefined;
  }
  
  saveBooksData(updatedBooks); // saveBooksData also calls ensureBookArrays on each book
  return foundBookToUpdate;
}


export function deleteBookFromStorage(bookId: string): Book[] {
  const books = getBooksData();
  const updatedBooks = books.filter(book => book.id !== bookId);
  saveBooksData(updatedBooks);
  return updatedBooks;
}

// Manage Purchase Links for a specific book
export function addPurchaseLinkToBookInStorage(bookId: string, newLink: Omit<PurchaseLink, 'iconName'>): Book | undefined {
  const books = getBooksData();
  let bookToReturn: Book | undefined = undefined;

  const updatedBooks = books.map(book => {
    if (book.id === bookId) {
      const linkToAdd: PurchaseLink = { ...newLink, iconName: undefined };

      // Attempt to find a default icon for this retailer from constants
      const defaultBookDefinition = defaultBooksConst.find(db => 
        db.id === bookId || db.genre.toLowerCase() === book.genre.toLowerCase()
      );
      if (defaultBookDefinition) {
        const defaultPurchaseLink = defaultBookDefinition.purchaseLinks.find(dpl => dpl.retailer.toLowerCase() === newLink.retailer.toLowerCase());
        if (defaultPurchaseLink) {
          linkToAdd.iconName = defaultPurchaseLink.iconName;
        }
      }
      
      // Ensure purchaseLinks array exists and add the new link
      book.purchaseLinks = [...(book.purchaseLinks || []), linkToAdd];
      bookToReturn = book; // The book object is modified directly
      return book; // Return the modified book
    }
    return book; // Return other books as they are
  });

  if (bookToReturn) {
    saveBooksData(updatedBooks); // Save the entire updated books array
    // Re-fetch the specific book to ensure it has all transformations applied by getBooksData
    return getBooksData().find(b => b.id === bookId);
  }
  console.warn(`Book with ID ${bookId} not found, could not add purchase link.`);
  return undefined;
}

export function deletePurchaseLinkFromBookInStorage(bookId: string, retailerToDelete: string): Book | undefined {
  const books = getBooksData();
  let bookToReturn: Book | undefined = undefined;

  const updatedBooks = books.map(book => {
    if (book.id === bookId) {
      // Ensure purchaseLinks array exists and filter out the link
      book.purchaseLinks = (book.purchaseLinks || []).filter(link => link.retailer !== retailerToDelete);
      bookToReturn = book; // The book object is modified directly
      return book; // Return the modified book
    }
    return book; // Return other books as they are
  });

  if (bookToReturn) {
    saveBooksData(updatedBooks); // Save the entire updated books array
    // Re-fetch the specific book to ensure it has all transformations applied by getBooksData
    return getBooksData().find(b => b.id === bookId);
  }
  console.warn(`Book with ID ${bookId} not found, could not delete purchase link.`);
  return undefined;
}


// Initialize if not present
if (typeof window !== 'undefined') {
  if (!localStorage.getItem(AUTHOR_KEY)) {
    const initialAuthorData = {...defaultAuthorConst};
    if (initialAuthorData.siteTitle === undefined) initialAuthorData.siteTitle = "Hembram - Official Author Website";
    if (initialAuthorData.logoUrl === undefined) initialAuthorData.logoUrl = "";
    saveAuthorData(initialAuthorData);
  }
  if (!localStorage.getItem(BOOKS_KEY)) {
    // saveBooksData internally calls ensureBookArrays for each book
    saveBooksData(defaultBooksConst);
  }
}
    
