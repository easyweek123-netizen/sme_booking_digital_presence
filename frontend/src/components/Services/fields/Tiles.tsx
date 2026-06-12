import { SimpleGrid } from '@chakra-ui/react';
import type { ResponsiveValue } from '@chakra-ui/react';
import { Tile } from '@/components/ui/Tile';
import type { TileOption } from './tileOptions';

interface TilesProps<T extends string> {
  options: readonly TileOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: ResponsiveValue<number>;
}

export function Tiles<T extends string>({ options, value, onChange, columns = 2 }: TilesProps<T>) {
  return (
    <SimpleGrid columns={columns} spacing={3}>
      {options.map(o => (
        <Tile
          key={o.value}
          icon={o.icon}
          title={o.title}
          sub={o.sub}
          active={value === o.value}
          onClick={() => onChange(o.value)}
          iconBg="accent.primary"
          iconColor="surface.card"
        />
      ))}
    </SimpleGrid>
  );
}
