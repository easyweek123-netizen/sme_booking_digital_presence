import { Box, Flex, HStack, Text, useDisclosure } from '@chakra-ui/react';
import type { Service } from '../../../types';
import { CheckIcon, UsersIcon } from '../../icons';
import { MapPinIcon } from '../../icons';
import { formatDuration, formatPrice, locationMeta } from '../utils';

interface WizardServiceRowProps {
  service: Service;
  selected: boolean;
  onSelect: (s: Service) => void;
}

export function WizardServiceRow({ service, selected, onSelect }: WizardServiceRowProps) {
  const loc = locationMeta(service.location);
  const { isOpen: descOpen, onToggle } = useDisclosure();
  const description = service.description ?? '';
  return (
    <Box
      onClick={() => onSelect(service)}
      role="button"
      bg="white"
      border="1.5px solid"
      borderColor={selected ? 'var(--brand-accent)' : 'gray.200'}
      boxShadow={selected ? '0 0 0 3px var(--brand-accent-soft)' : 'none'}
      borderRadius="14px"
      p={4.5}
      cursor="pointer"
      transition="border-color .15s, box-shadow .15s"
    >
      <Flex align="flex-start" gap={4}>
        <Box flex="1" minW={0}>
          <Flex align="center" justify="space-between" gap={3}>
            <Text fontSize="md" fontWeight={600} color="gray.900">
              {service.name}
            </Text>
            <Text fontSize="md" fontWeight={700} color="gray.900" whiteSpace="nowrap">
              {formatPrice(service)}
            </Text>
          </Flex>
          <HStack spacing={2.5} fontSize="13px" color="gray.500" mt={1.5} flexWrap="wrap">
            <Text as="span">{formatDuration(service.durationMinutes)}</Text>
            {loc && (
              <>
                <Text as="span" color="gray.300">·</Text>
                <HStack as="span" spacing={1}>
                  <MapPinIcon size={12} />
                  <Text as="span">{loc.label}</Text>
                </HStack>
              </>
            )}
            {service.type === 'GROUP' && (
              <>
                <Text as="span" color="gray.300">·</Text>
                <HStack as="span" spacing={1}>
                  <UsersIcon size={12} />
                  <Text as="span">Group · up to {service.capacity}</Text>
                </HStack>
              </>
            )}
          </HStack>
          {description && (
            <>
              <Text
                m="10px 0 0"
                color="gray.600"
                fontSize="sm"
                lineHeight={1.5}
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: descOpen ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </Text>
              {description.length > 80 && (
                <Box
                  as="button"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  color="var(--brand-accent)"
                  fontWeight={600}
                  fontSize="13px"
                  mt={1}
                >
                  {descOpen ? 'See less' : 'See more'}
                </Box>
              )}
            </>
          )}
        </Box>
        <Flex
          w="26px"
          h="26px"
          borderRadius="full"
          flexShrink={0}
          bg={selected ? 'var(--brand-accent)' : 'white'}
          border="1.5px solid"
          borderColor={selected ? 'var(--brand-accent)' : 'gray.300'}
          align="center"
          justify="center"
          color="var(--brand-on-accent)"
        >
          {selected && <CheckIcon size={14} />}
        </Flex>
      </Flex>
    </Box>
  );
}
