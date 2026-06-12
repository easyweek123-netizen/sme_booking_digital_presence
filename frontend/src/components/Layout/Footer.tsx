import {
  Box,
  Container,
  Grid,
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
        color="text.faint"
        fontSize="sm"
        _hover={{ color: 'surface.card' }}
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
      color="text.faint"
      fontSize="sm"
      _hover={{ color: 'surface.card' }}
      transition="color 0.2s"
    >
      {children}
    </Link>
  );
}

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack
      align="start"
      spacing={4}
      minW={0}
      sx={{
        // Center-align when the footer container is narrow enough to be 1-col.
        alignItems: 'center',
        '@container (min-width: 480px)': { alignItems: 'flex-start' },
      }}
    >
      <Text
        color="surface.card"
        fontWeight="600"
        fontSize="sm"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {title}
      </Text>
      <VStack
        align="start"
        spacing={3}
        minW={0}
        sx={{
          alignItems: 'center',
          '@container (min-width: 480px)': { alignItems: 'flex-start' },
        }}
      >
        {children}
      </VStack>
    </VStack>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="surface.inverted"
      pt={{ base: 12, md: 16 }}
      pb={{ base: 8, md: 10 }}
      // Make the footer its own CSS container so the layout below adapts to
      // the footer's actual width (preview pane, chat canvas, full page),
      // not to the viewport. Single source of truth for "how wide am I?".
      sx={{ containerType: 'inline-size' }}
    >
      <Container maxW="container.xl">
        <Grid
          gap={{ base: 10, md: 8 }}
          mb={{ base: 10, md: 12 }}
          sx={{
            gridTemplateColumns: '1fr',
            '@container (min-width: 480px)': {
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            },
            '@container (min-width: 820px)': {
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          {/* Brand Section — spans the full row at 1-col and 2-col steps */}
          <VStack
            spacing={4}
            minW={0}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              gridColumn: '1',
              '@container (min-width: 480px)': {
                alignItems: 'flex-start',
                textAlign: 'left',
                gridColumn: '1 / -1',
              },
              '@container (min-width: 820px)': {
                gridColumn: '1',
              },
            }}
          >
            <Logo size="sm" colorScheme="dark" />
            <Text color="text.faint" fontSize="sm" lineHeight="1.7" maxW="280px">
              Your professional booking page, free forever. Accept appointments
              24/7 and grow your business.
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
            <FooterLink to={ROUTES.IMPRESSUM}>Impressum</FooterLink>
          </FooterSection>

          {/* Contact */}
          <FooterSection title="Contact">
            <HStack
              spacing={2}
              color="text.faint"
              align="flex-start"
              minW={0}
              w="100%"
              sx={{
                justifyContent: 'center',
                '@container (min-width: 480px)': { justifyContent: 'flex-start' },
              }}
            >
              <Box as="span" flexShrink={0} mt="2px">
                <MailIcon size={16} />
              </Box>
              <Link
                href="mailto:easyweek123@gmail.com"
                fontSize="sm"
                _hover={{ color: 'surface.card' }}
                transition="color 0.2s"
                overflowWrap="anywhere"
                wordBreak="break-word"
                minW={0}
              >
                easyweek123@gmail.com
              </Link>
            </HStack>
          </FooterSection>
        </Grid>

        <Divider borderColor="whiteAlpha.200" />

        {/* Bottom row: copyright + "built by". Stacks under the footer's
            container width threshold, side-by-side above it. */}
        <Box
          pt={{ base: 6, md: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            '@container (min-width: 820px)': {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              textAlign: 'left',
            },
          }}
        >
          <Text color="text.muted" fontSize="sm">
            © {currentYear} BookEasy. All rights reserved.
          </Text>
          <Text color="text.muted" fontSize="xs">
            Built by{' '}
            <Link
              as={RouterLink}
              to={ROUTES.PRICING}
              color="text.muted"
              _hover={{ color: 'accent.primary' }}
              transition="color 0.2s"
              fontWeight="500"
            >
              Book Easy
            </Link>
            {' · '}Custom Software Development
          </Text>
        </Box>
      </Container>
    </Box>
  );
}