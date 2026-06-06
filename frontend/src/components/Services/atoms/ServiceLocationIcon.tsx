import { PhoneIcon, MapPinIcon, VideoIcon } from '../../icons';
import { LocationType } from '../helpers';

interface Props { locationType: LocationType; size?: number; }

export function ServiceLocationIcon({ locationType, size = 14 }: Props) {
  if (locationType === LocationType.ONLINE)    return <VideoIcon size={size} />;
  if (locationType === LocationType.PHONE)     return <PhoneIcon size={size} />;
  if (locationType === LocationType.IN_PERSON) return <MapPinIcon size={size} />;
  return null;
}
