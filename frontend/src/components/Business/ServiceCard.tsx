import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Service } from '../../types';
import { useGetSlotsQuery } from '../../store/api/slotsApi';
import { toLocalYmd } from '../../utils/format';
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  PlusIcon,
  UserIcon,
  UsersIcon,
} from '../icons';
import { ServiceMediaTile } from '../Services/atoms/ServiceMediaTile';
import {
  DescriptionItem,
  ServiceDescription,
} from '../Services/atoms/ServiceDescription';
import { ServicePriceLabel } from '../Services/atoms/ServicePriceLabel';
import {
  getDaysLabel,
  getLocationType,
  getCapacityLabel,
} from '../Services/helpers';
import { formatDuration, addDays } from './utils';
import { ServiceDetailBody, type NextAvailableData } from './ServiceDetailBody';
import { BrandProvider } from './brand';
import { useDeviceMode } from './context/DeviceModeContext';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  interactive?: boolean;
  onBook?: (service: Service) => void;
  onSelect?: (service: Service) => void;
}

export function ServiceCard({
  service,
  selected = false,
  onBook,
  onSelect,
}: ServiceCardProps) {
  const isDesktop = useDeviceMode();
  const detail = useDisclosure();
  const slotsQuery = useGetSlotsQuery(
    {
      serviceId: service.id as number,
      from: toLocalYmd(new Date()),
      to: toLocalYmd(addDays(new Date(), 6)),
    },
    { skip: !detail.isOpen || typeof service.id !== 'number' },
  );

  const nextAvailable: NextAvailableData | undefined =
    typeof service.id === 'number'
      ? { slots: slotsQuery.data?.slots ?? [], isLoading: slotsQuery.isLoading }
      : undefined;

  const locationType = getLocationType(service);
  const days = getDaysLabel(service.schedule);
  const spots = service.type === 'GROUP' ? service.capacity : null;

  const handleCardClick = () => {
    detail.onOpen();
  };

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      detail.onOpen();
    }
  };

  return (
    <BrandProvider brandColor={service.color ?? undefined}>
      <Box
        role="button"
        tabIndex={0}
        textAlign="left"
        w="100%"
        p={{ base: 3, md: 4 }}
        overflow="hidden"
        borderWidth="1px"
        borderColor={selected ? 'var(--brand-accent)' : 'gray.200'}
        bg={selected ? 'var(--brand-accent-soft)' : 'white'}
        color="gray.700"
        borderRadius="14px"
        cursor="pointer"
        _hover={{ borderColor: 'var(--brand-accent)' }}
        _focusVisible={{
          outline: '2px solid',
          outlineColor: 'var(--brand-accent)',
          outlineOffset: '2px',
        }}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
      >
        <HStack align="center" spacing={4} w="100%" minW={0}>
          <ServiceMediaTile service={service} locationType={locationType} size={isDesktop ? 84 : 72} />

          <VStack align="stretch" spacing={3} flex={1} minW={0}>
            <Text fontSize="md" fontWeight={700} color="gray.900" noOfLines={1}>{service.name}</Text>

            <ServiceDescription>
              <DescriptionItem icon={<ClockIcon size={14} />} label={formatDuration(service.durationMinutes)} />
              <DescriptionItem
                icon={service.type === 'GROUP' ? <UsersIcon size={14} /> : <UserIcon size={14} />}
                label={getCapacityLabel(service)}
              />
              {spots && <DescriptionItem icon={<UsersIcon size={14} />} label={`${spots} left`} />}
              {days && <DescriptionItem icon={<CalendarIcon size={14} />} label={days} />}
            </ServiceDescription>
          </VStack>

          <VStack align="flex-end" spacing={2} flexShrink={0}>
            <ServicePriceLabel service={service} />
            {onBook && (
              <Button
                size="sm"
                bg="var(--brand-accent)"
                color="var(--brand-on-accent)"
                rightIcon={<ArrowRightIcon size={14} />}
                _hover={{ opacity: 0.9 }}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onBook(service);
                }}
              >
                Book
              </Button>
            )}
            {onSelect && (
              <Box
                as="button"
                type="button"
                aria-label={selected ? 'Unselect service' : 'Select service'}
                aria-pressed={selected}
                onClick={(e: MouseEvent<HTMLElement>) => {
                  e.stopPropagation();
                  onSelect(service);
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
          </VStack>
        </HStack>
      </Box>

      {isDesktop ? (
        <Modal
          isOpen={detail.isOpen}
          onClose={detail.onClose}
          size="xl"
          isCentered
        >
          <ModalOverlay bg="blackAlpha.500" />
            <ModalContent borderRadius="18px" overflow="hidden" maxW="560px">
              <BrandProvider brandColor={service.color ?? undefined}>
                <ModalHeader p={0} />
                <ModalBody p={0}>
                  <ServiceDetailBody
                    service={service}
                    showBook={!!onBook}
                    onBook={() => {
                      detail.onClose();
                      onBook?.(service);
                    }}
                    onClose={detail.onClose}
                    nextAvailable={nextAvailable}
                  />
                </ModalBody>
              </BrandProvider>
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
            <DrawerBody p={0}>
              <ServiceDetailBody
                service={service}
                showBook={!!onBook}
                onBook={() => {
                  detail.onClose();
                  onBook?.(service);
                }}
                onClose={detail.onClose}
                nextAvailable={nextAvailable}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </BrandProvider>
  );
}
