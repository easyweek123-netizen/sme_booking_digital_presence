import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Link,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ROUTES } from '../../config/routes';
import { MailIcon } from '../icons';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

function FooterLink({ to, children, isExternal }: FooterLinkProps) {
  if (isExternal) {
    return (
      <Link
        href={to}
        color="gray.400"
        fontSize="sm"
        _hover={{ color: 'white' }}
        transition="color 0.2s"
        isExternal
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      as={RouterLink}
      to={to}
      color="gray.400"
      fontSize="sm"
      _hover={{ color: 'white' }}
      transition="color 0.2s"
    >
      {children}
    </Link>
  );
}

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack align={{ base: 'center', sm: 'start' }} spacing={4}>
      <Text color="white" fontWeight="600" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
        {title}
      </Text>
      <VStack align={{ base: 'center', sm: 'start' }} spacing={3}>
        {children}
      </VStack>
    </VStack>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box as="footer" bg="gray.900" pt={{ base: 12, md: 16 }} pb={{ base: 8, md: 10 }}>
      <Container maxW="container.xl">
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 10, md: 8 }}
          mb={{ base: 10, md: 12 }}
        >
          {/* Brand Section */}
          <VStack align={{ base: 'center', sm: 'start' }} spacing={4} gridColumn={{ base: '1', sm: '1 / -1', md: '1' }}>
            <Logo size="sm" colorScheme="dark" />
            <Text color="gray.400" fontSize="sm" lineHeight="1.7" maxW="280px" textAlign={{ base: 'center', sm: 'left' }}>
              Your professional booking page, free forever. 
              Accept appointments 24/7 and grow your business.
            </Text>
          </VStack>

          {/* Product Links */}
          <FooterSection title="Product">
            <FooterLink to={ROUTES.PRICING}>Pricing</FooterLink>
            <FooterLink to={ROUTES.DASHBOARD.ROOT}>Dashboard</FooterLink>
            <FooterLink to={ROUTES.ONBOARDING}>Get Started</FooterLink>
          </FooterSection>

          {/* Legal Links */}
          <FooterSection title="Legal">
            <FooterLink to={ROUTES.PRIVACY}>Privacy Policy</FooterLink>
            <FooterLink to={ROUTES.TERMS}>Terms of Service</FooterLink>
          </FooterSection>

          {/* Contact */}
          <FooterSection title="Contact">
            <HStack spacing={2} color="gray.400" justify={{ base: 'center', sm: 'flex-start' }}>
              <MailIcon size={16} />
              <Link
                href="mailto:easyweek123@gmail.com"
                fontSize="sm"
                _hover={{ color: 'white' }}
                transition="color 0.2s"
              >
                easyweek123@gmail.com
              </Link>
            </HStack>
          </FooterSection>
        </SimpleGrid>

        <Divider borderColor="gray.800" />

        <VStack
          spacing={2}
          pt={{ base: 6, md: 8 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <Text color="gray.500" fontSize="sm" textAlign="center">
            © {currentYear} BookEasy. All rights reserved.
          </Text>
          <Text color="gray.600" fontSize="xs" textAlign="center">
            Made with care for small businesses
          </Text>
        </VStack>
        <HStack
          justify="space-between"
          pt={8}
          display={{ base: 'none', md: 'flex' }}
        >
          <Text color="gray.500" fontSize="sm">
            © {currentYear} BookEasy. All rights reserved.
          </Text>
          <Text color="gray.600" fontSize="xs">
            Made with care for small businesses
          </Text>
        </HStack>
      </Container>
    </Box>
  );
}
