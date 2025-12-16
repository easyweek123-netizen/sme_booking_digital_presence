import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Collapse,
  Icon,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '../icons';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  count,
  icon,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box>
      <Flex
        as="button"
        w="full"
        py={2}
        px={0}
        align="center"
        justify="space-between"
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        transition="opacity 0.15s"
        bg="transparent"
        border="none"
        textAlign="left"
      >
        <Flex align="center" gap={2}>
          {icon && (
            <Box color="gray.500" fontSize="sm">
              {icon}
            </Box>
          )}
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            {title}
          </Text>
          {count !== undefined && (
            <Badge
              colorScheme="gray"
              fontSize="xs"
              borderRadius="full"
              px={2}
              fontWeight="500"
            >
              {count}
            </Badge>
          )}
        </Flex>
        <Icon
          as={ChevronRightIcon}
          boxSize={4}
          color="gray.400"
          transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
          transition="transform 0.2s ease-out"
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box pt={2}>{children}</Box>
      </Collapse>
    </Box>
  );
}

