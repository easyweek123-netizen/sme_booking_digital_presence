import { createStandaloneToast } from '@chakra-ui/react';
import { theme } from '../theme';

// Standalone toast instance — works outside React component tree (e.g., in RTK Query baseQuery).
// Created once here and imported wherever needed outside components.
export const { toast } = createStandaloneToast({ theme });
