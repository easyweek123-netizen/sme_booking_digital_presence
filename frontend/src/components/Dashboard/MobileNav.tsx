import {
  Box,
  Button,
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
import { MenuIcon } from '../icons';
import { Sidebar } from './Sidebar';
import { ROUTES } from '../../config/routes';

// Get current page title based on route
function getPageTitle(pathname: string): string {
  if (pathname === ROUTES.DASHBOARD.ROOT) return 'Overview';
  if (pathname.includes('/canvas')) return 'AI Canvas';
  if (pathname.includes('/chat')) return 'AI Chat';
  if (pathname.includes('/bookings')) return 'Bookings';
  if (pathname.includes('/clients')) return 'Clients';
  if (pathname.includes('/services')) return 'Services';
  if (pathname.includes('/website')) return 'Website';
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
        position="sticky"
        top={0}
        bg="surface.card"
        borderBottom="1px"
        borderColor="border.subtle"
        zIndex={2}
      >
        <Flex h="60px" align="center" justify="space-between" px={4}>
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon />}
            variant="ghost"
            size="md"
            onClick={onOpen}
            color="text.secondary"
            borderRadius="sm"
            _hover={{ bg: 'surface.alt' }}
            zIndex={3}
          />

          <Box textAlign="center">
            <Text fontSize="sm" fontWeight="600" color="text.primary">
              {pageTitle}
            </Text>
            {businessName && (
              <Text fontSize="xs" color="text.muted">
                {businessName}
              </Text>
            )}
          </Box>

          <Button
            aria-label="Go to home"
            w="36px"
            h="36px"
            minW="36px"
            p={0}
            bg="brand.500"
            borderRadius="md"
            onClick={() => navigate(ROUTES.HOME)}
            _hover={{ bg: 'brand.600' }}
            _active={{ transform: 'scale(0.95)' }}
            transition="all 0.15s"
            color="white"
            fontWeight="bold"
            fontSize="md"
          >
            B
          </Button>
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerContent maxW="240px" bg="surface.card">
          <DrawerBody p={0}>
            <Sidebar onClose={onClose} isInDrawer />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
