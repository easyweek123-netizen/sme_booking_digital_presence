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
        <VStack spacing={{ base: 10, md: 14 }}>
          {/* Section Header - Centered */}
          <VStack spacing={4} textAlign="center" maxW="600px">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="700"
                color="gray.900"
              >
                Quick Solutions for Your Business
              </Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
                Select your business area to receive a tailored option for your industry
              </Text>
            </MotionBox>
          </VStack>

          {/* Categories Carousel */}
          <Box w="full" position="relative">
            {/* Navigation Arrows */}
            <HStack
              position="absolute"
              top="50%"
              left={0}
              right={0}
              transform="translateY(-50%)"
              justify="space-between"
              px={{ base: 0, md: 2 }}
              zIndex={2}
              pointerEvents="none"
              display={{ base: 'none', md: 'flex' }}
            >
              <IconButton
                aria-label="Previous categories"
                icon={<ChevronLeftIcon />}
                onClick={() => scroll('left')}
                variant="solid"
                borderRadius="full"
                size="lg"
                bg="white"
                color="gray.600"
                boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                _hover={{ bg: 'gray.50' }}
                isDisabled={activeIndex === 0}
                pointerEvents="auto"
                opacity={activeIndex === 0 ? 0.5 : 1}
              />
              <IconButton
                aria-label="Next categories"
                icon={<ChevronRightIcon />}
                onClick={() => scroll('right')}
                variant="solid"
                borderRadius="full"
                size="lg"
                bg="white"
                color="gray.600"
                boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                _hover={{ bg: 'gray.50' }}
                isDisabled={activeIndex >= (categories?.length || 1) - 1}
                pointerEvents="auto"
                opacity={activeIndex >= (categories?.length || 1) - 1 ? 0.5 : 1}
              />
            </HStack>

            {/* Carousel Container */}
            <Box overflow="hidden" px={{ base: 0, md: 12 }}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <HStack spacing={5} overflow="hidden" justify="center">
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
            </Box>

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
        </VStack>
      </Container>
    </Box>
  );
}

export { CategoryCard } from './CategoryCard';
