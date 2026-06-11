import { z } from 'zod';
import { isValidPhone, PHONE_ERROR_MESSAGE } from '@/lib/utils/phone';

/**
 * Per-course-detail-page enquiry form.
 *
 * The form lives in features/course-detail/05-deployment and submits via
 * /api/enquiry. `courseSlug` + `courseTitle` are passed through so the
 * admin notification email includes the source course; the slug is also
 * useful for downstream CRM routing.
 */
export const enquirySchema = z.object({
  courseSlug: z.string().min(1).max(120),
  courseTitle: z.string().min(1).max(200),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number too short')
    .max(20, 'Phone number too long')
    .refine(isValidPhone, PHONE_ERROR_MESSAGE),
  message: z.string().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
