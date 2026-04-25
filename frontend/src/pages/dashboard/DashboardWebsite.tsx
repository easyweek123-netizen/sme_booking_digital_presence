import { useBusiness } from '../../contexts/useBusiness';
import { DashboardWebsiteForm } from './DashboardWebsiteForm';

interface DashboardWebsiteProps {
  /** Set by canvas preview (`CanvasPreview`); when set, layout follows preview width instead of viewport. */
  isDesktop?: boolean;
}

export function DashboardWebsite({ isDesktop }: DashboardWebsiteProps) {
  const business = useBusiness();
  return (
    <DashboardWebsiteForm key={business.id} business={business} isDesktop={isDesktop} />
  );
}
