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
import { MenuIcon } from '../icons';
import { Sidebar } from './Sidebar';
import { ROUTES } from '../../config/routes';
import { Logo } from '../ui';

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
        position="relative"
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
          <Logo size="md" showHeading={false} onClick={() => navigate(ROUTES.HOME)} />
        </Flex>
      </Box>

      <Drawer id="mobile-nav-drawer" isOpen={isOpen} placement="left" onClose={onClose}
        // @ts-expect-error Chakra v2 omits motionPreset from DrawerProps but Modal forwards it at runtime.
        motionPreset={'none'}>
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
