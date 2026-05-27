/** Returns an 18%-alpha rgba string from a #rrggbb hex; falls back to brand soft. */
export function softFromHex(hex: string): string {
  const m = /^#?([a-f\d]{6})$/i.exec(hex);
  if (!m) return 'rgba(46,182,125,0.18)';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, 0.18)`;
}
