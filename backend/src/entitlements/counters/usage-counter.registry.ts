import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { CounterKey } from '../config/counter-keys';
import type { UsageCounter } from './usage-counter.interface';

export const COUNTER_TOKEN = (key: CounterKey): string => `COUNTER:${key}`;

@Injectable()
export class UsageCounterRegistry {
  constructor(private readonly moduleRef: ModuleRef) {}

  get(key: CounterKey): UsageCounter {
    return this.moduleRef.get<UsageCounter>(COUNTER_TOKEN(key), {
      strict: false,
    });
  }
}
