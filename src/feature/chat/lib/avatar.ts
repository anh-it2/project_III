const GRADIENTS: Array<[string, string]> = [
  ["#ec4899", "#8b5cf6"],
  ["#1877f2", "#42a5f5"],
  ["#f97316", "#ef4444"],
  ["#10b981", "#059669"],
  ["#f59e0b", "#f97316"],
  ["#8b5cf6", "#6366f1"],
  ["#6366f1", "#3b82f6"],
];

export function pickGradient(seed: string): [string, string] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function gradientStyle(
  seed: string,
  angle = 135,
): { background: string } {
  const [c1, c2] = pickGradient(seed);
  return { background: `linear-gradient(${angle}deg, ${c1}, ${c2})` };
}
