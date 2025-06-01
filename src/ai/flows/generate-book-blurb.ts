// src/ai/flows/generate-book-blurb.ts
'use server';

/**
 * @fileOverview Generates a promotional blurb for a book using AI.
 *
 * - generateBookBlurb - A function that generates a book blurb.
 * - GenerateBookBlurbInput - The input type for the generateBookBlurb function.
 * - GenerateBookBlurbOutput - The return type for the generateBookBlurb function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookBlurbInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  genre: z.string().describe('The genre of the book.'),
  themes: z.string().describe('Key themes explored in the book.'),
  targetAudience: z.string().describe('The target audience for the book.'),
  summary: z.string().describe('A brief summary of the book.'),
});

export type GenerateBookBlurbInput = z.infer<typeof GenerateBookBlurbInputSchema>;

const GenerateBookBlurbOutputSchema = z.object({
  blurb: z.string().describe('A promotional blurb for the book.'),
});

export type GenerateBookBlurbOutput = z.infer<typeof GenerateBookBlurbOutputSchema>;

export async function generateBookBlurb(input: GenerateBookBlurbInput): Promise<GenerateBookBlurbOutput> {
  return generateBookBlurbFlow(input);
}

const generateBookBlurbPrompt = ai.definePrompt({
  name: 'generateBookBlurbPrompt',
  input: {
    schema: GenerateBookBlurbInputSchema,
  },
  output: {
    schema: GenerateBookBlurbOutputSchema,
  },
  prompt: `You are a marketing expert specializing in creating compelling promotional blurbs for books.

  Given the following information about a book, generate a short, engaging blurb to attract readers.

  Title: {{{title}}}
  Genre: {{{genre}}}
  Themes: {{{themes}}}
  Target Audience: {{{targetAudience}}}
  Summary: {{{summary}}}
  `,
});

const generateBookBlurbFlow = ai.defineFlow(
  {
    name: 'generateBookBlurbFlow',
    inputSchema: GenerateBookBlurbInputSchema,
    outputSchema: GenerateBookBlurbOutputSchema,
  },
  async input => {
    const {output} = await generateBookBlurbPrompt(input);
    return output!;
  }
);
