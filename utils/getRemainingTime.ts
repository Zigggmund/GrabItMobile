export function getRemainingTime(endTime: string): number {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diffMs = end - now;
  if (diffMs <= 0) return 0;
  const diffHours = diffMs / (1000 * 60 * 60);

  // округление
  return Math.ceil(diffHours * 10) / 10;
}