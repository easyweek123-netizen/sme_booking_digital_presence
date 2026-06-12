import { Flex, Text } from '@chakra-ui/react';
import type { ComponentType, ReactNode } from 'react';
import { SparkIcon } from '@/components/icons';

type Props = {
  children: ReactNode;
  icon?: ComponentType<{ size?: number }>;
};

export function EyebrowLabel({ children, icon: Icon = SparkIcon }: Props) {
  return (
    <Flex
      as="span"
      display="inline-flex"
      align="center"
      gap={{ base: 1, md: 2 }}
      px={{ base: 3, md: 3 }}
      py={2}
      bg="accent.soft"
      borderRadius="full"
      color="brand.700"
    >
      <Flex
        align="center"
        justify="center"
        boxSize={4}
        borderRadius="lg"
        bg="accent.primary"
        color="surface.card"
        flexShrink={0}
      >
        <Icon size={20} />
      </Flex>
      <Text
        fontSize={{ base: '11px', md: 'xs' }}
        fontWeight="bold"
        letterSpacing={{ base: 'wide', md: 'wider' }}
        textTransform="uppercase"
      >
        {children}
      </Text>
    </Flex>
  );
}