import { Box, Heading, Text, HStack, VStack } from '@chakra-ui/react';

type LogoSize = 'sm' | 'md' | 'lg';
type LogoColorScheme = 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  colorScheme?: LogoColorScheme;
  showTagline?: boolean;
  onClick?: () => void;
}

const sizeConfig = {
  sm: {
    box: '28px',
    fontSize: 'sm',
    headingSize: 'sm',
    borderRadius: 'md',
    spacing: 2,
  },
  md: {
    box: '36px',
    fontSize: 'lg',
    headingSize: 'md',
    borderRadius: 'lg',
    spacing: 3,
  },
  lg: {
    box: '40px',
    fontSize: 'lg',
    headingSize: 'md',
    borderRadius: 'xl',
    spacing: 3,
  },
};

const colorConfig = {
  light: {
    text: 'gray.900',
    tagline: 'gray.400',
  },
  dark: {
    text: 'gray.400',
    tagline: 'gray.500',
  },
};

export function Logo({
  size = 'md',
  colorScheme = 'light',
  showTagline = false,
  onClick,
}: LogoProps) {
  const sizeStyles = sizeConfig[size];
  const colorStyles = colorConfig[colorScheme];
  const isClickable = !!onClick;

  return (
    <HStack
      spacing={sizeStyles.spacing}
      cursor={isClickable ? 'pointer' : 'default'}
      onClick={onClick}
      _hover={isClickable ? { opacity: 0.8 } : undefined}
      transition="opacity 0.2s"
    >
      <Box
        w={sizeStyles.box}
        h={sizeStyles.box}
        bg="brand.500"
        borderRadius={sizeStyles.borderRadius}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow={size === 'lg' ? '0 2px 8px rgba(46, 182, 125, 0.3)' : undefined}
      >
        <Text color="white" fontWeight="bold" fontSize={sizeStyles.fontSize}>
          B
        </Text>
      </Box>
      {showTagline ? (
        <VStack align="start" spacing={0}>
          <Heading
            size={sizeStyles.headingSize}
            color={colorStyles.text}
            fontWeight="700"
          >
            BookEasy
          </Heading>
          <Text fontSize="xs" color={colorStyles.tagline}>
            Booking made simple
          </Text>
        </VStack>
      ) : (
        <Heading
          size={sizeStyles.headingSize}
          color={colorStyles.text}
          fontWeight="700"
        >
          BookEasy
        </Heading>
      )}
    </HStack>
  );
}
