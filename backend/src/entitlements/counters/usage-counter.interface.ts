export interface UsageCounter {
  count(ctx: { ownerId: number; businessId: number }): Promise<number>;
}
