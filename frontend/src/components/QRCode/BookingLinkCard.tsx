import { useMemo } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  HStack,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { CopyIcon, DownloadIcon } from '../icons';
import { TOAST_DURATION } from '../../constants';

interface BookingLinkCardProps {
  slug: string;
}

export function BookingLinkCard({ slug }: BookingLinkCardProps) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { bookingUrl, displayUrl } = useMemo(
    () => ({
      bookingUrl: `${window.location.origin}/book/${slug}`,
      displayUrl: `${window.location.host}/book/${slug}`,
    }),
    [slug],
  );

  const copyLink = async () => {
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

  return (
    <Box
      bg="surface.card"
      borderWidth={1}
      borderStyle="solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p={4}
    >
        <Flex gap={4} align="flex-start">
          <Tooltip label="Click to open QR code" placement="top" hasArrow>
            <Box
              bg="surface.card"
              p={2}
              borderRadius="lg"
              border="1px"
              borderColor="border.subtle"
              cursor="pointer"
              // onClick={onOpen}
              transition="all 0.2s"
              _hover={{
                borderColor: 'brand.300',
                boxShadow: 'sm',
                transform: 'scale(1.02)',
              }}
              flexShrink={0}
              lineHeight={0}
            >
              <QRCodeSVG
                value={bookingUrl}
                size={64}
                bgColor="#FFFFFF"
                fgColor="#1E293B"
                level="M"
                includeMargin={false}
              />
            </Box>
          </Tooltip>

          <Box flex={1} minW={0}>
            <Text fontSize="xs" color="text.muted" mb={1}>
              Your booking page
            </Text>
            <Text
              as="a"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              fontWeight="600"
              color="accent.hover"
              wordBreak="break-all"
              _hover={{ textDecoration: 'underline', color: 'brand.700' }}
              cursor="pointer"
            >
              {displayUrl}
            </Text>

            <HStack spacing={2} flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                leftIcon={<CopyIcon size={14} />}
                onClick={copyLink}
              >
                Copy Link
              </Button>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="gray"
                leftIcon={<DownloadIcon size={14} />}
                // onClick={onOpen}
              >
                Open QR code
              </Button>
            </HStack>
          </Box>
        </Flex>

        {/* {isOpen && (
          <BookingQRModal
            isOpen
            onClose={onClose}
            bookingUrl={bookingUrl}
            displayUrl={displayUrl}
            slug={slug}
          />
        )} */}
    </Box>
  );
}
