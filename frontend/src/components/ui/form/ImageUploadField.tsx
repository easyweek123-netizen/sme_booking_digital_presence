import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
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
   * Drives both preview shape and grid layout.
   *   - aspectRatio <= 1  → compact square preview (boxSize 24, 'auto' column)
   *   - aspectRatio  > 1  → wide preview ('2fr' column, default 16/9)
   * Defaults to 16/9.
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
  const isCompact = aspectRatio <= 1;
  const previewSpan = isCompact ? 'auto' : '2fr';

  return (
    <FormControl>
      <VStack align="stretch" spacing="space.stack.xs">
        <FormLabel fontSize="sm" fontWeight="600" color="text.primary" m={0}>
          {label}
        </FormLabel>

        <HiddenInput field={field} />

        <Grid templateColumns={`${previewSpan} 1fr`} gap={4} alignItems="center">
          <Preview
            field={field}
            aspectRatio={aspectRatio}
            aria-label={`Upload ${label}`}
            {...(isCompact ? { boxSize: 24, flexShrink: 0 } : { w: 'full', minW: 0 })}
          />
          <VStack align="flex-start" spacing={2} justify="center" pt={1}>
            <UploadButton field={field} />
            {allowUrlPaste && <UrlPaste field={field} placeholder={urlPlaceholder} />}
          </VStack>
        </Grid>

        <Status field={field} />

        {helperText && (
          <FormHelperText fontSize="xs" color="text.muted">
            {helperText}
          </FormHelperText>
        )}
      </VStack>
    </FormControl>
  );
}
