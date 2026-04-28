import { Box, Container, type BoxProps } from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const MotionBox = motion.create(Box);

interface SectionProps extends Omit<BoxProps, 'as'> {
  id?: string;
  children: ReactNode;
  bg?: BoxProps['bg'];
  containerSize?: 'lg' | 'xl' | '2xl';
  spacing?: 'sm' | 'md' | 'lg';
}

const SPACING = {
  sm: { base: 12, md: 16 },
  md: { base: 16, md: 24 },
  lg: { base: 20, md: 32 },
} as const;

export function Section({
  id,
  children,
  bg = 'surface.page',
  containerSize = 'xl',
  spacing = 'md',
  ...rest
}: SectionProps) {
  const reduce = useReducedMotion();
  const py = SPACING[spacing];

  return (
    <Box as="section" id={id} bg={bg} py={py} {...rest}>
      <Container maxW={`container.${containerSize}`}>
        <MotionBox
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </MotionBox>
      </Container>
    </Box>
  );
}
