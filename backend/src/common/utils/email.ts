/** Lowercase + trim for stable owner email lookup and storage. */
export function normalizeOwnerEmail(email: string): string {
  return email.trim().toLowerCase();
}
