import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useTour } from '../../contexts/TourContext';
import { ChevronRightIcon, ExternalLinkIcon, CloseIcon } from '../icons';
import { MotionBox } from '../ui/MotionBox';
import { TOUR_Z_INDEX, TOUR_ANIMATION } from '../../config/tourConstants';

export function TourIntro() {
  const { showIntro, beginSpotlight, visitPage, skipTour, businessSlug } = useTour();

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <MotionBox
          position="fixed"
          inset={0}
          bg="blackAlpha.500"
          zIndex={TOUR_Z_INDEX.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TOUR_ANIMATION.duration }}
        />

        {/* Modal */}
        <MotionBox
          position="fixed"
          top="50%"
          left="50%"
          zIndex={TOUR_Z_INDEX.highlight}
          w={{ base: '90%', md: '380px' }}
          initial={{ opacity: 0, x: '-50%', y: '-50%' }}
          animate={{ opacity: 1, x: '-50%', y: '-50%' }}
          exit={{ opacity: 0, x: '-50%', y: '-50%' }}
          transition={{ duration: TOUR_ANIMATION.duration }}
        >
          <Box
            bg="white"
            // borderRadius="2xl"
            overflow="hidden"
            // boxShadow="0 20px 60px rgba(0,0,0,0.15)"
            position="relative"
          >
            {/* Close button */}
            <IconButton
              aria-label="Close"
              icon={<CloseIcon size={12} />}
              size="sm"
              variant="ghost"
              position="absolute"
              top={3}
              right={3}
              zIndex={1}
              color="whiteAlpha.800"
              bg="whiteAlpha.200"
              borderRadius="full"
              minW="28px"
              h="28px"
              onClick={skipTour}
              _hover={{ bg: 'whiteAlpha.300', color: 'white' }}
            />

            {/* Header */}
            <Box
              bgGradient="linear(to-br, brand.500, brand.600)"
              py={8}
              px={6}
              textAlign="center"
            >
              <Text fontSize="4xl" mb={2}>
                🎉
              </Text>
              <Heading size="md" color="white" fontWeight="600">
                Your Page is Live!
              </Heading>
            </Box>

            {/* Content */}
            <VStack spacing={5} p={6} align="stretch">
              <Text
                color="gray.600"
                textAlign="center"
                fontSize="sm"
                lineHeight="1.7"
              >
                Congratulations! Your booking page is ready to accept customers.
              </Text>

              {/* Buttons */}
              <HStack spacing={3} justify="center">
                {businessSlug && (
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    onClick={visitPage}
                    leftIcon={<ExternalLinkIcon size={16} />}
                    size="md"
                    borderRadius="lg"
                  >
                    Visit Page
                  </Button>
                )}

                <Button
                  colorScheme="brand"
                  onClick={beginSpotlight}
                  rightIcon={<ChevronRightIcon size={16} />}
                  size="md"
                  borderRadius="lg"
                >
                  Start Tour
                </Button>
              </HStack>
            </VStack>
          </Box>
        </MotionBox>
      </>
    </AnimatePresence>
  );
}
