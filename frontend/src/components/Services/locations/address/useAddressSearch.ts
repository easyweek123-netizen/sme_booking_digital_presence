import { useCallback, useEffect, useState } from 'react';
import {
  useSearchAddressQuery,
  useLazyReverseAddressQuery,
} from '../../../../store/api/locationsApi';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import type {
  AddressCandidate,
  AddressInput,
  AddressLocation,
} from '../../../../types/location';

const MIN_SEARCH_LEN = 3;
const SEARCH_DELAY_MS = 400;

interface Params {
  value: AddressInput | null;
  onChange: (next: AddressInput | null) => void;
}

interface Result {
  query: string;
  onQueryChange: (q: string) => void;
  candidates: AddressCandidate[];
  isFetching: boolean;
  onSelectCandidate: (c: AddressCandidate) => void;
  onPinChange: (lat: number, lng: number) => void;
  locate: () => Promise<void>;
  isGeoLoading: boolean;
  geoSupported: boolean;
}

function candidateToInput(c: AddressCandidate): AddressInput {
  return {
    displayName: c.displayName, line1: c.line1, line2: null, city: c.city,
    postalCode: c.postalCode, countryCode: c.countryCode, countryName: c.countryName,
    latitude: c.latitude, longitude: c.longitude,
  };
}

function blankInputAt(latitude: number, longitude: number): AddressInput {
  return {
    displayName: '', line1: '', line2: null, city: '',
    postalCode: null, countryCode: '', countryName: null, latitude, longitude,
  };
}

export function useAddressSearch({ value, onChange }: Params): Result {
  const [localQuery, setLocalQuery] = useState('');
  const query = value?.displayName || localQuery;

  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DELAY_MS);
  const { data: candidates = [], isFetching } = useSearchAddressQuery(debouncedQuery, {
    skip: debouncedQuery.length < MIN_SEARCH_LEN,
  });

  const [triggerReverse] = useLazyReverseAddressQuery();
  const reverse = useCallback(
    async (lat: number, lng: number): Promise<AddressCandidate | null> => {
      try {
        return (await triggerReverse({ lat, lng }).unwrap()) ?? null;
      } catch {
        return null;
      }
    },
    [triggerReverse],
  );

  const geoSupported = 'geolocation' in navigator;
  const [isGeoLoading, setIsGeoLoading] = useState(false);

  const requestPosition = useCallback(
    () =>
      new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
        if (!geoSupported) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000 },
        );
      }),
    [geoSupported],
  );

  const locate = useCallback(async () => {
    setIsGeoLoading(true);
    try {
      const coords = await requestPosition();
      if (!coords) return;
      const found = await reverse(coords.latitude, coords.longitude);
      if (found) {
        onChange(candidateToInput(found));
        setLocalQuery('');
      } else {
        onChange(blankInputAt(coords.latitude, coords.longitude));
      }
    } finally {
      setIsGeoLoading(false);
    }
  }, [requestPosition, reverse, onChange]);

  // Auto-locate exactly once when the picker mounts with no address set.
  // Empty deps captures the initial `value`/`locate`; subsequent value
  // changes never re-trigger. Sticky form state means a remount after
  // tab-switching already sees `value != null` and skips.
  useEffect(() => {
    if (!value && geoSupported) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryChange = useCallback(
    (q: string) => {
      setLocalQuery(q);
      if (value) onChange(null);
    },
    [value, onChange],
  );

  const onSelectCandidate = useCallback(
    (c: AddressCandidate) => {
      setLocalQuery('');
      onChange(candidateToInput(c));
    },
    [onChange],
  );

  const onPinChange = useCallback(
    async (lat: number, lng: number) => {
      const found = await reverse(lat, lng);
      if (found) {
        onChange(candidateToInput(found));
        setLocalQuery('');
      } else {
        onChange(value ? { ...value, latitude: lat, longitude: lng } : blankInputAt(lat, lng));
      }
    },
    [value, onChange, reverse],
  );

  return {
    query, onQueryChange,
    candidates, isFetching,
    onSelectCandidate,
    onPinChange,
    locate,
    isGeoLoading, geoSupported,
  };
}

export type { AddressLocation };
