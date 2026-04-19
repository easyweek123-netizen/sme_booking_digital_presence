import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckIcon } from '../icons';

const MotionBox = motion.create(Box);

interface PricingCardProps {
  title: string;
  price?: string;
  priceSubtext?: string;
  features: string[];
  buttonText: string;
  onButtonClick: () => void;
  isPremium?: boolean;
  badge?: string;
  delay?: number;
}

export function PricingCard({
  title,
  price,
  priceSubtext,
  features,
  buttonText,
  onButtonClick,
  isPremium = false,
  badge,
  delay = 0,
}: PricingCardProps) {
  return (
    <MotionBox
      bg="surface.card"
      borderRadius="2xl"
      border="2px"
      borderColor={isPremium ? 'brand.200' : 'border.subtle'}
      p={8}
      position="relative"
      overflow="hidden"
      h="full"
      display="flex"
      flexDirection="column"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      _hover={{
        borderColor: isPremium ? 'brand.300' : 'brand.200',
        boxShadow: 'cardHover',
        transform: 'translateY(-4px)',
      }}
      transitionProperty="all"
      transitionDuration="0.3s"
    >
      {/* Premium accent */}
      {isPremium && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bg="brand.500"
        />
      )}

      {/* Badge */}
      {badge && (
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorScheme="brand"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {badge}
        </Badge>
      )}

      <VStack spacing={6} align="stretch" flex={1}>
        {/* Title */}
        <Box>
          <Text
            fontSize="sm"
            fontWeight="600"
            color="brand.600"
            textTransform="uppercase"
            letterSpacing="wide"
            mb={1}
          >
            {title}
          </Text>
          {price && (
            <HStack align="baseline" spacing={1}>
              <Heading
                fontSize="4xl"
                fontWeight="800"
                color="gray.900"
                letterSpacing="-0.02em"
              >
                {price}
              </Heading>
              {priceSubtext && (
                <Text fontSize="md" color="gray.500">
                  {priceSubtext}
                </Text>
              )}
            </HStack>
          )}
        </Box>

        {/* Features */}
        <VStack spacing={3} align="stretch" flex={1}>
          {features.map((feature, index) => (
            <HStack key={index} spacing={3} align="flex-start">
              <Box
                flexShrink={0}
                w="20px"
                h="20px"
                borderRadius="full"
                bg="brand.100"
                color="brand.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt="2px"
              >
                <CheckIcon size={12} />
              </Box>
              <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>

        {/* Button */}
        <Button
          size="lg"
          w="full"
          colorScheme="brand"
          variant={isPremium ? 'outline' : 'solid'}
          onClick={onButtonClick}
          fontWeight="600"
          py={6}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'outline',
          }}
        >
          {buttonText}
        </Button>
      </VStack>
    </MotionBox>
  );
}

