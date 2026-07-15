import type { StageTrafficLight } from '@/domain/entities/Order';

/**
 * Divides the average window into three equal bands:
 * - green  → first third of the average time
 * - yellow → second third
 * - red    → last third and beyond (overdue)
 */
export function getStageTrafficLight(
  statusChangedAt: string | undefined,
  averageMinutes: number | undefined,
  nowMs: number = Date.now(),
): StageTrafficLight | null {
  if (!averageMinutes || averageMinutes <= 0 || !statusChangedAt) {
    return null;
  }

  const startedAt = new Date(statusChangedAt).getTime();
  if (Number.isNaN(startedAt)) {
    return null;
  }

  const elapsedMinutes = (nowMs - startedAt) / 60_000;
  const ratio = elapsedMinutes / averageMinutes;

  if (ratio < 1 / 3) {
    return 'green';
  }

  if (ratio < 2 / 3) {
    return 'yellow';
  }

  return 'red';
}

export function getElapsedMinutes(
  statusChangedAt: string | undefined,
  nowMs: number = Date.now(),
): number | null {
  if (!statusChangedAt) {
    return null;
  }

  const startedAt = new Date(statusChangedAt).getTime();
  if (Number.isNaN(startedAt)) {
    return null;
  }

  return Math.max(0, (nowMs - startedAt) / 60_000);
}

export function formatMinutesLabel(minutes: number): string {
  if (minutes < 1) {
    return `${Math.max(0, Math.round(minutes * 60))}s`;
  }

  if (minutes < 60) {
    const whole = Math.floor(minutes);
    const secs = Math.round((minutes - whole) * 60);
    return secs > 0 ? `${whole}m ${secs}s` : `${whole} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
