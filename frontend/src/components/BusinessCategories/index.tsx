import { useRef, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  IconButton,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetBusinessCategoriesQuery } from '../../store/api';
import { CategoryCard } from './CategoryCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { ROUTES } from '../../config/routes';
import { SECTION_PADDING, CARD_WIDTH } from '../../constants';
import type { BusinessType } from '../../types';

const MotionBox = motion.create(Box);

const CARD_SCROLL_WIDTH = 340; // card width + gap

export function BusinessCategories() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: categories, isLoading, error } = useGetBusinessCategoriesQuery();

  const handleTypeClick = (type: BusinessType) => {
    // Navigate to onboarding with pre-selected type
    navigate(ROUTES.ONBOARDING, { state: { selectedTypeId: type.id } });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -CARD_SCROLL_WIDTH : CARD_SCROLL_WIDTH;

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    // Update active index
    const newIndex =
      direction === 'left'
        ? Math.max(0, activeIndex - 1)
        : Math.min((categories?.length || 1) - 1, activeIndex + 1);
    setActiveIndex(newIndex);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !categories) return;

    const newIndex = Math.round(container.scrollLeft / CARD_SCROLL_WIDTH);
    setActiveIndex(Math.min(newIndex, categories.length - 1));
  };

  if (error) {
    return null; // Silently fail - don't show section if API fails
  }

  return (
    <Box bg="gray.50" py={{ base: SECTION_PADDING.base, md: SECTION_PADDING.md }}>
      <Container maxW="container.xl">
        <HStack
          justify="space-between"
          align="start"
          mb={{ base: 8, md: 12 }}
          flexDir={{ base: 'column', lg: 'row' }}
          gap={6}
        >
          {/* Section Header */}
          <VStack align={{ base: 'center', lg: 'start' }} spacing={3} maxW="400px">
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="700"
              color="gray.900"
              lineHeight="1.2"
              textAlign={{ base: 'center', lg: 'left' }}
            >
              Quick solutions for your bussiness
            </Heading>
            <Text
              color="gray.500"
              fontSize={{ base: 'md', md: 'lg' }}
              textAlign={{ base: 'center', lg: 'left' }}
            >
              Select your business area to receive a tailored option for your
              industry.
            </Text>

            {/* Navigation Arrows - Desktop */}
            <HStack spacing={2} display={{ base: 'none', lg: 'flex' }} pt={4}>
              <IconButton
                aria-label="Previous categories"
                icon={<ChevronLeftIcon />}
                onClick={() => scroll('left')}
                variant="outline"
                borderRadius="full"
                size="lg"
                borderColor="gray.200"
                color="gray.600"
                _hover={{ bg: 'gray.100', borderColor: 'gray.300' }}
                isDisabled={activeIndex === 0}
              />
              <IconButton
                aria-label="Next categories"
                icon={<ChevronRightIcon />}
                onClick={() => scroll('right')}
                variant="outline"
                borderRadius="full"
                size="lg"
                borderColor="gray.200"
                color="gray.600"
                _hover={{ bg: 'gray.100', borderColor: 'gray.300' }}
                isDisabled={activeIndex >= (categories?.length || 1) - 1}
              />
            </HStack>
          </VStack>

          {/* Categories Carousel */}
          <Box
            flex="1"
            maxW={{ base: '100%', lg: 'calc(100% - 450px)' }}
            overflow="hidden"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <HStack spacing={5} overflow="hidden">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      minW={CARD_WIDTH.category.md}
                      h="280px"
                      borderRadius="2xl"
                      startColor="gray.100"
                      endColor="gray.200"
                    />
                  ))}
                </HStack>
              ) : (
                <MotionBox
                  ref={scrollContainerRef}
                  display="flex"
                  gap={5}
                  overflowX="auto"
                  pb={4}
                  px={1}
                  onScroll={handleScroll}
                  sx={{
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    '& > *': { scrollSnapAlign: 'start' },
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {categories?.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onTypeClick={handleTypeClick}
                    />
                  ))}
                </MotionBox>
              )}
            </AnimatePresence>

            {/* Pagination Dots */}
            {categories && categories.length > 1 && (
              <HStack justify="center" spacing={2} mt={6}>
                {categories.map((_, index) => (
                  <Box
                    key={index}
                    w={activeIndex === index ? '24px' : '8px'}
                    h="8px"
                    borderRadius="full"
                    bg={activeIndex === index ? 'brand.500' : 'gray.300'}
                    transition="all 0.2s ease"
                    cursor="pointer"
                    onClick={() => {
                      const container = scrollContainerRef.current;
                      if (container) {
                        container.scrollTo({
                          left: index * CARD_SCROLL_WIDTH,
                          behavior: 'smooth',
                        });
                        setActiveIndex(index);
                      }
                    }}
                  />
                ))}
              </HStack>
            )}
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}

export { CategoryCard } from './CategoryCard';
