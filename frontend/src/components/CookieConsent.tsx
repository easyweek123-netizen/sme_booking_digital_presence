import { useState } from 'react';
import { Box, Button, Flex, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../config/routes';

const MotionBox = motion(Box);

export function CookieConsent() {
  const [visible, setVisible] = useState<boolean>(
    () => !localStorage.getItem('cookie-consent')
  );

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <MotionBox
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          zIndex={100}
          bg="gray.900"
          borderTop="1px solid"
          borderColor="gray.700"
          px={{ base: 4, md: 8 }}
          py={{ base: 4, md: 3 }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            gap={{ base: 3, md: 4 }}
            maxW="container.xl"
            mx="auto"
          >
            <Text color="gray.300" fontSize="sm" lineHeight="1.6">
              We use cookies to keep you signed in. By continuing, you agree to our{' '}
              <Link
                as={RouterLink}
                to={ROUTES.PRIVACY}
                color="brand.500"
                _hover={{ color: 'brand.400' }}
                transition="color 0.2s"
              >
                Privacy Policy
              </Link>
              {', '}
              <Link
                as={RouterLink}
                to={ROUTES.IMPRESSUM}
                color="brand.500"
                _hover={{ color: 'brand.400' }}
                transition="color 0.2s"
              >
                Impressum
              </Link>
              .
            </Text>
            <Flex gap={2} flexShrink={0} alignSelf={{ base: 'stretch', md: 'auto' }}>
              <Button
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white', bg: 'gray.700' }}
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button
                size="sm"
                colorScheme="brand"
                onClick={handleAccept}
              >
                Accept
              </Button>
            </Flex>
          </Flex>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
