import { Heading } from '@chakra-ui/react';

interface SectionHeadingProps {
  id?: string;
  children: React.ReactNode;
}

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <Heading
      as="h2"
      id={id}
      sx={{ scrollMarginTop: '96px' }}
      fontSize="22px"
      fontWeight={700}
      letterSpacing="-0.02em"
      m="0 0 16px"
      color="text.heading"
    >
      {children}
    </Heading>
  );
}
