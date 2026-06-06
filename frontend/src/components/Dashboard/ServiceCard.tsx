import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import type { Service } from '../../types';
import { CalendarIcon, ClockIcon } from '../icons';
import { ServiceCoverImage } from '../Services/atoms/ServiceCoverImage';
import { ServiceCapacityBadge } from '../Services/atoms/ServiceCapacityBadge';
import { ServiceControls } from '../Services/atoms/ServiceControls';
import { ServiceLocationIcon } from '../Services/atoms/ServiceLocationIcon';
import {
  DescriptionItem,
  ServiceDescription,
} from '../Services/atoms/ServiceDescription';
import { ServiceDescriptionContainer } from '../Services/atoms/ServiceDescriptionContainer';
import { ServicePriceLabel } from '../Services/atoms/ServicePriceLabel';
import {
  getDaysLabel,
  getLocationLabel,
  getLocationType,
  getSpotsLabel,
} from '../Services/helpers';
import { formatDuration } from '../Business/utils';

interface Props {
  service: Service;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ServiceCard({ service, onEdit, onDelete }: Props) {
  const locationType = getLocationType(service);
  const days = getDaysLabel(service.schedule);
  const spots = getSpotsLabel(service);

  return (
    <Box
      role="group"
      cursor="pointer"
      onClick={onEdit}
      transition="transform .2s"
      _hover={{ transform: 'translateY(-2px)' }}
      color="whiteAlpha.900"
    >
      <ServiceCoverImage service={service} locationType={locationType}>
        <Flex justify="flex-end" p={{ base: 3, md: 4 }}>
          <ServiceControls
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Flex>

        <ServiceDescriptionContainer>
          <VStack align="stretch" spacing={2} flex={1} minW={0}>
            <Text color="inherit" fontWeight={700} fontSize={{ base: 'md', md: 'lg' }} noOfLines={1}>
              {service.name}
            </Text>

            <ServiceDescription size={{ base: 'xs', md: 'sm' }}>
              <ServiceCapacityBadge type={service.type} />
              <DescriptionItem
                icon={<ClockIcon size={14} />}
                label={formatDuration(service.durationMinutes)}
              />
              <DescriptionItem
                icon={<ServiceLocationIcon locationType={locationType} />}
                label={getLocationLabel(locationType)}
              />
              {spots && <DescriptionItem label={spots} />}
            </ServiceDescription>

            {days && (
              <ServiceDescription size="xs">
                <DescriptionItem icon={<CalendarIcon size={12} />} label={days} />
              </ServiceDescription>
            )}
          </VStack>

          <ServicePriceLabel service={service} />
        </ServiceDescriptionContainer>
      </ServiceCoverImage>
    </Box>
  );
}
