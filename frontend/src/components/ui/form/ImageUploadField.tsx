import {
  FormControl,
  Text,
  FormLabel,
  HStack,
  VStack,
} from '@chakra-ui/react';
import {
  HiddenInput,
  Preview,
  Status,
  UploadButton,
  UrlPaste,
  useImageField,
} from './imageField';

export interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Firebase Storage subfolder, e.g. 'services' or 'business'. */
  folder: string;
  helperText?: string;
  /**
   * Aspect ratio of the preview. The preview always fills the parent's width
   * at this ratio. The parent decides the actual width by wrapping the field
   * in a Box of the desired size. Defaults to 16/9.
   */
  aspectRatio?: number;
  /** URL paste toggle. Defaults true. */
  allowUrlPaste?: boolean;
  /** Placeholder shown inside the Paste URL input. */
  urlPlaceholder?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  helperText,
  aspectRatio = 16 / 9,
  allowUrlPaste = true,
  urlPlaceholder,
}: ImageUploadFieldProps) {
  const field = useImageField({ value, onChange, folder });

  return (
    <FormControl>
      <VStack align="stretch">
        <FormLabel htmlFor={field.inputId} fontSize="sm" fontWeight="600" color="text.primary" m={0}>
          {label}
        </FormLabel>

        <HiddenInput field={field} />

        <Preview field={field} aspectRatio={aspectRatio} aria-label={`Upload ${label}`} />

        <HStack spacing={2} align="center">
          <UploadButton field={field} />
          {allowUrlPaste && <UrlPaste field={field} placeholder={urlPlaceholder} />}
        </HStack>

        <Status field={field} />

        {helperText && (
          <Text fontSize="xs" color="text.muted">
            {helperText}
          </Text>
        )}
      </VStack>
    </FormControl>
  );
}
