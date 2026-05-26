import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import type { Service } from '../../types';
import { CheckIcon, PlusIcon } from '../icons';
import { BrandButton } from './brand';
import { formatDuration, formatPrice } from './utils';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  variant?: 'book' | 'select' | 'preview';
  onBook?: (service: Service) => void;
  onSelect?: (service: Service) => void;
}

const DESCRIPTION_CLAMP = 2;
const SEE_MORE_THRESHOLD = 80;

export function ServiceCard({
  service,
  selected = false,
  variant = 'book',
  onBook,
  onSelect,
}: ServiceCardProps) {
  const isDesktop = useBreakpointValue({ base: false, lg: true }) ?? false;
  const detail = useDisclosure();

  const canOpenDetail = variant !== 'preview';
  const showSeeMore =
    canOpenDetail &&
    !!service.description &&
    service.description.length > SEE_MORE_THRESHOLD;

  const handleCardClick = () => {
    if (canOpenDetail) detail.onOpen();
  };

  return (
    <>
      <Box
        as="button"
        textAlign="left"
        w="100%"
        p={{ base: 3, md: 4 }}
        overflow="hidden"
        borderWidth="1px"
        borderColor={selected ? 'var(--brand-accent)' : 'gray.200'}
        bg={selected ? 'var(--brand-accent-soft)' : 'white'}
        borderRadius="14px"
        cursor="pointer"
        _hover={{ borderColor: 'var(--brand-accent)' }}
        onClick={handleCardClick}
      >
        <HStack align="flex-start" spacing={{ base: 3, md: 4 }} w="100%" minW={0}>
          {service.photoUrl && (
            <Image
              src={service.photoUrl}
              alt={service.name}
              boxSize={{ base: '64px', md: '84px' }}
              borderRadius="10px"
              objectFit="cover"
              flexShrink={0}
            />
          )}
          <VStack align="stretch" spacing={1} flex="1" minW={0}>
            <Text fontSize="15px" fontWeight={600} color="gray.900" noOfLines={1}>
              {service.name}
            </Text>
            <HStack
              spacing={2.5}
              fontSize="13px"
              color="gray.500"
              flexWrap="wrap"
            >
              <Text as="span">{formatDuration(service.durationMinutes)}</Text>
            </HStack>
            {service.description && (
              <Text
                color="gray.700"
                fontSize="13px"
                lineHeight={1.5}
                mt={2}
                noOfLines={DESCRIPTION_CLAMP}
              >
                {service.description}
              </Text>
            )}
            {showSeeMore && (
              <Button
                variant="link"
                size="sm"
                color="var(--brand-accent)"
                fontWeight={600}
                fontSize="13px"
                mt={1}
                alignSelf="flex-start"
                onClick={(e) => {
                  e.stopPropagation();
                  detail.onOpen();
                }}
              >
                See more
              </Button>
            )}
            <Text fontSize="15px" fontWeight={700} color="gray.900" mt={2}>
              {formatPrice(service)}
            </Text>
          </VStack>
          {variant === 'book' && (
            <BrandButton
              brandVariant="outline"
              size="sm"
              flexShrink={0}
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(service);
              }}
            >
              {service.priceType === 'ON_REQUEST' ? 'Request' : 'Book'}
            </BrandButton>
          )}
          {variant === 'select' && (
            <Box
              as="button"
              type="button"
              aria-label={selected ? 'Unselect service' : 'Select service'}
              aria-pressed={selected}
              onClick={(e: MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                onSelect?.(service);
              }}
              flexShrink={0}
              alignSelf="center"
              w="32px"
              h="32px"
              borderRadius="full"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              bg={selected ? 'var(--brand-accent)' : 'white'}
              color={selected ? 'var(--brand-on-accent)' : 'gray.500'}
              border="1.5px solid"
              borderColor={selected ? 'var(--brand-accent)' : 'gray.300'}
              transition="all .15s"
              _hover={{
                borderColor: 'var(--brand-accent)',
                color: selected ? 'var(--brand-on-accent)' : 'var(--brand-accent)',
              }}
            >
              {selected ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
            </Box>
          )}
        </HStack>
      </Box>

      {canOpenDetail &&
        (isDesktop ? (
          <Modal
            isOpen={detail.isOpen}
            onClose={detail.onClose}
            size="xl"
            isCentered
          >
            <ModalOverlay bg="blackAlpha.500" />
            <ModalContent borderRadius="18px" overflow="hidden" maxW="560px">
              <ModalHeader p={0} />
              <ModalCloseButton
                top={3}
                right={3}
                borderRadius="full"
                bg="gray.100"
                _hover={{ bg: 'gray.200' }}
              />
              <ModalBody p={0}>
                <ServiceDetailBody
                  service={service}
                  showBook={variant === 'book'}
                  onBook={() => {
                    detail.onClose();
                    onBook?.(service);
                  }}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        ) : (
          <Drawer
            isOpen={detail.isOpen}
            onClose={detail.onClose}
            placement="bottom"
          >
            <DrawerOverlay bg="blackAlpha.500" />
            <DrawerContent
              borderTopRadius="18px"
              maxH="92vh"
              overflow="hidden"
            >
              <DrawerHeader p={0} />
              <DrawerCloseButton
                top={3}
                right={3}
                borderRadius="full"
                bg="gray.100"
                _hover={{ bg: 'gray.200' }}
              />
              <DrawerBody p={0}>
                <ServiceDetailBody
                  service={service}
                  showBook={variant === 'book'}
                  onBook={() => {
                    detail.onClose();
                    onBook?.(service);
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        ))}
    </>
  );
}

function ServiceDetailBody({
  service,
  showBook,
  onBook,
}: {
  service: Service;
  showBook: boolean;
  onBook: () => void;
}) {
  return (
    <Flex direction="column" maxH="92vh">
      <Box flex="1" overflowY="auto" px={6} pt={4} pb={6}>
        <Text
          fontSize="26px"
          fontWeight={700}
          letterSpacing="-0.02em"
          color="gray.900"
          mb={3}
        >
          {service.name}
        </Text>
        <HStack
          spacing={3.5}
          fontSize="14px"
          color="gray.700"
          flexWrap="wrap"
          mb={4}
        >
          <Text as="span">{formatDuration(service.durationMinutes)}</Text>
        </HStack>

        {service.photoUrl ? (
          <Image
            src={service.photoUrl}
            alt={service.name}
            w="100%"
            h="220px"
            objectFit="cover"
            borderRadius="12px"
            mb={4}
          />
        ) : (
          <Box
            h="160px"
            borderRadius="12px"
            bg="gray.100"
            mb={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="12px" color="gray.500" fontFamily="mono">
              service photo
            </Text>
          </Box>
        )}

        {service.description && (
          <Text
            color="gray.700"
            fontSize="15px"
            lineHeight={1.65}
            whiteSpace="pre-wrap"
          >
            {service.description}
          </Text>
        )}
      </Box>

      <Flex
        align="center"
        justify="space-between"
        gap={4}
        px={6}
        py={4}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        <Box>
          <Text fontSize="18px" fontWeight={700} color="gray.900">
            {formatPrice(service)}
          </Text>
          <Text fontSize="12px" color="gray.500">
            {formatDuration(service.durationMinutes)}
          </Text>
        </Box>
        {showBook && (
          <BrandButton size="lg" onClick={onBook}>
            {service.priceType === 'ON_REQUEST' ? 'Request' : 'Book'}
          </BrandButton>
        )}
      </Flex>
    </Flex>
  );
}
