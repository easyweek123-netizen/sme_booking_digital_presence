import { Box, VStack, Text, Collapse, Button, Flex } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { ChevronDownIcon } from '../icons';
import { ServiceCard } from './ServiceCard';
import type { Service } from '../../types';

interface ServicesTabProps {
  services: Service[];
  brandColor?: string | null;
  onBookService: (service: Service) => void;
}

interface CategoryGroup {
  categoryId: number | null;
  categoryName: string;
  services: Service[];
}

export function ServicesTab({ services, brandColor, onBookService }: ServicesTabProps) {
  // Group services by category
  const categoryGroups = useMemo(() => {
    const groups: Map<number | null, CategoryGroup> = new Map();
    
    // Sort services by displayOrder first
    const sortedServices = [...services].sort((a, b) => {
      // First sort by category displayOrder
      const catOrderA = a.category?.displayOrder ?? 999;
      const catOrderB = b.category?.displayOrder ?? 999;
      if (catOrderA !== catOrderB) return catOrderA - catOrderB;
      
      // Then by service displayOrder
      return a.displayOrder - b.displayOrder;
    });

    sortedServices.forEach((service) => {
      const categoryId = service.categoryId;
      const categoryName = service.category?.name || 'Services';

      if (!groups.has(categoryId)) {
        groups.set(categoryId, {
          categoryId,
          categoryName,
          services: [],
        });
      }

      groups.get(categoryId)!.services.push(service);
    });

    // Convert to array and sort - uncategorized (null) goes last
    return Array.from(groups.values()).sort((a, b) => {
      if (a.categoryId === null) return 1;
      if (b.categoryId === null) return -1;
      return 0;
    });
  }, [services]);

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<number | null>>(() => {
    // Expand all categories by default
    return new Set(categoryGroups.map((g) => g.categoryId));
  });

  const toggleCategory = (categoryId: number | null) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // If no categories or single "Services" group, show flat list
  const showCategories = categoryGroups.length > 1 || 
    (categoryGroups.length === 1 && categoryGroups[0].categoryId !== null);

  if (!showCategories) {
    // Flat list without category headers
    return (
      <VStack spacing={3} align="stretch">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            brandColor={brandColor}
            onBook={() => onBookService(service)}
          />
        ))}
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {categoryGroups.map((group) => (
        <CategorySection
          key={group.categoryId ?? 'uncategorized'}
          group={group}
          isExpanded={expandedCategories.has(group.categoryId)}
          onToggle={() => toggleCategory(group.categoryId)}
          brandColor={brandColor}
          onBookService={onBookService}
        />
      ))}
    </VStack>
  );
}

interface CategorySectionProps {
  group: CategoryGroup;
  isExpanded: boolean;
  onToggle: () => void;
  brandColor?: string | null;
  onBookService: (service: Service) => void;
}

function CategorySection({
  group,
  isExpanded,
  onToggle,
  brandColor,
  onBookService,
}: CategorySectionProps) {
  return (
    <Box>
      {/* Category Header */}
      <Button
        variant="ghost"
        w="100%"
        justifyContent="space-between"
        px={0}
        py={2}
        h="auto"
        onClick={onToggle}
        _hover={{ bg: 'transparent' }}
      >
        <Flex align="center" gap={2}>
          <Text fontWeight="600" color="gray.800" fontSize="md">
            {group.categoryName}
          </Text>
          <Text fontSize="sm" color="gray.400">
            ({group.services.length})
          </Text>
        </Flex>
        <Box
          transform={isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.2s"
          color="gray.400"
        >
          <ChevronDownIcon size={20} />
        </Box>
      </Button>

      {/* Services in Category */}
      <Collapse in={isExpanded}>
        <VStack spacing={3} align="stretch" mt={2}>
          {group.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              brandColor={brandColor}
              onBook={() => onBookService(service)}
            />
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
}

