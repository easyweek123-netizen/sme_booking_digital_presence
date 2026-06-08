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
  const { getValues, setValue, watch } = useFormContext<WebsiteFormValues>();
  const imageUpload = useImageUpload({ folder: 'business/about' });

  const editor = useEditor({
    extensions: aboutEditorExtensions({ withPlaceholder: true }),
    content: getValues('about.aboutContent') || '',
    onUpdate: ({ editor }) => {
      setValue('about.aboutContent', editor.getHTML(), { shouldDirty: true });
    },
  });

  // Re-hydrate on external reset (Discard, business reload). Subscribe via
  // watch() so we react to RHF changes without re-rendering on every keystroke.
  useEffect(() => {
    if (!editor) return;
    const sub = watch((values, { name, type }) => {
      if (type === 'change' && name === 'about.aboutContent') return;
      const next = values.about?.aboutContent ?? '';
      if (editor.getHTML() !== next) editor.commands.setContent(next, false);
    });
    return () => sub.unsubscribe();
  }, [editor, watch]);

  const handlePickImage = async (file: File) => {
    const url = await imageUpload.upload(file);
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, '') }).run();
  };

  return (
    <Box borderRadius="xl" border="1px solid" borderColor="border.subtle" bg="surface.card" overflow="hidden">
      <AboutToolbar editor={editor} onPickImage={handlePickImage} uploading={imageUpload.uploading} />
      <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} sx={aboutProseStyles}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
