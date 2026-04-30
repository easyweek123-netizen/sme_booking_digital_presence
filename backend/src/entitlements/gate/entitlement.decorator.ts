import { SetMetadata } from '@nestjs/common';
import type { Request } from 'express';
import type { EntitlementKey } from '../config/entitlements.config';

export const ENTITLEMENT_KEY = 'entitlement';

export type EntitlementMeta = {
  key: EntitlementKey;
  /** Optional request predicate. Gate is skipped when this returns false. */
  when?: (req: Request) => boolean;
};

export const Entitlement = (
  key: EntitlementKey,
  opts: { when?: EntitlementMeta['when'] } = {},
): MethodDecorator => SetMetadata(ENTITLEMENT_KEY, { key, when: opts.when });
