
'use server';

import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(500),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

interface SubmissionResult {
  success: boolean;
  message?: string;
}

export async function submitContactForm(
  values: ContactFormValues
): Promise<SubmissionResult> {
  const parsedValues = contactFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  const { name, email, message } = parsedValues.data;

  // In a real application, you would integrate with an email service here.
  // For example, using Nodemailer, SendGrid, Resend, etc.
  console.log('New contact form submission:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);

  // Simulate a delay and potential error for demonstration
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a random success/failure
  // const shouldSucceed = Math.random() > 0.2; // 80% chance of success
  // if (!shouldSucceed) {
  //   return { success: false, message: 'Simulated server error. Please try again.' };
  // }

  return { success: true, message: 'Form submitted successfully!' };
}
