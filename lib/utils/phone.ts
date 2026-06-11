/**
 * Shared mobile-number validation used by every form (apply, contact,
 * course enquiry).
 *
 * Acceptance rules — after stripping spaces / dashes / parens / plus:
 *   1. Indian mobile  — exactly 10 digits starting with 6, 7, 8 or 9,
 *      with or without a leading `91` country prefix
 *      (e.g. 9876543210, 919876543210, +91 98765 43210)
 *   2. International  — 8 to 15 raw digits with optional `+` country code
 *
 * Common bad inputs caught:
 *   - "1234567"          → too short
 *   - "abc123"           → non-numeric chars
 *   - "0123456789"       → starts with 0 (not a valid Indian mobile)
 *   - "12345"            → too short
 *   - "9999999999999999" → too long
 */

const INDIAN_MOBILE = /^(91)?[6-9]\d{9}$/;
const INTERNATIONAL = /^\d{8,15}$/;

/** Returns true when `input` looks like a usable phone number. */
export function isValidPhone(input: string): boolean {
  // Strip all formatting characters — keep only digits.
  const digits = input.replace(/[\s\-()+]/g, '');
  if (!/^\d+$/.test(digits)) return false;
  if (INDIAN_MOBILE.test(digits)) return true;
  if (INTERNATIONAL.test(digits)) return true;
  return false;
}

/** Error string shown by every form when validation fails. */
export const PHONE_ERROR_MESSAGE =
  'Enter a valid mobile number (e.g. 9876543210 or +91 98765 43210)';
