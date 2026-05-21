import { Controller, useFormContext } from 'react-hook-form';
import { useGetMyBusinessQuery } from '../../../store/api/businessApi';
import {
  useGetServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
} from '../../../store/api/serviceCategoriesApi';
import { CategorySelect } from '../../ui/form';

interface ServiceCategoryProps {
  name?: string;
  label?: string;
}

export function ServiceCategory({
  name = 'categoryId',
  label = 'Category',
}: ServiceCategoryProps) {
  const { control } = useFormContext();
  const { data: business } = useGetMyBusinessQuery();
  const { data: categories = [], isLoading } = useGetServiceCategoriesQuery(
    business?.id ?? 0,
    { skip: !business?.id },
  );
  const [createCategory, { isLoading: isCreating }] = useCreateServiceCategoryMutation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <CategorySelect
          value={(field.value as number | null) ?? null}
          onChange={(id) => field.onChange(id)}
          onBlur={field.onBlur}
          categories={categories}
          isLoading={isLoading}
          label={label}
          labelHint="Categories appear on your booking page"
          errorMessage={fieldState.error?.message}
          allowCreate
          isCreating={isCreating}
          onCreate={async (categoryName) => {
            try {
              return await createCategory({ name: categoryName }).unwrap();
            } catch {
              return undefined;
            }
          }}
        />
      )}
    />
  );
}
