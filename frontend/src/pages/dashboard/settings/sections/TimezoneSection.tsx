import {
  Box,
  Heading,
  Text,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  useToast,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  useGetMyBusinessQuery,
  useUpdateBusinessMutation,
} from '../../../../store/api/businessApi';
import {
  detectBrowserTimezone,
  formatTimezoneLabel,
  getSupportedTimezones,
} from '../../../../utils/timezones';
import { TOAST_DURATION } from '../../../../constants';

export function TimezoneSection() {
  const { data: business, isLoading } = useGetMyBusinessQuery();
  const [updateBusiness, updateState] = useUpdateBusinessMutation();
  const toast = useToast();

  const allZones = useMemo(() => getSupportedTimezones(), []);
  const browserTz = useMemo(() => detectBrowserTimezone(), []);
  /** When null, the Select follows `business.timezone` from the server. */
  const [localTz, setLocalTz] = useState<string | null>(null);
  const tz = localTz ?? business?.timezone ?? browserTz ?? 'Europe/Vienna';

  const handleSave = async (): Promise<void> => {
    if (!business) return;
    try {
      await updateBusiness({ id: business.id, data: { timezone: tz } }).unwrap();
      setLocalTz(null);
      toast({
        title: 'Timezone updated',
        status: 'success',
        duration: TOAST_DURATION.MEDIUM,
        position: 'top',
      });
    } catch {
      toast({
        title: 'Failed to update timezone',
        status: 'error',
        duration: TOAST_DURATION.MEDIUM,
        position: 'top',
      });
    }
  };

  if (isLoading || !business) return null;

  const dirty = tz !== business.timezone;
  const showSuggestion =
    browserTz && browserTz !== tz && browserTz !== business.timezone;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={5}>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Heading size="sm" mb={1}>
            Timezone
          </Heading>
          <Text color="text.secondary" fontSize="sm">
            All booking times are saved and displayed in this timezone.
          </Text>
        </Box>

        <FormControl>
          <FormLabel fontSize="sm">Business timezone</FormLabel>
          <Select value={tz} onChange={(e) => setLocalTz(e.target.value)}>
            {allZones.map((z) => (
              <option key={z} value={z}>
                {formatTimezoneLabel(z)}
              </option>
            ))}
          </Select>
          {showSuggestion && (
            <FormHelperText>
              Your browser is currently in <b>{browserTz}</b>.{' '}
              <Button variant="link" size="sm" onClick={() => setLocalTz(browserTz)}>
                Use this
              </Button>
            </FormHelperText>
          )}
        </FormControl>

        <HStack justify="flex-end">
          <Button
            colorScheme="brand"
            isDisabled={!dirty}
            isLoading={updateState.isLoading}
            onClick={handleSave}
          >
            Save changes
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
