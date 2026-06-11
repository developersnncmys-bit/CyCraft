import { z } from 'zod';
import { isValidPhone, PHONE_ERROR_MESSAGE } from '@/lib/utils/phone';

export const applySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number too short')
    .max(20, 'Phone number too long')
    .refine(isValidPhone, PHONE_ERROR_MESSAGE),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  educationalBackground: z.string().max(500).optional(),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export type ApplyFormData = z.infer<typeof applySchema>;
