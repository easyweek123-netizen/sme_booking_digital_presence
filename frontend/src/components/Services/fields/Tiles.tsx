import type { ReactNode } from 'react';
import { Box, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import type { ResponsiveValue } from '@chakra-ui/react';
import type { TileOption } from './tileOptions';

interface TileButtonProps {
  icon?: ReactNode;
  title: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
}

function TileButton({ icon, title, sub, active, onClick }: TileButtonProps) {
  return (
    <VStack
      as="button"
      type="button"
      onClick={onClick}
      align="stretch"
      p={2}
      borderRadius="lg"
      borderWidth={active ? 2 : 1}
      borderColor={active ? 'brand.500' : 'border.subtle'}
      bg={active ? 'brand.50' : 'surface.card'}
      transition="all 0.15s"
      _hover={{ borderColor: 'border.strong' }}
    >
      {icon ? (
        <HStack align="flex-start">
          <Box
            w={8}
            h={8}
            borderRadius="md"
            bg="surface.muted"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {icon}
          </Box>
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="600" fontSize="sm" color="text.heading">
              {title}
            </Text>
            {sub && (
              <Text fontSize="xs" color="text.muted" textAlign="left">
                {sub}
              </Text>
            )}
          </VStack>
        </HStack>
      ) : (
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="600" fontSize="sm" color="text.heading">
            {title}
          </Text>
          {sub && (
            <Text fontSize="xs" color="text.muted" textAlign="left">
              {sub}
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
}

interface TilesProps<T extends string> {
  options: readonly TileOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: ResponsiveValue<number>;
}

export function Tiles<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: TilesProps<T>) {
  return (
    <SimpleGrid columns={columns} spacing={3}>
      {options.map((o) => (
        <TileButton
          key={o.value}
          icon={o.icon}
          title={o.title}
          sub={o.sub}
          active={value === o.value}
          onClick={() => onChange(o.value)}
        />
      ))}
    </SimpleGrid>
  );
}
