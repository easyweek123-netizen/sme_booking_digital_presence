import { Box } from '@chakra-ui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import { aboutEditorExtensions } from '../../Dashboard/website/about/aboutEditorExtensions';
import { aboutProseStyles } from '../../Dashboard/website/about/aboutProseStyles';

interface Props { html: string; }

/**
 * Read-only renderer for business.aboutContent.
 * Shares the editor's schema → schema-cleans anything the user couldn't have produced
 * in the editor (defense alongside backend sanitize). No dangerouslySetInnerHTML.
 */
export function AboutContent({ html = '' }: Props) {
  const editor = useEditor({
    extensions: aboutEditorExtensions(),
    content: html,
    editable: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== html) 
        editor.commands.setContent(html, false);
  }, [editor, html]);

  return (
    <Box sx={aboutProseStyles}>
      <EditorContent editor={editor} />
    </Box>
  );
}
