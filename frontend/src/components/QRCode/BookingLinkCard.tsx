import { useState, useRef } from 'react';
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Flex,
  useDisclosure,
  useToast,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { QRCodeCanvas } from 'qrcode.react';
import { CopyIcon, DownloadIcon, ExternalLinkIcon } from '../icons';
import { TOAST_DURATION } from '../../constants';

interface BookingLinkCardProps {
  slug: string;
}

export function BookingLinkCard({ slug }: BookingLinkCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const bookingUrl = `${window.location.origin}/book/${slug}`;
  const displayUrl = `${window.location.host}/book/${slug}`;

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

  const downloadQR = async () => {
    setIsDownloading(true);
    try {
      const canvas = qrRef.current?.querySelector('canvas');
      if (!canvas) {
        throw new Error('QR code canvas not found');
      }

      // Create a higher resolution canvas for better print quality
      const scale = 4;
      const size = 256 * scale;
      const padding = 32 * scale;
      const totalSize = size + padding * 2;

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = totalSize;
      exportCanvas.height = totalSize;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, totalSize, totalSize);

      // Draw QR code centered with padding
      ctx.drawImage(canvas, padding, padding, size, size);

      // Convert to blob and download
      exportCanvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Could not create image');
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${slug}-qr-code.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);

          toast({
            title: 'QR code downloaded!',
            description: 'Your QR code is ready for printing.',
            status: 'success',
            duration: TOAST_DURATION.SHORT,
            isClosable: true,
          });
        },
        'image/png',
        1.0
      );
    } catch {
      toast({
        title: 'Download failed',
        description: 'Could not download QR code. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const openBookingPage = () => {
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Card with QR Prominence */}
      <Box
        bg="white"
        border="1px"
        borderColor="gray.200"
        borderRadius="xl"
        p={4}
      >
        <Flex gap={4} align="flex-start">
          {/* QR Code Preview - Clickable */}
          <Tooltip label="Click to enlarge & download" placement="top" hasArrow>
            <Box
              bg="white"
              p={2}
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              cursor="pointer"
              onClick={onOpen}
              transition="all 0.2s"
              _hover={{
                borderColor: 'brand.300',
                boxShadow: 'sm',
                transform: 'scale(1.02)',
              }}
              flexShrink={0}
              lineHeight={0}
            >
              <QRCodeCanvas
                value={bookingUrl}
                size={64}
                bgColor="#FFFFFF"
                fgColor="#1E293B"
                level="M"
                includeMargin={false}
              />
            </Box>
          </Tooltip>

          {/* Link Info & Actions */}
          <Box flex={1} minW={0}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              Your booking page
            </Text>
            <Text
              fontSize="sm"
              fontWeight="600"
              color="brand.600"
              mb={3}
              wordBreak="break-all"
            >
              {displayUrl}
            </Text>

            {/* Action Buttons */}
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
                onClick={onOpen}
              >
                Download QR
              </Button>
              <Tooltip label="Open booking page" placement="top" hasArrow>
                <IconButton
                  aria-label="Open booking page"
                  icon={<ExternalLinkIcon size={14} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={openBookingPage}
                />
              </Tooltip>
            </HStack>
          </Box>
        </Flex>
      </Box>

      {/* Full QR Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" mx={4} overflow="hidden">
          <ModalHeader
            bg="gray.50"
            borderBottom="1px"
            borderColor="gray.100"
            py={4}
          >
            <Text fontSize="lg" fontWeight="600" color="gray.900">
              Share Your Booking Page
            </Text>
          </ModalHeader>
          <ModalCloseButton top={4} right={4} />

          <ModalBody py={6}>
            <VStack spacing={5}>
              {/* Large QR Code */}
              <Box
                ref={qrRef}
                bg="white"
                p={4}
                borderRadius="xl"
                border="2px"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <QRCodeCanvas
                  value={bookingUrl}
                  size={200}
                  bgColor="#FFFFFF"
                  fgColor="#1E293B"
                  level="H"
                  includeMargin={false}
                />
              </Box>

              {/* URL Display */}
              <Box
                bg="gray.50"
                px={4}
                py={2}
                borderRadius="lg"
                w="full"
                textAlign="center"
              >
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="brand.600"
                  wordBreak="break-all"
                >
                  {displayUrl}
                </Text>
              </Box>

              {/* Action Buttons */}
              <HStack spacing={3} w="full">
                <Button
                  flex={1}
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<CopyIcon size={16} />}
                  onClick={copyLink}
                  size="md"
                >
                  Copy Link
                </Button>
                <Button
                  flex={1}
                  colorScheme="brand"
                  leftIcon={<DownloadIcon size={16} />}
                  onClick={downloadQR}
                  isLoading={isDownloading}
                  loadingText="Saving..."
                  size="md"
                >
                  Download QR
                </Button>
              </HStack>

              {/* Helper Text */}
              <Text fontSize="xs" color="gray.500" textAlign="center" px={4}>
                Print this QR code to display in your shop or share on social
                media
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

