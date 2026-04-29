import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { PageHeader } from '../../../../components/ui/PageHeader';
import { ROUTES } from '../../../../config/routes';

interface CheckoutPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function CheckoutPageShell({
  title,
  description,
  children,
}: CheckoutPageShellProps) {
  return (
    <Box>
      <PageHeader
        title={title}
        description={description}
        backHref={ROUTES.DASHBOARD.SETTINGS_BILLING}
      />
      {children}
    </Box>
  );
}
