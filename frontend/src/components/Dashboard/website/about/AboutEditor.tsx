import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';
import { useImageUpload } from '../../../../lib/useImageUpload';
import { aboutEditorExtensions } from './aboutEditorExtensions';
import { aboutProseStyles } from './aboutProseStyles';
import { AboutToolbar } from './AboutToolbar';

export function AboutEditor() {
  const { watch, setValue } = useFormContext<WebsiteFormValues>();
  const formValue = watch('about.aboutContent') || '';
  const imageUpload = useImageUpload({ folder: 'business' });

  const editor = useEditor({
    extensions: aboutEditorExtensions({ withPlaceholder: true }),
    content: formValue,
    onUpdate: ({ editor }) => {
      setValue('about.aboutContent', editor.getHTML(), { shouldDirty: true });
    },
  });

  // Re-hydrate on external reset (Discard, business reload). No-op during normal typing
  // because we wrote `formValue` ourselves and getHTML() will already match.
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== formValue) editor.commands.setContent(formValue, false);
  }, [editor, formValue]);

  const handlePickImage = async (file: File) => {
    const url = await imageUpload.upload(file);
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, '') }).run();
  };

  return (
    <Box
      borderRadius="xl"
      border="1px solid"
      borderColor="border.subtle"
      bg="surface.card"
      overflow="hidden"
    >
      <AboutToolbar editor={editor} onPickImage={handlePickImage} uploading={imageUpload.uploading} />
      <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} sx={aboutProseStyles}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
