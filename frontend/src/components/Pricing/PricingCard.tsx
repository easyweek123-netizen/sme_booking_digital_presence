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
  price: string;
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
      bg="white"
      borderRadius="2xl"
      border="2px"
      borderColor={isPremium ? 'purple.200' : 'gray.100'}
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
        borderColor: isPremium ? 'purple.300' : 'brand.200',
        boxShadow: isPremium
          ? '0 20px 40px rgba(139, 92, 246, 0.15)'
          : '0 20px 40px rgba(0,0,0,0.08)',
        transform: 'translateY(-4px)',
      }}
      transitionProperty="all"
      transitionDuration="0.3s"
    >
      {/* Premium gradient accent */}
      {isPremium && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bgGradient="linear(to-r, purple.400, indigo.500, purple.600)"
        />
      )}

      {/* Badge */}
      {badge && (
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorScheme={isPremium ? 'purple' : 'green'}
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
            color={isPremium ? 'purple.600' : 'brand.600'}
            textTransform="uppercase"
            letterSpacing="wide"
            mb={1}
          >
            {title}
          </Text>
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
                bg={isPremium ? 'purple.100' : 'green.100'}
                color={isPremium ? 'purple.600' : 'green.600'}
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
          colorScheme={isPremium ? 'purple' : 'brand'}
          variant={isPremium ? 'outline' : 'solid'}
          onClick={onButtonClick}
          fontWeight="600"
          py={6}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: isPremium
              ? '0 4px 12px rgba(139, 92, 246, 0.3)'
              : '0 4px 12px rgba(46, 182, 125, 0.3)',
          }}
        >
          {buttonText}
        </Button>
      </VStack>
    </MotionBox>
  );
}

