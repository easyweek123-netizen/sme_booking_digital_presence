import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { HeartIcon, ActivityIcon, SmileIcon } from '../icons';
import type { BusinessCategory, BusinessType } from '../../types';

const MotionBox = motion.create(Box);

interface CategoryCardProps {
  category: BusinessCategory;
  onTypeClick?: (type: BusinessType) => void;
}

// Map category slugs to icons from shared icons module
const categoryIcons: Record<string, React.ReactNode> = {
  beauty: <HeartIcon size={28} />,
  health: <ActivityIcon size={28} />,
  wellness: <SmileIcon size={28} />,
};

export function CategoryCard({ category, onTypeClick }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] || (
    <Text fontSize="2xl">{category.icon}</Text>
  );

  return (
    <MotionBox
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      p={6}
      minW={{ base: '280px', md: '320px' }}
      maxW={{ base: '280px', md: '320px' }}
      h="auto"
      boxShadow="0 1px 3px rgba(0,0,0,0.04)"
      whileHover={{
        y: -4,
        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
      }}
      transition={{ duration: 0.2 }}
      flexShrink={0}
    >
      {/* Category Header */}
      <VStack align="start" spacing={5}>
        {/* Icon and Title */}
        <Box display="flex" alignItems="center" gap={3}>
          <Box
            w="52px"
            h="52px"
            borderRadius="xl"
            bg={`${category.color}15`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={category.color}
          >
            {icon}
          </Box>
          <Heading
            as="h3"
            fontSize="xl"
            fontWeight="600"
            color={category.color}
            textTransform="capitalize"
          >
            {category.name}
          </Heading>
        </Box>

        {/* Business Types List */}
        <VStack align="start" spacing={2} w="full">
          {category.types.map((type) => (
            <Text
              key={type.id}
              fontSize="md"
              color="gray.700"
              cursor="pointer"
              py={1}
              w="full"
              role="button"
              tabIndex={0}
              _hover={{
                color: category.color,
                transform: 'translateX(4px)',
              }}
              transition="all 0.15s ease"
              onClick={() => onTypeClick?.(type)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onTypeClick?.(type);
                }
              }}
            >
              {type.name}
            </Text>
          ))}
        </VStack>
      </VStack>
    </MotionBox>
  );
}
