import {
  Box,
  Button,
  Container,
  HStack,
  VStack,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { PrimaryButton } from '../ui/PrimaryButton';
import { MenuIcon, CloseIcon, UserIcon, GlobeIcon, LogOutIcon, ChevronDownIcon } from '../icons';
import { ROUTES } from '../../config/routes';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { resetStore } from '../../store/actions';

// Navigation links for landing page
const navLinks = [
  { label: 'How It Works', href: '#how-it-works', isPage: false },
  { label: 'Pricing', href: ROUTES.PRICING, isPage: true },
  { label: 'FAQ', href: '#faq', isPage: false },
  { label: 'Custom Software', href: ROUTES.SERVICES, isPage: true },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isLandingPage = location.pathname === '/';

  const handleNavClick = (href: string, isPage: boolean) => {
    onClose();
    if (isPage) {
      navigate(href);
    } else {
      // Anchor link - scroll to section
      if (isLandingPage) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const handleNavigate = (route: string) => {
    onClose();
    navigate(route);
  };

  const handleLogout = () => {
    dispatch(resetStore());
    onClose();
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <Box
        as="header"
        borderBottom="1px"
        borderColor="border.subtle"
        position="sticky"
        top={0}
        zIndex={2}
        // backdropFilter="blur(8px)"
        bgColor="surface.page"
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            {/* Logo - Left */}
            <Logo size="md" onClick={() => navigate(ROUTES.HOME)} />

            {/* Center Navigation - Desktop */}
            <Flex>
              <HStack
                spacing={1}
                display={{ base: 'none', md: 'flex' }}
              >
                {navLinks.map((link) => (
                  <HStack key={link.label} spacing={1}>

                    <Button
                      variant="ghost"
                      color="text.secondary"
                      fontWeight="500"
                      onClick={() => handleNavClick(link.href, link.isPage)}
                      _hover={{ color: 'accent.primary', bg: 'transparent' }}
                      px={3}
                    >
                      {link.label}
                    </Button>
                  </HStack>
                ))}
              </HStack>

              {/* Right Section - Desktop */}
              <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
                {isAuthenticated ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      color="text.strong"
                      fontWeight="500"
                      rightIcon={<ChevronDownIcon size={16} />}
                      _hover={{ bg: 'surface.alt' }}
                      _active={{ bg: 'surface.page' }}
                      pl={2}
                      pr={3}
                    >
                      <HStack spacing={2}>
                        <Avatar
                          size="xs"
                          name={user?.name}
                          bg="brand.500"
                          color="white"
                          fontSize="xs"
                        />
                        <Text>{user?.name}</Text>
                      </HStack>
                    </MenuButton>
                    <MenuList
                      py={2}
                      borderRadius="xl"
                      boxShadow="popover"
                      border="1px"
                      borderColor="border.subtle"
                    >
                      <MenuItem
                        icon={<UserIcon size={18} />}
                        onClick={() => navigate(ROUTES.DASHBOARD.ROOT)}
                        _hover={{ bg: 'surface.alt' }}
                        py={2}
                        px={4}
                      >
                        Dashboard
                      </MenuItem>
                      <MenuItem
                        icon={<GlobeIcon size={18} />}
                        onClick={() => navigate(ROUTES.DASHBOARD.WEBSITE)}
                        _hover={{ bg: 'surface.alt' }}
                        py={2}
                        px={4}
                      >
                        Website
                      </MenuItem>
                      <MenuDivider my={1} />
                      <MenuItem
                        icon={<LogOutIcon size={18} />}
                        onClick={handleLogout}
                        color="danger.primary"
                        _hover={{ bg: 'alert.50' }}
                        py={2}
                        px={4}
                      >
                        Log out
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      color="text.secondary"
                      fontWeight="500"
                      onClick={() => navigate(ROUTES.LOGIN)}
                      _hover={{ color: 'accent.primary', bg: 'transparent' }}
                    >
                      Log in
                    </Button>
                      <PrimaryButton 
                        onClick={() => navigate(ROUTES.ONBOARDING)}>
                        Start Free
                      </PrimaryButton>
                  </>
                )}
              </HStack>
            </Flex>


            {/* Mobile Hamburger */}
            <IconButton
              aria-label="Open menu"
              icon={<MenuIcon />}
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              color="text.secondary"
              size="md"
              borderRadius="lg"
              _hover={{ bg: 'brand.50', color: 'accent.primary' }}
              _active={{ bg: 'brand.100' }}
              transition="all 0.2s"
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerContent bg="surface.card" maxW="300px">
          <Box position="absolute" top={4} right={4} zIndex={1}>
            <IconButton
              aria-label="Close menu"
              icon={<CloseIcon />}
              variant="ghost"
              size="sm"
              color="text.muted"
              _hover={{ bg: 'surface.page', color: 'text.strong' }}
              onClick={onClose}
              borderRadius="full"
            />
          </Box>

          <DrawerHeader pt={6} pb={4} px={6} borderBottom="none">
            <Logo size="lg" showTagline />
          </DrawerHeader>

          <DrawerBody px={6} py={6}>
            <VStack spacing={3} align="stretch">
              {/* Navigation Section */}
              <Text
                fontSize="xs"
                fontWeight="600"
                color="text.faint"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={1}
              >
                Menu
              </Text>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Box
                  key={link.label}
                  as="button"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  w="full"
                  py={3}
                  px={4}
                  borderRadius="xl"
                  bg="surface.alt"
                  color="text.strong"
                  fontWeight="500"
                  fontSize="md"
                  transition="all 0.2s"
                  _hover={{ bg: 'surface.page', transform: 'translateX(4px)' }}
                  _active={{ bg: 'gray.200' }}
                  onClick={() => handleNavClick(link.href, link.isPage)}
                >
                  {link.label}
                </Box>
              ))}

              <Box h="1px" bg="surface.page" my={3} />

              {isAuthenticated ? (
                <>
                  <Box
                    as="button"
                    display="flex"
                    alignItems="center"
                    gap={3}
                    w="full"
                    py={3}
                    px={4}
                    borderRadius="xl"
                    bg="surface.alt"
                    color="text.strong"
                    fontWeight="500"
                    fontSize="md"
                    transition="all 0.2s"
                    _hover={{ bg: 'surface.page', transform: 'translateX(4px)' }}
                    _active={{ bg: 'gray.200' }}
                    onClick={() => handleNavigate(ROUTES.DASHBOARD.ROOT)}
                  >
                    <Box color="text.muted">
                      <UserIcon size={20} />
                    </Box>
                    Dashboard
                  </Box>

                  <Box h="1px" bg="surface.page" my={3} />

                  <Text color="text.muted" fontSize="sm" px={4}>
                    {user?.name}
                  </Text>

                  <Button
                    variant="ghost"
                    color="danger.primary"
                    fontWeight="500"
                    onClick={handleLogout}
                    w="full"
                    justifyContent="flex-start"
                    px={4}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Box
                    as="button"
                    display="flex"
                    alignItems="center"
                    gap={3}
                    w="full"
                    py={3}
                    px={4}
                    borderRadius="xl"
                    bg="surface.alt"
                    color="text.strong"
                    fontWeight="500"
                    fontSize="md"
                    transition="all 0.2s"
                    _hover={{ bg: 'surface.page', transform: 'translateX(4px)' }}
                    _active={{ bg: 'gray.200' }}
                    onClick={() => handleNavigate(ROUTES.LOGIN)}
                  >
                    <Box color="text.muted">
                      <UserIcon size={20} />
                    </Box>
                    Log in
                  </Box>

                  <Box h="1px" bg="surface.page" my={3} />

                  {/* CTA Button */}
                  <PrimaryButton
                    size="lg"
                    onClick={() => handleNavigate(ROUTES.ONBOARDING)}
                    h="52px"
                    borderRadius="xl"
                    boxShadow="outline"
                    w="full"
                  >
                    Get Started
                  </PrimaryButton>
                </>
              )}
            </VStack>
          </DrawerBody>

          {/* Footer */}
          <Box px={6} py={5} borderTop="1px" borderColor="border.subtle" bg="surface.alt">
            <Text fontSize="xs" color="text.faint" textAlign="center">
              © {new Date().getFullYear()} BookEasy
            </Text>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
}
