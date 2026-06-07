import { VStack } from '@chakra-ui/react';
import { DashboardSectionCard } from '../../DashboardSectionCard';
import { RecurringHoursEditor, DateSpecificHoursEditor } from '../../../Availability';
import { PageVisibilitySection } from '../PageVisibilitySection';

export function Availability() {
  return (
    <VStack align="stretch" spacing={4}>
      <PageVisibilitySection />
      <DashboardSectionCard>
        <VStack align="stretch" spacing={6}>
          <RecurringHoursEditor
            name="availability"
            title="Weekly hours"
            description="Set when you are typically available."
            layout="day-grouped"
            showCopyToDays
          />
          <DateSpecificHoursEditor
            name="availability"
            title="One-off hours"
            description="Adjust hours for specific dates."
            addLabel="Hours"
            allowClosedToggle
          />
        </VStack>
      </DashboardSectionCard>
    </VStack>
  );
}
