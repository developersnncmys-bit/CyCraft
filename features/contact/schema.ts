import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+0-9\s\-()]{7,20}$/, 'Invalid phone number'),
  subject: z.string().min(2, 'Subject must be at least 2 characters').max(120),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export type ContactFormData = z.infer<typeof contactSchema>;
