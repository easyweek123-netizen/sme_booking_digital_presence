import { FormControl, FormLabel } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import type { ServiceTypeValue } from '../../../types';
import { serviceTypeRegistry } from '../serviceTypeRegistry';
import { SERVICE_TYPE_TILES } from './tileOptions';
import { Tiles } from './Tiles';

export function ServiceType() {
  const { watch, getValues, reset } = useFormContext();
  const value = watch('type') as ServiceTypeValue;

  const onChange = (next: ServiceTypeValue) => {
    if (next === value) return;
    reset(
      { ...getValues(), ...serviceTypeRegistry[next].defaults, type: next },
      { keepDefaultValues: true },
    );
  };

  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
        Service type
      </FormLabel>
      <Tiles options={SERVICE_TYPE_TILES} 
        value={value} 
        onChange={onChange} 
        columns={2} />
    </FormControl>
  );
}
