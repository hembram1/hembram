
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
  const recipientEmail = 'hembramwork1@gmail.com';

  // --- Email Sending Logic (Simulation) ---
  // In a real application, you would integrate with an email service here
  // to send the email.
  // Examples:
  // - Using Resend: await resend.emails.send({ from: '...', to: recipientEmail, subject: '...', html: '...' });
  // - Using Nodemailer: setup a transporter and transporter.sendMail({ from: '...', to: recipientEmail, subject: '...', text: '...' });

  console.log('--- Simulating Email Preparation ---');
  console.log(`Recipient: ${recipientEmail}`);
  console.log(`Sender Name: ${name}`);
  console.log(`Sender Email: ${email}`);
  console.log('Subject: New Contact Form Submission');
  console.log('Body:');
  console.log(message);
  console.log('--- End of Email Simulation ---');

  // Simulate a delay for demonstration
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real scenario, the success/failure would depend on the email service's response.
  // For this simulation, we'll assume success.
  return { success: true, message: 'Form submitted successfully! (Email sending simulated)' };
}

