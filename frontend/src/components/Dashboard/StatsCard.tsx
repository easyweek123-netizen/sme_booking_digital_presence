import { Box, Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  index?: number;
  to?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  color = 'brand.500',
  index = 0,
  to,
}: StatsCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      bg="white"
      borderRadius="2xl"
      border="1px"
      borderColor="gray.100"
      p={5}
      cursor={to ? 'pointer' : 'default'}
      onClick={handleClick}
      _hover={to ? {
        borderColor: 'brand.200',
        boxShadow: 'md',
        transform: 'translateY(-3px)',
      } : {
        borderColor: 'gray.200',
      }}
      transitionProperty="all"
      transitionDuration="0.2s"
    >
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text
            fontSize="sm"
            fontWeight="500"
            color="gray.500"
            mb={1}
          >
            {label}
          </Text>
          <Text
            fontSize="3xl"
            fontWeight="700"
            color="gray.900"
            lineHeight="1"
          >
            {value}
          </Text>
        </Box>
        <Flex
          w="44px"
          h="44px"
          align="center"
          justify="center"
          borderRadius="xl"
          bg={`${color.split('.')[0]}.50`}
          color={color}
        >
          {icon}
        </Flex>
      </Flex>
    </MotionBox>
  );
}

