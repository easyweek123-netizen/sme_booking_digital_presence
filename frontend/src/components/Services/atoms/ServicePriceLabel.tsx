import { Text } from '@chakra-ui/react';
import type { Service } from '../../../types';
import { formatPrice } from '../../Business/utils';

export function ServicePriceLabel({ service }: { service: Service }) {
  const free = service.priceType === 'FREE' || Number(service.price) === 0;
  const quote = service.priceType === 'ON_REQUEST';

  return (
    <Text
      fontWeight={800}
      fontSize="xl"
      color={free ? 'sage.500' : 'inherit'}
      whiteSpace="nowrap"
    >
      {free ? 'Free' : quote ? 'Quote' : formatPrice(service)}
    </Text>
  );
}
