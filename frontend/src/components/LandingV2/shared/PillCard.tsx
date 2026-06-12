import { Tile } from '@/components/ui/Tile';
import { UserIcon, UsersIcon, MapPinIcon } from '@/components/icons';

const ICONS = { pin: MapPinIcon, userIcon: UserIcon, usersIcon: UsersIcon } as const;

type Props = { icon: keyof typeof ICONS; title: string; sub: string };

export function PillCard({ icon, title, sub }: Props) {
  const Icon = ICONS[icon];
  return (
    <Tile
      icon={<Icon size={20} />}
      title={title}
      sub={sub}
      iconBg="accent.primary"
      iconColor="surface.card"
    />
  );
}
