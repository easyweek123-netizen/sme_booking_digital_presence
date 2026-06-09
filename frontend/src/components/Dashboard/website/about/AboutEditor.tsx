import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import type { WebsiteFormValues } from '../../../../pages/dashboard/websiteForm.types';
import { useImageUpload } from '../../../../lib/useImageUpload';
import { aboutEditorExtensions } from './aboutEditorExtensions';
import { aboutProseStyles } from './aboutProseStyles';
import { AboutToolbar } from './AboutToolbar';

export function AboutEditor() {
  const { control, getValues, setValue } = useFormContext<WebsiteFormValues>();
  const aboutContent = useWatch({ control, name: 'about.aboutContent' }) ?? '';
  const imageUpload = useImageUpload({ folder: 'business/about' });

  const editor = useEditor({
    extensions: aboutEditorExtensions({ withPlaceholder: true }),
    content: getValues('about.aboutContent') || '',
    onUpdate: ({ editor }) => {
      setValue('about.aboutContent', editor.getHTML(), { shouldDirty: true });
    },
  });

  // Re-hydrate the editor whenever the form's value for this field diverges
  // from the editor's current HTML. The guard avoids the round-trip on the
  // user's own typing (editor → setValue → useWatch fires with the same HTML).
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== aboutContent) {
      editor.commands.setContent(aboutContent, false);
    }
  }, [editor, aboutContent]);

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
