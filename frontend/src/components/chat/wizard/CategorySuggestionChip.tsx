import { useFormContext, useWatch } from 'react-hook-form';
import { useGetMyBusinessQuery } from '../../../store/api/businessApi';
import {
  useGetServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
} from '../../../store/api/serviceCategoriesApi';
import { SuggestChips } from './SuggestChips';

export function CategorySuggestionChip({
  suggestion,
  name = 'categoryId',
}: {
  suggestion?: string;
  name?: string;
}) {
  const { setValue } = useFormContext();
  const current = useWatch({ name });
  const { data: business } = useGetMyBusinessQuery();
  const { data: categories = [] } = useGetServiceCategoriesQuery(business?.id ?? 0, {
    skip: !business?.id,
  });
  const [createCategory, { isLoading }] = useCreateServiceCategoryMutation();

  const label = suggestion?.trim();
  if (!label || current != null) return null;

  const apply = async () => {
    if (isLoading) return;
    const match = categories.find(
      (c) => c.name.trim().toLowerCase() === label.toLowerCase(),
    );
    const category =
      match ?? (await createCategory({ name: label }).unwrap().catch(() => undefined));
    if (category) setValue(name, category.id, { shouldDirty: true, shouldValidate: true });
  };

  return <SuggestChips chips={[{ label, onClick: () => apply() }]} />;
}
