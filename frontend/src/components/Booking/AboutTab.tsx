import { Box, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';

interface AboutTabProps {
  content: string | null;
  brandColor?: string | null;
}

// Configure DOMPurify - Extended HTML support for rich content
const ALLOWED_TAGS = [
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Text
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  // Structure
  'div', 'span', 'section',
  // Lists
  'ul', 'ol', 'li',
  // Quotes
  'blockquote', 'q', 'cite',
  // Links & Media
  'a', 'img',
  // Tables
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
  // Other
  'figure', 'figcaption', 'pre', 'code',
];

const ALLOWED_ATTR = [
  // Links
  'href', 'target', 'rel',
  // Images
  'src', 'alt', 'width', 'height', 'loading',
  // Styling
  'style', 'class',
  // Tables
  'colspan', 'rowspan',
  // Accessibility
  'title', 'aria-label',
];

export function AboutTab({ content, brandColor }: AboutTabProps) {
  // Sanitize HTML content
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      // Ensure links open in new tab safely
      ADD_ATTR: ['target'],
      // Allow data URIs for inline images (base64)
      ADD_DATA_URI_TAGS: ['img'],
    });
  }, [content]);

  // Generate gradient colors based on brand color
  const accentColor = brandColor || '#4A7C59';

  if (!content) {
    return (
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        border="1px"
        borderColor="gray.100"
        textAlign="center"
      >
        <Text color="gray.400">No information available.</Text>
      </Box>
    );
  }

  return (
    <Box position="relative">
      {/* Decorative gradient accent on the left */}
      <Box
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        w="4px"
        borderRadius="full"
        bgGradient={`linear(to-b, ${accentColor}, ${accentColor}60, ${accentColor}20)`}
      />
      
      {/* Content container */}
      <Box
        bg="white"
        p={6}
        pl={8}
        borderRadius="xl"
        border="1px"
        borderColor="gray.100"
        ml={1}
        position="relative"
        className="about-content"
        _before={{
          content: '""',
          position: 'absolute',
          top: 4,
          left: -4,
          w: 8,
          h: 8,
          borderRadius: 'full',
          bg: `${accentColor}15`,
        }}
        sx={{
          // Typography styles for rendered HTML
          '& h1': {
            fontSize: '2xl',
            fontWeight: '700',
            color: 'gray.900',
            mb: 4,
            mt: 5,
            _first: { mt: 0 },
          },
          '& h2': {
            fontSize: 'xl',
            fontWeight: '700',
            color: 'gray.900',
            mb: 3,
            mt: 4,
            position: 'relative',
            _first: { mt: 0 },
            _before: {
              content: '""',
              position: 'absolute',
              left: '-24px',
              top: '50%',
              transform: 'translateY(-50%)',
              w: 2,
              h: 2,
              borderRadius: 'full',
              bg: accentColor,
            },
          },
          '& h3': {
            fontSize: 'lg',
            fontWeight: '600',
            color: 'gray.800',
            mb: 2,
            mt: 4,
          },
          '& h4, & h5, & h6': {
            fontSize: 'md',
            fontWeight: '600',
            color: 'gray.700',
            mb: 2,
            mt: 3,
          },
          '& p': {
            fontSize: 'md',
            color: 'gray.600',
            lineHeight: '1.8',
            mb: 3,
            _last: { mb: 0 },
          },
          '& ul, & ol': {
            pl: 5,
            mb: 3,
            color: 'gray.600',
          },
          '& li': {
            mb: 1.5,
            lineHeight: '1.7',
          },
          '& blockquote': {
            borderLeftWidth: '4px',
            borderLeftColor: accentColor,
            pl: 4,
            py: 3,
            my: 4,
            bg: `${accentColor}08`,
            borderRadius: 'lg',
            fontStyle: 'italic',
            color: 'gray.600',
          },
          '& a': {
            color: accentColor,
            textDecoration: 'underline',
            fontWeight: '500',
            _hover: {
              opacity: 0.8,
            },
          },
          '& strong, & b': {
            fontWeight: '600',
            color: 'gray.800',
          },
          '& em, & i': {
            fontStyle: 'italic',
          },
          // Images
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 'lg',
            my: 4,
          },
          '& figure': {
            my: 4,
            mx: 0,
          },
          '& figcaption': {
            fontSize: 'sm',
            color: 'gray.500',
            textAlign: 'center',
            mt: 2,
          },
          // Tables
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            my: 4,
            fontSize: 'sm',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'gray.200',
            px: 3,
            py: 2,
            textAlign: 'left',
          },
          '& th': {
            bg: 'gray.50',
            fontWeight: '600',
            color: 'gray.700',
          },
          '& tr:hover td': {
            bg: 'gray.50',
          },
          // Horizontal rule
          '& hr': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: 'gray.200',
            my: 6,
          },
          // Code
          '& code': {
            bg: 'gray.100',
            px: 1.5,
            py: 0.5,
            borderRadius: 'md',
            fontSize: 'sm',
            fontFamily: 'mono',
          },
          '& pre': {
            bg: 'gray.100',
            p: 4,
            borderRadius: 'lg',
            overflow: 'auto',
            my: 4,
            '& code': {
              bg: 'transparent',
              p: 0,
            },
          },
          // Mark / highlight
          '& mark': {
            bg: `${accentColor}20`,
            px: 1,
            borderRadius: 'sm',
          },
          // Divs with custom styles will be rendered as-is
          // This allows users to add custom backgrounds, borders, etc.
        }}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </Box>
  );
}

