import { Box, Flex, Text, VStack, Button } from '@chakra-ui/react';
import { formatDuration, formatPrice } from '../../../../utils/format';
import type { Service } from '../../../../types';

interface Props {
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}

export function BookingServiceCard({ service, isSelected, onSelect }: Props) {
  return (
    <Box
      as="div"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      textAlign="left"
      w="100%"
      p={{ base: 5 }}
      bg="white"
      border="1px solid"
      borderColor={isSelected ? 'var(--brand-color, #6B46C1)' : '#ECECEC'}
      borderRadius="2xl"
      boxShadow={isSelected ? '0 0 0 1px var(--brand-color, #6B46C1), 0 4px 12px rgba(107, 70, 193, 0.06)' : '0 2px 4px rgba(0, 0, 0, 0.01)'}
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        borderColor: isSelected ? 'var(--brand-color, #6B46C1)' : 'black',
        boxShadow: isSelected
          ? '0 0 0 1px var(--brand-color, #6B46C1), 0 6px 16px rgba(107, 70, 193, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.03)',
        transform: 'translateY(-0.5px)',
      }}
      cursor="pointer"
    >
      <Flex align="center" justify="space-between" gap={4}>
        
        {/* Left Column: Service Details */}
        <VStack align="flex-start" spacing={1.5} flex={1} minW={0}>
          <Text
            fontWeight="700"
            fontSize="md"
            color="black"
            noOfLines={1}
            letterSpacing="-0.01em"
          >
            {service.name}
          </Text>

          <Text
            fontSize="sm"
            color="gray.450"
            fontWeight="500"
          >
            {formatDuration(service.durationMinutes)}
          </Text>

          {service.description && (
            <Text
              fontSize="sm"
              color="gray.500"
              noOfLines={1}
              lineHeight="short"
            >
              {service.description}
            </Text>
          )}

          <Text
            fontWeight="700"
            fontSize="md"
            color="black"
            pt={0.5}
          >
            {formatPrice(Number(service.price))}
          </Text>
        </VStack>

        {/* Right Column: Pill Action Button */}
        <Button
          size="sm"
          h="34px"
          borderRadius="full"
          px={5}
          fontSize="xs"
          fontWeight="700"
          variant={isSelected ? 'solid' : 'outline'}
          bg={isSelected ? 'var(--brand-color, #6B46C1)' : 'white'}
          color={isSelected ? 'white' : 'black'}
          borderColor={isSelected ? 'var(--brand-color, #6B46C1)' : '#ECECEC'}
          _hover={{
            bg: isSelected ? 'var(--brand-color-dark, #53369B)' : 'gray.50',
            borderColor: isSelected ? 'var(--brand-color-dark, #53369B)' : 'black',
          }}
          _active={{
            transform: 'scale(0.96)',
          }}
          transition="all 0.12s ease"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? 'Added ✓' : 'Book'}
        </Button>

      </Flex>
    </Box>
  );
}
