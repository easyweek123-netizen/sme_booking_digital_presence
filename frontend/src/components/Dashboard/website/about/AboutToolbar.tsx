import { HStack, Button, Divider, Spinner, Box } from '@chakra-ui/react';
import type { Editor } from '@tiptap/react';
import type { ChangeEvent, ReactNode } from 'react';
import { IMAGE_ACCEPT } from '../../../../lib/useImageUpload';

interface Props {
  editor: Editor | null;
  onPickImage: (file: File) => void;
  uploading: boolean;
}

interface ToolbarBtn {
  key: string;
  label: string;
  child: ReactNode;
  isActive: boolean;
  onMouseDown: () => void;
}

export function AboutToolbar({ editor, onPickImage, uploading }: Props) {
  if (!editor) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPickImage(file);
    // Reset the input value so the same file can be picked twice in a row.
    e.target.value = '';
  };

  const markButtons: ToolbarBtn[][] = [
    [
      { key: 'h2', label: 'Heading 2', child: 'H2',
        isActive: editor.isActive('heading', { level: 2 }),
        onMouseDown: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
      { key: 'h3', label: 'Heading 3', child: 'H3',
        isActive: editor.isActive('heading', { level: 3 }),
        onMouseDown: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    ],
    [
      { key: 'b', label: 'Bold',      child: <b>B</b>,
        isActive: editor.isActive('bold'),
        onMouseDown: () => editor.chain().focus().toggleBold().run() },
      { key: 'i', label: 'Italic',    child: <i>I</i>,
        isActive: editor.isActive('italic'),
        onMouseDown: () => editor.chain().focus().toggleItalic().run() },
      { key: 'u', label: 'Underline', child: <u>U</u>,
        isActive: editor.isActive('underline'),
        onMouseDown: () => editor.chain().focus().toggleUnderline().run() },
    ],
    [
      { key: 'quote', label: 'Quote', child: 'Quote',
        isActive: editor.isActive('blockquote'),
        onMouseDown: () => editor.chain().focus().toggleBlockquote().run() },
      // 'Image' rendered separately below — it's a label, not a button.
      { key: 'list', label: 'Bulleted list', child: 'List',
        isActive: editor.isActive('bulletList'),
        onMouseDown: () => editor.chain().focus().toggleBulletList().run() },
    ],
  ];

  return (
    <HStack
      px={3} py={2}
      borderBottom="1px solid"
      borderColor="border.subtle"
      bg="surface.card"
      spacing={1}
      flexWrap="wrap"
    >
      {markButtons.map((group, gi) => (
        <HStack key={gi} spacing={1}>
          {gi > 0 && <Divider orientation="vertical" h={5} mx={2} />}
          {group.map((b) => (
            <Button
              key={b.key}
              size="sm"
              variant="ghost"
              aria-label={b.label}
              aria-pressed={b.isActive}
              bg={b.isActive ? 'brand.50' : 'transparent'}
              color={b.isActive ? 'brand.700' : 'text.primary'}
              fontWeight={600}
              px={2}
              // onMouseDown prevents the editor from losing selection before the command runs.
              onMouseDown={(e) => { e.preventDefault(); b.onMouseDown(); }}
            >
              {b.child}
            </Button>
          ))}
          {gi === 2 && (
            // Image picker — label drives the hidden input, no ref needed.
            <Button
              as="label"
              htmlFor="about-editor-image-input"
              size="sm"
              variant="ghost"
              fontWeight={600}
              px={2}
              cursor={uploading ? 'wait' : 'pointer'}
              aria-label="Insert image"
            >
              {uploading ? <Spinner size="xs" /> : 'Image'}
            </Button>
          )}
        </HStack>
      ))}
      <Box
        as="input"
        id="about-editor-image-input"
        type="file"
        accept={IMAGE_ACCEPT}
        display="none"
        onChange={handleFileChange}
      />
    </HStack>
  );
}
