import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Link,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';
import {
  PhoneIcon,
  MapPinIcon,
  InstagramIcon,
  GlobeIcon,
  ClockIcon,
} from '../../../components/icons';
import { AboutTab } from '../../../components/Booking';
import { DAYS_OF_WEEK, DAY_LABELS, formatTime } from '../../../constants';
import type { BusinessWithServices } from '../../../types';

interface BusinessInfoFooterProps {
  business: BusinessWithServices;
  /** From viewport `lg` or canvas preview; drives footer grid like `BookingWizard`. */
  desktopLayout: boolean;
}

export function BusinessInfoFooter({ business, desktopLayout }: BusinessInfoFooterProps) {
  const hasAbout = !!business.aboutContent;
  const hasContactInfo =
    !!business.phone ||
    !!business.address ||
    !!business.instagram ||
    !!business.website ||
    !!business.city;
  const hasWorkingHours = !!business.workingHours;
  const hasContactBlock = hasContactInfo || hasWorkingHours;

  if (!hasAbout && !hasContactBlock) return null;

  return (
    <Box as="section" bg="surface.alt" py={{ base: 8, md: 12 }}>
      <Container maxW="container.xl" px={{ base: 4 }}>
        <SimpleGrid
          columns={desktopLayout ? 12 : 1}
          spacing={{ base: 6, lg: 8 }}
          alignItems="start"
        >
          {hasAbout && (
            <GridItem
              colSpan={desktopLayout ? (hasContactBlock ? 7 : 12) : 12}
              id="about"
            >
              <Heading size="lg" color="text.heading" mb={6} letterSpacing="-0.02em">
                About
              </Heading>
              <Box
                bg="surface.card"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.subtle"
                p={{ base: 4, md: 6 }}
              >
                <AboutTab content={business.aboutContent!} brandColor={business.brandColor} />
              </Box>
            </GridItem>
          )}

          {hasContactBlock && (
            <GridItem
              colSpan={desktopLayout ? (hasAbout ? 5 : 12) : 12}
              id="contact"
            >
              <Heading size="lg" color="text.heading" mb={6} letterSpacing="-0.02em">
                Contact & Hours
              </Heading>
              <VStack spacing={4} align="stretch">
                {hasContactInfo && (
                  <Box
                    bg="surface.card"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="border.subtle"
                    p={5}
                  >
                    <Text
                      fontWeight="600"
                      color="text.heading"
                      fontSize="sm"
                      mb={4}
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Get in touch
                    </Text>
                    <VStack spacing={3} align="stretch">
                      {business.address && (
                        <ContactLink
                          icon={<MapPinIcon size={16} />}
                          label={[business.address, business.city].filter(Boolean).join(', ')}
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            [business.address, business.city].filter(Boolean).join(', '),
                          )}`}
                        />
                      )}
                      {!business.address && business.city && (
                        <ContactLink icon={<MapPinIcon size={16} />} label={business.city} />
                      )}
                      {business.phone && (
                        <ContactLink
                          icon={<PhoneIcon size={16} />}
                          label={business.phone}
                          href={`tel:${business.phone}`}
                        />
                      )}
                      {business.instagram && (
                        <ContactLink
                          icon={<InstagramIcon size={16} />}
                          label={
                            business.instagram.startsWith('@')
                              ? business.instagram
                              : `@${business.instagram}`
                          }
                          href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                          isExternal
                        />
                      )}
                      {business.website && (
                        <ContactLink
                          icon={<GlobeIcon size={16} />}
                          label="Website"
                          href={
                            business.website.startsWith('http')
                              ? business.website
                              : `https://${business.website}`
                          }
                          isExternal
                        />
                      )}
                    </VStack>
                  </Box>
                )}

                {hasWorkingHours && (
                  <Box
                    bg="surface.card"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="border.subtle"
                    p={5}
                  >
                    <HStack spacing={2} mb={4}>
                      <ClockIcon size={16} />
                      <Text
                        fontWeight="600"
                        color="text.heading"
                        fontSize="sm"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Working hours
                      </Text>
                    </HStack>
                    <VStack align="stretch" spacing={1.5}>
                      {DAYS_OF_WEEK.map((day) => {
                        const schedule = business.workingHours![day];
                        const isToday =
                          DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ===
                          day;
                        return (
                          <Flex
                            key={day}
                            justify="space-between"
                            fontSize="sm"
                            py={1}
                            px={2}
                            borderRadius="md"
                            bg={isToday ? 'brand.50' : 'transparent'}
                          >
                            <Text
                              color={isToday ? 'brand.700' : 'gray.600'}
                              fontWeight={isToday ? '600' : '500'}
                            >
                              {DAY_LABELS[day]}
                            </Text>
                            <Text
                              color={
                                schedule?.isOpen ? (isToday ? 'brand.700' : 'gray.900') : 'gray.400'
                              }
                            >
                              {schedule?.isOpen
                                ? `${formatTime(schedule.openTime)} – ${formatTime(schedule.closeTime)}`
                                : 'Closed'}
                            </Text>
                          </Flex>
                        );
                      })}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </GridItem>
          )}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function ContactLink({
  icon,
  label,
  href,
  isExternal,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isExternal?: boolean;
}) {
  const content = (
    <HStack spacing={3} color="text.secondary" fontSize="sm">
      <Box color="text.faint" flexShrink={0}>
        {icon}
      </Box>
      <Text>{label}</Text>
    </HStack>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      _hover={{ textDecoration: 'none', color: 'accent.hover' }}
      transition="color 0.2s"
    >
      {content}
    </Link>
  );
}
