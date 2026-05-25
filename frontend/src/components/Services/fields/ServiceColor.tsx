import { Controller, useFormContext } from 'react-hook-form';
import { ColorField } from '../../ui/form';
import { SERVICE_COLOR_PRESETS } from '../../../constants';

interface ServiceColorProps {
  name?: string;
  label?: string;
}

export function ServiceColor({
  name = 'color',
  label = 'Color',
}: ServiceColorProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ColorField
          label={label}
          value={field.value as string | null}
          onChange={(c) => field.onChange(c)}
          presets={[...SERVICE_COLOR_PRESETS]}
          showCheckmark
          allowCustom={false}
        />
      )}
    />
  );
}
