// src/lib/firestoreUtils.ts
// This file will contain functions to interact with Firestore
// for fetching and saving author data, book data, etc.
// We will build this out piece by piece, replacing localStorageUtils.ts functionality.

'use client'; // Some functions might still need to be client-callable initially or for specific tasks

import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, Timestamp, query, where, orderBy, limit, writeBatch } from 'firebase/firestore';
import type { Author, Book, SocialLink, PurchaseLink } from './types';
import { author as defaultAuthorConst, books as defaultBooksConst } from '@/lib/constants'; // For default/initial data

// Example structure for getting author data (we will expand this)
export async function getAuthorDataFromFirestore(): Promise<Author> {
  // For now, we'll just return a placeholder or default.
  // Later, this will fetch from Firestore.
  console.warn("getAuthorDataFromFirestore is not fully implemented yet. Returning default author.");
  
  // Simulate a Firestore document fetch structure
  const authorDocRef = doc(db, 'author', 'main'); // Assuming a single author document with ID 'main'
  try {
    const docSnap = await getDoc(authorDocRef);
    if (docSnap.exists()) {
      // Ensure socialLinks and purchaseLinks have their icons correctly mapped
      const firestoreAuthor = docSnap.data() as Author;
      
      // Map iconNames for socialLinks
      if (firestoreAuthor.socialLinks && defaultAuthorConst.socialLinks) {
        firestoreAuthor.socialLinks = firestoreAuthor.socialLinks.map(link => {
          const defaultLink = defaultAuthorConst.socialLinks.find(dl => dl.platform === link.platform);
          return { ...link, iconName: defaultLink?.iconName || link.iconName };
        });
      } else {
        firestoreAuthor.socialLinks = defaultAuthorConst.socialLinks; // Fallback if none in DB
      }
      
      // Ensure other fields have fallbacks from constants if not present in DB
      firestoreAuthor.name = firestoreAuthor.name || defaultAuthorConst.name;
      firestoreAuthor.bio = firestoreAuthor.bio || defaultAuthorConst.bio;
      firestoreAuthor.contactEmail = firestoreAuthor.contactEmail || defaultAuthorConst.contactEmail;
      firestoreAuthor.authorImageUrl = firestoreAuthor.authorImageUrl || defaultAuthorConst.authorImageUrl;
      firestoreAuthor.authorImageHint = firestoreAuthor.authorImageHint || defaultAuthorConst.authorImageHint;
      firestoreAuthor.currentlyCraftingBookTitle = firestoreAuthor.currentlyCraftingBookTitle || defaultAuthorConst.currentlyCraftingBookTitle;
      firestoreAuthor.siteTitle = firestoreAuthor.siteTitle || defaultAuthorConst.siteTitle;
      firestoreAuthor.logoUrl = firestoreAuthor.logoUrl || defaultAuthorConst.logoUrl;
      
      return firestoreAuthor;
    } else {
      console.log("No author document found in Firestore, consider seeding initial data.");
      // Optionally seed initial data if it doesn't exist
      // await seedInitialAuthorData();
      return { ...defaultAuthorConst }; // Return default if no doc exists
    }
  } catch (error) {
    console.error("Error fetching author data from Firestore:", error);
    return { ...defaultAuthorConst }; // Fallback to default in case of error
  }
}

// We will add more functions here, e.g., saveAuthorDataToFirestore, getBooksFromFirestore, etc.
// And functions to seed initial data if the database is empty.

export async function seedInitialData() {
  console.log("Attempting to seed initial data to Firestore...");

  // Seed Author Data
  const authorDocRef = doc(db, 'author', 'main');
  const authorDocSnap = await getDoc(authorDocRef);
  if (!authorDocSnap.exists()) {
    try {
      // Remove iconName before saving to Firestore
      const authorToSeed = { 
        ...defaultAuthorConst, 
        socialLinks: defaultAuthorConst.socialLinks?.map(({iconName, ...rest}) => rest) 
      };
      await setDoc(authorDocRef, authorToSeed);
      console.log("Default author data seeded successfully.");
    } catch (error) {
      console.error("Error seeding author data:", error);
    }
  } else {
    console.log("Author data already exists, skipping seeding.");
  }

  // Seed Books Data
  const booksCollectionRef = collection(db, 'books');
  const booksQuerySnapshot = await getDocs(query(booksCollectionRef, limit(1)));
  
  if (booksQuerySnapshot.empty) {
    const batch = writeBatch(db);
    defaultBooksConst.forEach(book => {
      const bookDocRef = doc(booksCollectionRef, book.id);
      // Remove iconName properties before saving to Firestore
      const bookToSeed = {
        ...book,
        genreIconName: undefined, // Remove React component before storing
        purchaseLinks: book.purchaseLinks.map(({iconName, ...rest}) => rest),
        reviews: book.reviews // Assuming reviews don't have React components directly
      };
      delete (bookToSeed as any).genreIconName; // Ensure it's removed
      batch.set(bookDocRef, bookToSeed);
    });
    try {
      await batch.commit();
      console.log("Default books data seeded successfully.");
    } catch (error) {
      console.error("Error seeding books data:", error);
    }
  } else {
    console.log("Books data already exists, skipping seeding.");
  }
}

// Call this function once, perhaps in a useEffect in a main layout or on app startup,
// or manually when you first deploy/set up.
// For a Next.js app, this might be called in a global layout server component or a client component's useEffect.
// For now, it's here for you to call as needed, e.g. from an admin utility page or manually.

// Example of how to potentially call it (don't uncomment here, call from your app logic)
// if (typeof window !== 'undefined') {
//   seedInitialData().catch(console.error);
// }
