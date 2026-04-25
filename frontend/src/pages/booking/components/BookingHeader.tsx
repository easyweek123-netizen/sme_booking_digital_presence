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

const BOOKING_HEADER_H_VAR = '--booking-header-h';

export function BookingHeader({ business }: { business: BusinessWithServices }) {
  const [imgErr, setImgErr] = useState(false);
  const stickyHeaderRef = useRef<HTMLElement | null>(null);
  // const [coverErr, setCoverErr] = useState(false);
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
  // const showCover = business.coverImageUrl && !coverErr;

  return (
    <Box>
      {/* {showCover && (
        <Box position="relative" h="160px" w="100%" overflow="hidden" aria-hidden>
          <Image
            src={business.coverImageUrl!}
            alt=""
            w="100%"
            h="100%"
            objectFit="cover"
            onError={() => setCoverErr(true)}
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-b, transparent, blackAlpha.700)"
            pointerEvents="none"
          />
        </Box>
      )} */}

      <Box
        ref={stickyHeaderRef}
        as="header"
        bg="surface.card"
        borderBottom="1px solid"
        borderColor="border.subtle"
        position={{ base: 'relative', md: 'sticky' }}
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl" px={{ base: 4 }} py={{ base: 4 }}>
          <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
            <HStack spacing={3} align="center" minW={0}>
              <Box
                w="48px"
                h="48px"
                borderRadius="lg"
                bg="brand.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                flexShrink={0}
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
                  <Box color="brand.600">
                    <ScissorsIcon size={22} />
                  </Box>
                )}
              </Box>
              <VStack align="start" spacing={0.5} minW={0}>
                <Heading size="md" color="text.heading" noOfLines={1}>
                  {business.name}
                </Heading>
                {business.description && (
                  <Text
                    fontSize="sm"
                    color="text.secondary"
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
                <HStack spacing={2} fontSize="sm" color="text.muted" wrap="wrap">
                  {status.label && (
                    <HStack spacing={1.5}>
                      <Box
                        w="6px"
                        h="6px"
                        borderRadius="full"
                        bg={status.isOpen ? 'green.500' : 'gray.400'}
                      />
                      <Text>{status.label}</Text>
                    </HStack>
                  )}
                  {business.city && (
                    <>
                      <Text>·</Text>
                      <HStack spacing={1}>
                        <MapPinIcon size={14} />
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
                  icon={<PhoneIcon size={18} />}
                  variant="outline"
                  borderRadius="full"
                  borderColor="border.subtle"
                  color="text.primary"
                  display={{ base: 'flex', md: 'none' }}
                  flexShrink={0}
                />
                <Button
                  as="a"
                  href={`tel:${business.phone}`}
                  variant="outline"
                  leftIcon={<PhoneIcon size={16} />}
                  borderRadius="xl"
                  borderColor="border.subtle"
                  color="text.primary"
                  display={{ base: 'none', md: 'inline-flex' }}
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
