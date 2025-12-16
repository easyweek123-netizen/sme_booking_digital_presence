import {
  Box,
  Flex,
  IconButton,
  Text,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, CloseIcon } from '../icons';
import { Sidebar } from './Sidebar';
import { ROUTES } from '../../config/routes';

// Get current page title based on route
function getPageTitle(pathname: string): string {
  if (pathname === ROUTES.DASHBOARD.ROOT) return 'Overview';
  if (pathname.includes('/chat')) return 'AI Chat';
  if (pathname.includes('/bookings')) return 'Bookings';
  if (pathname.includes('/clients')) return 'Clients';
  if (pathname.includes('/services')) return 'Services';
  if (pathname.includes('/settings')) return 'Settings';
  return 'Dashboard';
}

interface MobileNavProps {
  businessName?: string;
}

export function MobileNav({ businessName }: MobileNavProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      <Box
        display={{ base: 'block', lg: 'none' }}
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px"
        borderColor="gray.100"
      >
        <Flex h="60px" align="center" justify="space-between" px={4}>
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon />}
            variant="ghost"
            size="md"
            onClick={onOpen}
            color="gray.600"
            borderRadius="lg"
            _hover={{ bg: 'gray.50' }}
          />

          <Box textAlign="center">
            <Text fontSize="sm" fontWeight="600" color="gray.900">
              {pageTitle}
            </Text>
            {businessName && (
              <Text fontSize="xs" color="gray.500">
                {businessName}
              </Text>
            )}
          </Box>

          {/* Logo icon - navigates home */}
          <Box
            as="button"
            w="36px"
            h="36px"
            bg="brand.500"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => navigate(ROUTES.HOME)}
            _hover={{ bg: 'brand.600' }}
            _active={{ transform: 'scale(0.95)' }}
            transition="all 0.15s"
            aria-label="Go to home"
          >
            <Text color="white" fontWeight="bold" fontSize="md">
              B
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerContent maxW="280px" bg="white">
          {/* Close button */}
          <Box position="absolute" top={4} right={4} zIndex={1}>
            <IconButton
              aria-label="Close menu"
              icon={<CloseIcon />}
              variant="ghost"
              size="sm"
              color="gray.500"
              _hover={{ bg: 'gray.100' }}
              onClick={onClose}
              borderRadius="full"
            />
          </Box>

          <DrawerBody p={0}>
            <Sidebar onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

