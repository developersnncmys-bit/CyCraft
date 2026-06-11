import { z } from 'zod';
import { isValidPhone, PHONE_ERROR_MESSAGE } from '@/lib/utils/phone';

export const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number too short')
    .max(20, 'Phone number too long')
    .refine(isValidPhone, PHONE_ERROR_MESSAGE),
  subject: z.string().min(2, 'Subject must be at least 2 characters').max(120),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export type ContactFormData = z.infer<typeof contactSchema>;
