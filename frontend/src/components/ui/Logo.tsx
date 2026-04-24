import { Box, Heading, Text, HStack } from '@chakra-ui/react';

type LogoSize = 'sm' | 'md' | 'lg';
type LogoColorScheme = 'light' | 'dark';

interface LogoProps {
  size?: LogoSize;
  colorScheme?: LogoColorScheme;
  showTagline?: boolean;
  iconOnly?: boolean;
  onClick?: () => void;
  showHeading?: boolean;
}

const sizeConfig = {
  sm: {
    box: '28px',
    fontSize: 'sm',
    headingSize: 'sm',
    borderRadius: 'xs',
    spacing: 2,
  },
  md: {
    box: '36px',
    fontSize: 'lg',
    headingSize: 'md',
    borderRadius: 'xs',
    spacing: 2,
  },
  lg: {
    box: '40px',
    fontSize: 'lg',
    headingSize: 'md',
    borderRadius: 'xs',
    spacing: 3,
  },
};

const colorConfig = {
  light: {
    text: 'gray.800'
  },
  dark: {
    text: 'gray.50',
  },
};

export function Logo({
  size = 'md',
  colorScheme = 'light',
  onClick,
  showHeading = true,
}: LogoProps) {
  const sizeStyles = sizeConfig[size];
  const colorStyles = colorConfig[colorScheme];
  const isClickable = !!onClick;

  const logoBox = (
    <Box
      w={sizeStyles.box}
      h={sizeStyles.box}
      bg="gray.800"
      borderRadius={sizeStyles.borderRadius}
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="box-shadow 0.2s ease"
      _groupHover={isClickable ? { 
        boxShadow: '0 4px 12px color-mix(in srgb, var(--chakra-colors-brand-500) 40%, transparent)' 
      } : undefined}
    >
      <Text color="white" fontWeight="bold" fontSize={sizeStyles.fontSize}>
        B
      </Text>
    </Box>
  );

  return (
    <HStack
      spacing={sizeStyles.spacing}
      cursor={isClickable ? 'pointer' : 'default'}
      onClick={onClick}
      role={isClickable ? 'group' : undefined}
    >
      {logoBox}
      {showHeading && <Heading
        size={sizeStyles.headingSize}
        color={colorStyles.text}
        fontWeight="700"
      >
        BookEasy
      </Heading>}
    </HStack>
  );
}
