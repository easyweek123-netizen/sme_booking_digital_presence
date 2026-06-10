import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

export const ABOUT_PLACEHOLDER = 'Click to add a paragraph, heading, image or quote here';

/**
 * Single source of truth for the About editor schema.
 * Used by AboutEditor (editable) and AboutContent (read-only render).
 * Anything not registered here is stripped by ProseMirror on setContent.
 */
export function aboutEditorExtensions({ withPlaceholder = false }: { withPlaceholder?: boolean } = {}) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      // StarterKit ships paragraph, bold, italic, bulletList, orderedList,
      // listItem, blockquote, history. That covers the toolbar minus U + Image.
      // 'link' is intentionally omitted — not in the toolbar this phase.
    }),
    Underline,
    Image.configure({ inline: false, allowBase64: false }),
    ...(withPlaceholder ? [Placeholder.configure({ placeholder: ABOUT_PLACEHOLDER })] : []),
  ];
}
