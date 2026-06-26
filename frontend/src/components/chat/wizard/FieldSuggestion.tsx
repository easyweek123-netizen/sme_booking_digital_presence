import { useFormContext, useWatch } from 'react-hook-form';
import { SuggestChips } from './SuggestChips';

const MAX_LABEL = 64;

// Strip tags/entities so HTML (about) and plain text share one preview/blank check.
function plain(raw: string): string {
  return raw.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function isBlank(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return plain(value) === '';
  return false;
}

export function FieldSuggestion({
  name,
  value,
  format,
}: {
  name: string;
  value?: string;
  format?: (raw: string) => unknown;
}) {
  const { setValue } = useFormContext();
  const current = useWatch({ name });

  if (!value || !isBlank(current)) return null;

  const text = plain(value);
  const label = text.length > MAX_LABEL ? `${text.slice(0, MAX_LABEL)}…` : text;
  const apply = () =>
    setValue(name, format ? format(value) : value, {
      shouldDirty: true,
      shouldValidate: true,
    });

  return <SuggestChips chips={[{ label, onClick: apply }]} />;
}
