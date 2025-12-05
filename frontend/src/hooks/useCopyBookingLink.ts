import { useToast } from '@chakra-ui/react';
import { TOAST_DURATION } from '../constants';

/**
 * Hook for copying booking link to clipboard
 */
export function useCopyBookingLink(slug?: string) {
  const toast = useToast();

  const bookingUrl = slug ? `${window.location.origin}/book/${slug}` : '';

  const copyLink = async () => {
    if (!slug) return;

    try {
      await navigator.clipboard.writeText(bookingUrl);
      toast({
        title: 'Link copied!',
        description: 'Your booking link has been copied to clipboard.',
        status: 'success',
        duration: TOAST_DURATION.SHORT,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Could not copy link',
        description: 'Please copy the link manually.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  return { copyLink, bookingUrl };
}

