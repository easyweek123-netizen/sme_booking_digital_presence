import { useRef, useState } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { QRCodeCanvas } from 'qrcode.react';
import { CopyIcon, DownloadIcon } from '../icons';
import { TOAST_DURATION } from '../../constants';

export interface BookingQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingUrl: string;
  displayUrl: string;
  slug: string;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('Could not create image')),
      'image/png',
      1.0,
    );
  });
}

export function BookingQRModal({
  isOpen,
  onClose,
  bookingUrl,
  displayUrl,
  slug,
}: BookingQRModalProps) {
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
    const canvas = canvasRef.current;
    if (!canvas) {
      toast({
        title: 'Download failed',
        description: 'QR code is not ready yet. Please try again.',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
      });
      return;
    }

    setIsDownloading(true);
    try {
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

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, totalSize, totalSize);
      ctx.drawImage(canvas, padding, padding, size, size);

      const blob = await canvasToBlob(exportCanvas);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="sm"
      motionPreset="slideInBottom"
      initialFocusRef={downloadButtonRef}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} overflow="hidden">
        <ModalHeader
          bg="surface.alt"
          borderBottom="1px"
          borderColor="border.subtle"
          py={4}
        >
          <Text fontSize="lg" fontWeight="600" color="text.heading">
            Share Your Booking Page
          </Text>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <ModalBody py={6}>
          <VStack spacing={5}>
            <Box
              bg="surface.card"
              p={4}
              borderRadius="xl"
              border="2px"
              borderColor="border.subtle"
              boxShadow="sm"
              lineHeight={0}
            >
              <QRCodeCanvas
                ref={canvasRef}
                value={bookingUrl}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#1E293B"
                level="H"
                includeMargin={false}
              />
            </Box>

            <Box
              bg="surface.alt"
              px={4}
              py={2}
              borderRadius="lg"
              w="full"
              textAlign="center"
            >
              <Text
                fontSize="sm"
                fontWeight="500"
                color="accent.hover"
                wordBreak="break-all"
              >
                {displayUrl}
              </Text>
            </Box>

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
                ref={downloadButtonRef}
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

            <Text fontSize="xs" color="text.muted" textAlign="center" px={4}>
              Print this QR code to display in your shop or share on social
              media
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
