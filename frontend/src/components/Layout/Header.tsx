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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { PrimaryButton } from '../ui/PrimaryButton';
import { MenuIcon, CloseIcon, UserIcon, SettingsIcon, LogOutIcon, ChevronDownIcon } from '../icons';
import { ROUTES } from '../../config/routes';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { resetStore } from '../../store/actions';

export function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
        bg="white"
        borderBottom="1px"
        borderColor="gray.100"
        position="sticky"
        top={0}
        zIndex={100}
        backdropFilter="blur(8px)"
        bgColor="rgba(255,255,255,0.9)"
      >
        <Container maxW="container.xl" py={4}>
          <HStack justify="space-between">
            <Logo size="md" onClick={() => navigate(ROUTES.HOME)} />

            {/* Desktop Navigation */}
            <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
              {/* Navigation Links */}
              <HStack spacing={1}>
                <Button
                  variant="ghost"
                  color="gray.600"
                  fontWeight="500"
                  onClick={() => navigate(ROUTES.PRICING)}
                  _hover={{ color: 'brand.500', bg: 'gray.50' }}
                >
                  Pricing
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    color="gray.600"
                    fontWeight="500"
                    onClick={() => navigate(ROUTES.DASHBOARD.ROOT)}
                    _hover={{ color: 'brand.500', bg: 'gray.50' }}
                  >
                    Dashboard
                  </Button>
                )}
              </HStack>

              {/* Separator */}
              {isAuthenticated && (
                <Box h="24px" w="1px" bg="gray.200" mx={2} />
              )}

              {/* Account Section */}
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    color="gray.700"
                    fontWeight="500"
                    rightIcon={<ChevronDownIcon size={16} />}
                    _hover={{ bg: 'gray.50' }}
                    _active={{ bg: 'gray.100' }}
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
                    boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                    border="1px"
                    borderColor="gray.100"
                  >
                    <MenuItem
                      icon={<SettingsIcon size={18} />}
                      onClick={() => navigate(ROUTES.DASHBOARD.SETTINGS)}
                      _hover={{ bg: 'gray.50' }}
                      py={2}
                      px={4}
                    >
                      Settings
                    </MenuItem>
                    <MenuDivider my={1} />
                    <MenuItem
                      icon={<LogOutIcon size={18} />}
                      onClick={handleLogout}
                      color="red.500"
                      _hover={{ bg: 'red.50' }}
                      py={2}
                      px={4}
                    >
                      Log out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={2} ml={2}>
                  <Button
                    variant="ghost"
                    color="gray.600"
                    fontWeight="500"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    _hover={{ color: 'brand.500', bg: 'gray.50' }}
                  >
                    Log in
                  </Button>
                  <PrimaryButton onClick={() => navigate(ROUTES.ONBOARDING)}>
                    Start now
                  </PrimaryButton>
                </HStack>
              )}
            </HStack>

            {/* Mobile Hamburger */}
            <IconButton
              aria-label="Open menu"
              icon={<MenuIcon />}
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              color="gray.600"
              size="md"
              borderRadius="lg"
              _hover={{ bg: 'brand.50', color: 'brand.500' }}
              _active={{ bg: 'brand.100' }}
              transition="all 0.2s"
            />
          </HStack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <DrawerContent bg="white" maxW="300px">
          {/* Custom Close Button */}
          <Box position="absolute" top={4} right={4} zIndex={1}>
            <IconButton
              aria-label="Close menu"
              icon={<CloseIcon />}
              variant="ghost"
              size="sm"
              color="gray.500"
              _hover={{ bg: 'gray.100', color: 'gray.700' }}
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
                color="gray.400"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={1}
              >
                Menu
              </Text>

              {/* Navigation Links - Grouped Together */}
              <Box
                as="button"
                display="flex"
                alignItems="center"
                gap={3}
                w="full"
                py={3}
                px={4}
                borderRadius="xl"
                bg="gray.50"
                color="gray.700"
                fontWeight="500"
                fontSize="md"
                transition="all 0.2s"
                _hover={{ bg: 'gray.100', transform: 'translateX(4px)' }}
                _active={{ bg: 'gray.200' }}
                onClick={() => handleNavigate(ROUTES.PRICING)}
              >
                Pricing
              </Box>

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
                    bg="gray.50"
                    color="gray.700"
                    fontWeight="500"
                    fontSize="md"
                    transition="all 0.2s"
                    _hover={{ bg: 'gray.100', transform: 'translateX(4px)' }}
                    _active={{ bg: 'gray.200' }}
                    onClick={() => handleNavigate(ROUTES.DASHBOARD.ROOT)}
                  >
                    <Box color="gray.500">
                      <UserIcon size={20} />
                    </Box>
                    Dashboard
                  </Box>

                  <Box h="1px" bg="gray.100" my={3} />

                  <Text color="gray.500" fontSize="sm" px={4}>
                    {user?.name}
                  </Text>

                  <Button
                    variant="ghost"
                    color="red.500"
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
                    bg="gray.50"
                    color="gray.700"
                    fontWeight="500"
                    fontSize="md"
                    transition="all 0.2s"
                    _hover={{ bg: 'gray.100', transform: 'translateX(4px)' }}
                    _active={{ bg: 'gray.200' }}
                    onClick={() => handleNavigate(ROUTES.LOGIN)}
                  >
                    <Box color="gray.500">
                      <UserIcon size={20} />
                    </Box>
                    Log in
                  </Box>

                  <Box h="1px" bg="gray.100" my={3} />

                  {/* CTA Button */}
                  <PrimaryButton
                    size="lg"
                    onClick={() => handleNavigate(ROUTES.ONBOARDING)}
                    h="52px"
                    borderRadius="xl"
                    boxShadow="0 4px 14px rgba(46, 182, 125, 0.3)"
                    w="full"
                  >
                    Start now
                  </PrimaryButton>
                </>
              )}
            </VStack>
          </DrawerBody>

          {/* Footer */}
          <Box px={6} py={5} borderTop="1px" borderColor="gray.100" bg="gray.50">
            <Text fontSize="xs" color="gray.400" textAlign="center">
              © {new Date().getFullYear()} BookEasy
            </Text>
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
}
