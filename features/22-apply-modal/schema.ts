import { z } from 'zod';

export const applySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+0-9\s\-()]{7,20}$/, 'Invalid phone number'),
  academicBackground: z.enum([
    'Currently in 12th',
    '12th Passed',
    'Diploma Holder',
    'Other',
  ]),
  motivation: z.string().max(280).optional(),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export type ApplyFormData = z.infer<typeof applySchema>;
