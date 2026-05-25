import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { PriceTypeValue } from '../../../types';
import { Price } from '../fields/Price';
import { PRICE_TYPE_TILES } from '../fields/tileOptions';
import { Tiles } from '../fields/Tiles';

export function Pricing() {
  const { control, setValue } = useFormContext();
  const priceType = useWatch({ control, name: 'priceType' }) as PriceTypeValue;
  const showPrice = priceType === 'FIXED' || priceType === 'FROM';

  const onChange = (next: PriceTypeValue) => {
    setValue('priceType', next, { shouldDirty: true });
    if (next === 'FREE' || next === 'ON_REQUEST') {
      setValue('price', null, { shouldDirty: true });
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel fontSize="sm" fontWeight="500" color="text.strong">
          Price type
        </FormLabel>
        <Tiles
          options={PRICE_TYPE_TILES}
          value={priceType}
          onChange={onChange}
          columns={{ base: 2, md: 4 }}
        />
    </FormControl>
      {showPrice && (
        <Box mt={4}>
          <Price />
        </Box>
      )}
    </Box>
  );
}
