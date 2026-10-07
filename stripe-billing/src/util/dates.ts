const DAY_MS = 86_400_000;

export function fromUnix(seconds: number): Date {
  return new Date(seconds * 1000);
}

export function daysUntil(date: Date, now: Date = new Date()): number {
  return Math.ceil((date.getTime() - now.getTime()) / DAY_MS);
}
