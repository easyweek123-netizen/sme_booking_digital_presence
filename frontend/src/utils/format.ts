/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}

/**
 * Format price to currency string.
 * Defaults to EUR / de-AT locale for Austrian market.
 * Override via optional params for other markets.
 */
export function formatPrice(
  price: number,
  currency = 'EUR',
  locale = 'de-AT',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Calendar date YYYY-MM-DD in the environment local timezone (not UTC).
 * Use this for API date params and date chips — never use toISOString().split('T')[0] for that.
 */
export function toLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string in local timezone
 */
export function getTodayString(): string {
  return toLocalYmd(new Date());
}

/**
 * Format date string to display format
 */
export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Today, ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for booking card display
 */
export function formatBookingDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for success screen (full format)
 */
export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

