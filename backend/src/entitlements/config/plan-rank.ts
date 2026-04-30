import { Plan } from '../../billing/types/enums';

const ORDER: Plan[] = [Plan.FREE, Plan.PRO, Plan.GROWTH];

export function rank(plan: Plan): number {
  return ORDER.indexOf(plan);
}
