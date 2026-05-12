export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function parseCount(s: string): number {
  const m = s.trim().match(/^([\d.]+)\s*([KMB])?$/i);
  if (!m) return Number(s) || 0;
  const n = parseFloat(m[1]);
  if (Number.isNaN(n)) return 0;
  const suf = m[2]?.toUpperCase();
  const mult = suf === "B" ? 1e9 : suf === "M" ? 1e6 : suf === "K" ? 1e3 : 1;
  return Math.round(n * mult);
}
