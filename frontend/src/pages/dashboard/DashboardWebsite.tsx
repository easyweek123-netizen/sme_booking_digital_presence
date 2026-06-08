import { Spinner, Center } from '@chakra-ui/react';
import { useBusiness } from '../../contexts/useBusiness';
import { useGetScheduleQuery } from '../../store/api/schedulesApi';
import { WebsiteFormContainer } from '../../components/Dashboard/website';

interface DashboardWebsiteProps {
  isDesktop?: boolean;
}

export function DashboardWebsite({ isDesktop }: DashboardWebsiteProps) {
  const business = useBusiness();
  const { data: schedule, isLoading } = useGetScheduleQuery(business.defaultScheduleId);

  if (isLoading || !schedule) {
    return (
      <Center py={12}>
        <Spinner size="sm" color="brand.500" />
      </Center>
    );
  }

  return (
    <WebsiteFormContainer
      key={business.id}
      business={business}
      initialAvailability={schedule.availability ?? []}
      isDesktop={isDesktop}
    />
  );
}
