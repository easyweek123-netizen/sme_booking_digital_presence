import type { SystemStyleObject } from '@chakra-ui/react';

export const aboutProseStyles: SystemStyleObject = {
  '.ProseMirror': { outline: 'none', minH: '380px' },
  '.ProseMirror p.is-editor-empty:first-of-type::before': {
    content: 'attr(data-placeholder)',
    color: 'text.muted',
    pointerEvents: 'none',
    float: 'left',
    h: 0,
  },
  '.ProseMirror h2': { fontSize: '2xl', fontWeight: 700, mt: 6, mb: 3, color: 'text.primary' },
  '.ProseMirror h3': { fontSize: 'lg',  fontWeight: 700, mt: 5, mb: 2, color: 'text.primary' },
  '.ProseMirror p':  { mb: 3, lineHeight: 1.7, color: 'gray.700' },
  '.ProseMirror ul': { pl: 5, mb: 3, listStyleType: 'disc' },
  '.ProseMirror ol': { pl: 5, mb: 3, listStyleType: 'decimal' },
  '.ProseMirror li': { mb: 1 },
  '.ProseMirror blockquote': {
    borderLeft: '3px solid',
    borderColor: 'brand.500',
    bg: 'brand.50',
    px: 4, py: 3, my: 4,
    borderRadius: 'md',
    fontStyle: 'italic',
    color: 'gray.700',
  },
  '.ProseMirror figure': { my: 4 },
  '.ProseMirror img':    { borderRadius: 'lg', w: '100%', display: 'block' },
  '.ProseMirror strong': { fontWeight: 700 },
};
