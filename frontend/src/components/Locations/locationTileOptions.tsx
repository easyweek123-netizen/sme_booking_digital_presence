import { LOCATION_TYPES, type LocationType } from '@bookeasy/shared';
import { LOCATION_TYPE_PRESENTATION } from './locationDisplay';
import type { TileOption } from '../Services/fields/tileOptions';

export const LOCATION_TYPE_TILE_OPTIONS: readonly TileOption<LocationType>[] =
  LOCATION_TYPES.map((type) => {
    const { typeLabel, description, Icon } = LOCATION_TYPE_PRESENTATION[type];
    return { value: type, title: typeLabel, sub: description, icon: <Icon size={20} /> };
  });
