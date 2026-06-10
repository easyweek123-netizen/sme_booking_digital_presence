import { Box, HStack, useDisclosure, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import type { Service, ServiceCategory } from '../../../types';
import { ServiceCard } from '../ServiceCard';

interface ServicesSectionProps {
  services: Service[];
  categories: ServiceCategory[];
  onBook: (s: Service) => void;
}

const FEATURED_LIMIT = 4;

function CategoryFilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      display="inline-flex"
      alignItems="center"
      h="38px"
      px={4}
      borderRadius="full"
      fontSize="sm"
      fontWeight={500}
      bg={active ? 'text.heading' : 'surface.card'}
      color={active ? 'white' : 'text.heading'}
      border="1px solid"
      borderColor={active ? 'text.heading' : 'border.subtle'}
      whiteSpace="nowrap"
      transition="all .15s"
      _hover={{ borderColor: active ? 'text.heading' : 'text.faint' }}
    >
      {children}
    </Box>
  );
}

export function ServicesSection({
  services,
  onBook,
}: ServicesSectionProps) {
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const { isOpen: showAll, onToggle, onClose } = useDisclosure();

  const derivedCategories = useMemo(() => {
    const map = new Map<number, ServiceCategory>();
    for (const s of services) if (s.category) map.set(s.category.id, s.category);
    return Array.from(map.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [services]);

  const visible = useMemo(
    () =>
      activeCat == null
        ? services
        : services.filter((s) => (s.category?.id ?? s.categoryId) === activeCat),
    [activeCat, services],
  );
  const display = showAll ? visible : visible.slice(0, FEATURED_LIMIT);

  const selectCat = (catId: number | null) => {
    setActiveCat(catId);
    onClose();
  };

  return (
    <Box as="section" pt={{ base: 2 }}>
      {/* <SectionHeading id="section-services">Services</SectionHeading> */}

      <HStack spacing={2} overflowX="auto" pb={1} mb={4} sx={{ scrollbarWidth: 'none' }}>
        <CategoryFilterChip active={activeCat == null} onClick={() => selectCat(null)}>
          Featured
        </CategoryFilterChip>
        {derivedCategories.map((c) => (
          <CategoryFilterChip
            key={c.id}
            active={activeCat === c.id}
            onClick={() => selectCat(c.id)}
          >
            {c.name}
          </CategoryFilterChip>
        ))}
      </HStack>

      <VStack spacing={3} align="stretch">
        {display.map((svc) => (
          <ServiceCard
            key={svc.id}
            service={svc}
            onBook={onBook}
          />
        ))}
      </VStack>

      {visible.length > FEATURED_LIMIT && (
        <Box
          as="button"
          mt={4}
          px={5}
          py={2.5}
          borderRadius="full"
          border="1px solid"
          borderColor="border.subtle"
          bg="surface.card"
          color="text.heading"
          fontSize="sm"
          fontWeight={600}
          onClick={onToggle}
        >
          {showAll ? 'Show less' : `See all (${visible.length})`}
        </Box>
      )}
    </Box>
  );
}
