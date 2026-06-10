export type WebsiteTabKey = 'basic' | 'location' | 'availability' | 'about';

export interface WebsiteTabSpec {
  key: WebsiteTabKey;
  label: string;
}

export const WEBSITE_TABS: ReadonlyArray<WebsiteTabSpec> = [
  { key: 'basic', label: 'Basic' },
  { key: 'location', label: 'Location' },
  { key: 'availability', label: 'Availability' },
  { key: 'about', label: 'About' },
];
