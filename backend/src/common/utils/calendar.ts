/**
 * Generate a Google Calendar event link
 * 
 * When clicked, this opens Google Calendar with pre-filled event details
 */
export function generateGoogleCalendarLink(params: {
  title: string;
  start: Date;
  durationMinutes: number;
  location?: string;
  description?: string;
}): string {
  const { title, start, durationMinutes, location, description } = params;

  // Calculate end time
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  // Format dates as YYYYMMDDTHHMMSS (local time, no timezone)
  const formatDateTime = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  };

  // Build URL parameters
  const urlParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDateTime(start)}/${formatDateTime(end)}`,
  });

  if (location) {
    urlParams.set('location', location);
  }

  if (description) {
    urlParams.set('details', description);
  }

  return `https://calendar.google.com/calendar/render?${urlParams.toString()}`;
}

