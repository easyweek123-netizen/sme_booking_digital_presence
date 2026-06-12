import { Box, Stack, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type Props = {
  icon?: ReactNode;
  title: string;
  sub?: string;
  /** Interactive variant — adds button semantics, hover, and click handler. */
  onClick?: () => void;
  /** Highlight as the currently selected option. Only meaningful when `onClick` is set. */
  active?: boolean;
  /** Background of the small square icon container. Default: `surface.muted`. */
  iconBg?: string;
  /** Color the icon glyph renders in (via `currentColor`). Default: inherited. */
  iconColor?: string;
};

export function Tile({
  icon,
  title,
  sub,
  onClick,
  active = false,
  iconBg = 'surface.muted',
  iconColor,
}: Props) {
  const isInteractive = !!onClick;
  return (
    <VStack
      as={'button'}
      type={'button'}
      onClick={onClick}
      align="stretch"
      p={2}
      borderRadius="lg"
      borderWidth={1}
      borderColor={active ? 'accent.primary' : 'border.subtle'}
      transition="all 0.15s"
      cursor={isInteractive ? 'pointer' : 'default'}
      _hover={{ borderColor: 'accent.primary' }}
      textAlign="left"
    >
      {icon ? (
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align={{ base: 'center', lg: 'flex-start' }}
          spacing={{ base: 2, md: 3 }}
        >
          <Box
            w={8}
            h={8}
            borderRadius="md"
            bg={iconBg}
            color={iconColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {icon}
          </Box>
          <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={0}>
            <Text
              fontWeight="600"
              fontSize="sm"
              color="text.heading"
              textAlign={{ base: 'center', lg: 'left' }}
            >
              {title}
            </Text>
            {sub && (
              <Text
                fontSize="xs"
                color="text.secondary"
                textAlign={{ base: 'center', lg: 'left' }}
              >
                {sub}
              </Text>
            )}
          </VStack>
        </Stack>
      ) : (
        <VStack align="center" spacing={0}>
          <Text fontWeight="600" fontSize="sm" color="text.heading">
            {title}
          </Text>
          {sub && (
            <Text fontSize="xs" color="text.muted" textAlign="center">
              {sub}
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
}
