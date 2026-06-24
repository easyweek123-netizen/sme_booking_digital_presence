const valuesOf = <T extends Record<string, string>>(o: T) =>
  Object.values(o) as [T[keyof T], ...T[keyof T][]];

export const GROUP = { WEBSITE: 'website', SERVICE: 'service' } as const;
export type Group = (typeof GROUP)[keyof typeof GROUP];
export const GROUPS = valuesOf(GROUP);