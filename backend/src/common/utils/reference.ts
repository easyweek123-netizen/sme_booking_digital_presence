/**
 * Generates a unique booking reference code
 * Format: BK-XXXX (4 alphanumeric characters)
 * 
 * Uses characters that are easy to read (excludes 0, O, 1, I, L)
 * Provides ~1.5 million combinations (34^4)
 */
export function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // 34 chars (no 0,O,1,I,L)
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BK-${code}`;
}

/**
 * Validates a booking reference format
 */
export function isValidBookingReference(reference: string): boolean {
  return /^BK-[A-HJ-NP-Z2-9]{4}$/.test(reference);
}

