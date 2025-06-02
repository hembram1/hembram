
'use server';

import { z } from 'zod';
// To enable actual email sending, you would uncomment the next line
// and install the 'resend' package: npm install resend
import { Resend } from 'resend';

// Initialize Resend with your API key (store this in .env.local for security)
// For security, this API key should be moved to an environment variable (e.g., .env.local)
// and accessed via process.env.RESEND_API_KEY.
const resendApiKey = 're_3xey7BB7_8JwuHD4dUNCsa47jp654TVxm'; 
const resend = new Resend(resendApiKey);


const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }).max(500, { message: 'Message must not exceed 500 characters.'}),
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
  // For actual sending, you'd use a verified domain or email with Resend
  const fromEmail = 'onboarding@resend.dev'; // Example, replace with your verified sender

  // --- Email Sending Logic ---
  try {
    // **Resend Integration**
    if (!resendApiKey || resendApiKey === 'YOUR_RESEND_API_KEY_HERE' || resendApiKey === 're_3xey7BB7_8JwuHD4dUNCsa47jp654TVxm') { // Check if it's the placeholder or the actual one for warning purposes
      if (resendApiKey === 'YOUR_RESEND_API_KEY_HERE') {
         console.warn("Resend API key is still the placeholder. Skipping actual email sending.");
         throw new Error("Resend API key not configured for actual sending.");
      }
      // If it's the actual key, we proceed.
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail], // Resend expects an array of recipients
      subject: `New Contact Form Submission from ${name} - Hembram Author Site`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, message: `Failed to send message. Resend Error: ${error.message}` };
    }

    console.log('Email sent successfully via Resend:', data);
    return { success: true, message: 'Message sent successfully!' };
    // --- End of Resend Integration ---
    
  } catch (error) {
    // This catch block will handle errors from both conceptual sending and the simulation if Resend isn't set up.
    console.error('Error in submitContactForm:', error);
    // Differentiate message for user if it's a config issue vs. general failure
    if (error instanceof Error && error.message.includes("Resend API key not configured")) {
         return { success: false, message: 'Email sending is not fully configured on the server.' };
    }
    if (error instanceof Error) {
        return { success: false, message: `An unexpected error occurred: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred while trying to send the message.' };
  }
}
