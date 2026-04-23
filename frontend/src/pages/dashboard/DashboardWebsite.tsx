import { useBusiness } from '../../contexts/useBusiness';
import { DashboardWebsiteForm } from './DashboardWebsiteForm';

export function DashboardWebsite() {
  const business = useBusiness();
  return <DashboardWebsiteForm key={business.id} business={business} />;
}
