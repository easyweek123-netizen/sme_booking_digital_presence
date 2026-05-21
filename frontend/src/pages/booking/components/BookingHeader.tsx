import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  IconButton,
  Link,
  SimpleGrid,
} from '@chakra-ui/react';
import { useState, useRef, useLayoutEffect } from 'react';
import { PhoneIcon, MapPinIcon, ScissorsIcon } from '../../../components/icons';
import { DAYS_OF_WEEK, formatTime } from '../../../constants';
import type { BusinessWithServices, WorkingHours } from '../../../types';

function getTodayStatus(wh: WorkingHours | null | undefined): { isOpen: boolean; label: string } {
  if (!wh) return { isOpen: false, label: '' };
  const i = new Date().getDay();
  const key = DAYS_OF_WEEK[i === 0 ? 6 : i - 1];
  const s = wh[key];
  if (!s?.isOpen) return { isOpen: false, label: 'Closed today' };
  return { isOpen: true, label: `Open · closes ${formatTime(s.closeTime)}` };
}

// Vector Custom Icons
function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function StarIcon({ fill = true }: { fill?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={fill ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const BOOKING_HEADER_H_VAR = '--booking-header-h';

export function BookingHeader({ business }: { business: BusinessWithServices }) {
  const [imgErr, setImgErr] = useState(false);
  const stickyHeaderRef = useRef<HTMLElement | null>(null);
  const hasLogo = business.logoUrl && !imgErr;
  const status = getTodayStatus(business.workingHours);

  useLayoutEffect(() => {
    const el = stickyHeaderRef.current;
    if (!el) return;
    const sync = () => {
      document.documentElement.style.setProperty(BOOKING_HEADER_H_VAR, `${el.offsetHeight}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty(BOOKING_HEADER_H_VAR);
    };
  }, [business.name, business.description, business.phone, business.city]);

  return (
    <Box bg="white" w="100%">
      
      {/* 1. PREMIUM GALLERY HEADER BLOCK */}
      <Container maxW="container.xl" px={{ base: 5, md: 8 }} pt={6} pb={8}>
        
        {/* A. Breadcrumbs */}
        <HStack spacing={1.5} fontSize="xs" color="gray.500" fontWeight="600" mb={4} wrap="wrap">
          <Link href="#" _hover={{ textDecoration: 'underline' }}>Home</Link>
          <Text color="gray.300">•</Text>
          <Link href="#" _hover={{ textDecoration: 'underline' }}>Hair Salons</Link>
          <Text color="gray.300">•</Text>
          <Link href="#" _hover={{ textDecoration: 'underline' }}>Madrid</Link>
          <Text color="gray.300">•</Text>
          <Link href="#" _hover={{ textDecoration: 'underline' }}>Aravaca</Link>
          <Text color="gray.300">•</Text>
          <Text color="black" fontWeight="700">{business.name}</Text>
        </HStack>

        {/* B. Title & Action CTAs Row */}
        <Flex justify="space-between" align="flex-start" gap={4} mb={3.5}>
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '36px' }}
            fontWeight="800"
            color="black"
            letterSpacing="-0.02em"
            lineHeight="1.15"
          >
            {business.name}
          </Heading>
          
          <HStack spacing={3} flexShrink={0} pt={1}>
            <IconButton
              aria-label="Share"
              icon={<ShareIcon />}
              variant="outline"
              borderColor="gray.200"
              color="black"
              bg="white"
              borderRadius="full"
              h="42px"
              w="42px"
              minW="auto"
              _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
              _active={{ bg: 'gray.100' }}
            />
            <IconButton
              aria-label="Add to favorites"
              icon={<HeartIcon />}
              variant="outline"
              borderColor="gray.200"
              color="black"
              bg="white"
              borderRadius="full"
              h="42px"
              w="42px"
              minW="auto"
              _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
              _active={{ bg: 'gray.100' }}
            />
          </HStack>
        </Flex>

        {/* C. Aggregated Info Sub-bar */}
        <HStack spacing={2} fontSize="sm" color="gray.600" fontWeight="600" wrap="wrap" mb={6} align="center">
          <HStack spacing={0.5} align="center">
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <Text color="black" fontWeight="700" pl={1}>4.9</Text>
            <Text color="gray.400" fontWeight="500">(219)</Text>
          </HStack>
          <Text color="gray.300">•</Text>
          <HStack spacing={1}>
            <Box w="6px" h="6px" borderRadius="full" bg="green.500" />
            <Text color="green.600" fontWeight="700">Open</Text>
            <Text color="gray.500" fontWeight="500">- closes soon at 7:00 PM</Text>
          </HStack>
          <Text color="gray.300">•</Text>
          <Text color="gray.500" fontWeight="500">{business.address || 'Moncloa - Aravaca, Madrid'}</Text>
          <Link href="#" color="blue.500" fontWeight="700" textDecoration="underline" _hover={{ color: 'blue.600' }}>
            Get directions
          </Link>
        </HStack>

        {/* D. Widescreen 3-Image Gallery Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="100%">
          {/* Main Large Image */}
          <Box
            gridColumn={{ base: 'span 1', md: 'span 2' }}
            h={{ base: '260px', md: '380px' }}
            borderRadius="2xl"
            overflow="hidden"
            position="relative"
            boxShadow="sm"
          >
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80"
              alt="Salon main interior seating"
              w="100%"
              h="100%"
              objectFit="cover"
              transition="transform 0.4s ease"
              _hover={{ transform: 'scale(1.01)' }}
            />
          </Box>

          {/* Right Column Stacked Widescreen Photos */}
          <Flex direction="column" gap={4} h={{ base: 'auto', md: '380px' }} display={{ base: 'none', md: 'flex' }}>
            {/* Top Right Stacked Image */}
            <Box h="182px" borderRadius="2xl" overflow="hidden" boxShadow="sm">
              <Image
                src="https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=600&auto=format&fit=crop&q=80"
                alt="Spa product shelf backwash basin"
                w="100%"
                h="100%"
                objectFit="cover"
                transition="transform 0.4s ease"
                _hover={{ transform: 'scale(1.015)' }}
              />
            </Box>
            
            {/* Bottom Right Stacked Image with Floating See All Button */}
            <Box h="182px" borderRadius="2xl" overflow="hidden" position="relative" boxShadow="sm">
              <Image
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80"
                alt="Hair stylist dressing mirror styling chairs"
                w="100%"
                h="100%"
                objectFit="cover"
                transition="transform 0.4s ease"
                _hover={{ transform: 'scale(1.015)' }}
              />
              <Button
                position="absolute"
                bottom="16px"
                right="16px"
                bg="white"
                color="black"
                borderRadius="full"
                h="36px"
                px={4}
                fontSize="xs"
                fontWeight="700"
                boxShadow="0 4px 10px rgba(0,0,0,0.12)"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ bg: 'gray.50' }}
                _active={{ bg: 'gray.100' }}
              >
                See all images
              </Button>
            </Box>
          </Flex>
        </SimpleGrid>

      </Container>

      {/* 2. STICKY DYNAMIC NAVIGATION SCROLLBAR SUB-HEADER */}
      <Box
        ref={stickyHeaderRef}
        as="header"
        bg="white"
        borderBottom="1px solid"
        borderColor="#ECECEC"
        position={{ base: 'relative', md: 'sticky' }}
        top={0}
        zIndex={10}
        boxShadow="0 2px 10px rgba(0,0,0,0.01)"
      >
        <Container maxW="container.xl" px={{ base: 5, md: 8 }} py={{ base: 4.5 }}>
          <Flex justify="space-between" align="center" gap={4}>
            <HStack spacing={4} align="center" minW={0}>
              
              <Box
                w="52px"
                h="52px"
                borderRadius="full"
                border="1.5px solid"
                borderColor="gray.100"
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                flexShrink={0}
                boxShadow="sm"
              >
                {hasLogo ? (
                  <Image
                    src={business.logoUrl!}
                    alt={business.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <Box color="brand.500">
                    <ScissorsIcon size={22} />
                  </Box>
                )}
              </Box>

              <VStack align="start" spacing={0.5} minW={0}>
                <Heading fontSize="lg" fontWeight="700" color="black" noOfLines={1} letterSpacing="-0.01em">
                  {business.name}
                </Heading>
                {business.description && (
                  <Text
                    fontSize="sm"
                    color="text.secondary"
                    fontWeight="500"
                    w="100%"
                    sx={{
                      base: {
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                      },
                      md: {
                        display: 'block',
                        overflow: 'visible',
                        WebkitLineClamp: 'unset',
                      },
                    }}
                  >
                    {business.description}
                  </Text>
                )}
                <HStack spacing={2} fontSize="xs" color="text.muted" fontWeight="600" wrap="wrap" pt={0.5}>
                  {status.label && (
                    <HStack spacing={1.5}>
                      <Box
                        w="6px"
                        h="6px"
                        borderRadius="full"
                        bg={status.isOpen ? 'green.500' : 'gray.400'}
                      />
                      <Text color={status.isOpen ? 'green.600' : 'gray.500'}>{status.label}</Text>
                    </HStack>
                  )}
                  {business.city && (
                    <>
                      <Text color="gray.300">·</Text>
                      <HStack spacing={1}>
                        <MapPinIcon size={12} />
                        <Text>{business.city}</Text>
                      </HStack>
                    </>
                  )}
                </HStack>
              </VStack>
            </HStack>

            {business.phone && (
              <>
                <IconButton
                  as="a"
                  href={`tel:${business.phone}`}
                  aria-label="Call"
                  icon={<PhoneIcon size={16} />}
                  variant="solid"
                  bg="black"
                  color="white"
                  borderRadius="full"
                  h="40px"
                  w="40px"
                  display={{ base: 'flex', md: 'none' }}
                  flexShrink={0}
                  _hover={{ bg: 'gray.800' }}
                  _active={{ transform: 'scale(0.95)' }}
                />
                <Button
                  as="a"
                  href={`tel:${business.phone}`}
                  variant="outline"
                  leftIcon={<PhoneIcon size={14} />}
                  borderRadius="full"
                  px={6}
                  h="42px"
                  borderColor="black"
                  color="black"
                  fontWeight="700"
                  fontSize="sm"
                  display={{ base: 'none', md: 'inline-flex' }}
                  _hover={{ bg: 'black', color: 'white' }}
                  _active={{ transform: 'scale(0.97)' }}
                  transition="all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  Call
                </Button>
              </>
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
