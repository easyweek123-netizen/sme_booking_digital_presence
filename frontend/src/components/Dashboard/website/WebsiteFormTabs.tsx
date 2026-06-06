import { BusinessLocationsField } from './BusinessLocationsField';
import { Basic, Availability, About } from './tabs';
import type { WebsiteTabKey } from './websiteTabs';

interface Props {
  activeTab: WebsiteTabKey;
}

export function WebsiteFormTabs({ activeTab }: Props) {
  switch (activeTab) {
    case 'basic':
      return <Basic />;
    case 'location':
      return <BusinessLocationsField />;
    case 'availability':
      return <Availability />;
    case 'about':
      return <About />;
  }
}
