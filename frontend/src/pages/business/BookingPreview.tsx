import { BusinessBookingPage as BusinessBookingPageView } from '../../components/Business/BusinessBookingPage';
import type { BusinessWithServices, ServiceCategory } from '../../types';

interface BookingPreviewProps {
  business: BusinessWithServices;
  categories: ServiceCategory[];
}

export function BookingPreview({ business, categories }: BookingPreviewProps) {
  return (
    <BusinessBookingPageView
      business={business}
      categories={categories}
      serviceVariant="preview"
      onBook={() => {/* preview: no-op */}}
    />
  );
}
