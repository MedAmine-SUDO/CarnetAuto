import type { FuelType, MaintenanceItemDef, OdoEntry, ServiceRecord } from '@/types';

export type Urgency = 'unknown' | 'ok' | 'soon' | 'due';

export interface ItemStatus {
  urgency: Urgency;
  pct: number; // 0..1 usage fraction (most consumed axis), may exceed 1
  effKm: number;
  effMonths: number;
  remainingKm: number | null;
  remainingDays: number | null;
  overdueByKm: boolean;
  overdueByTime: boolean;
  estDate: Date | null;
}

const DAY_MS = 86400000;
const MONTH_DAYS = 30.44;

export function effectiveInterval(
  def: MaintenanceItemDef,
  fuel: FuelType,
  override?: { km: number; months: number },
): { km: number; months: number } {
  const base = {
    km: fuel === 'diesel' ? def.dieselKm ?? def.intervalKm : def.intervalKm,
    months: fuel === 'diesel' ? def.dieselMonths ?? def.intervalMonths : def.intervalMonths,
  };
  return { km: override?.km ?? base.km, months: override?.months ?? base.months };
}

/** Average km per day from odometer history; null when not enough data. */
export function avgKmPerDay(odoLog: OdoEntry[]): number | null {
  if (odoLog.length < 2) return null;
  const sorted = [...odoLog].sort((a, b) => a.km - b.km);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const days = (new Date(last.date).getTime() - new Date(first.date).getTime()) / DAY_MS;
  const km = last.km - first.km;
  if (days < 5 || km <= 0) return null;
  const perDay = km / days;
  if (perDay < 1 || perDay > 300) return null; // implausible, ignore
  return perDay;
}

export function computeStatus(
  def: MaintenanceItemDef,
  fuel: FuelType,
  record: ServiceRecord | undefined,
  override: { km: number; months: number } | undefined,
  odometer: number,
  avgPerDay: number | null,
  now = new Date(),
): ItemStatus {
  const { km: effKm, months: effMonths } = effectiveInterval(def, fuel, override);

  if (!record) {
    return {
      urgency: 'unknown', pct: 0, effKm, effMonths,
      remainingKm: null, remainingDays: null,
      overdueByKm: false, overdueByTime: false, estDate: null,
    };
  }

  const kmUsed = Math.max(0, odometer - record.km);
  const daysUsed = Math.max(0, (now.getTime() - new Date(record.date + 'T00:00:00').getTime()) / DAY_MS);

  const pctKm = effKm > 0 ? kmUsed / effKm : -Infinity;
  const pctT = effMonths > 0 ? daysUsed / (effMonths * MONTH_DAYS) : -Infinity;
  const pct = Math.max(pctKm, pctT, 0);

  const remainingKm = effKm > 0 ? effKm - kmUsed : null;
  const remainingDays = effMonths > 0 ? Math.round(effMonths * MONTH_DAYS - daysUsed) : null;

  const overdueByKm = remainingKm !== null && remainingKm <= 0;
  const overdueByTime = remainingDays !== null && remainingDays <= 0;

  // estimated date: earlier of (record date + interval months) and (today + remainingKm / avgPerDay)
  let estDate: Date | null = null;
  const candidates: Date[] = [];
  if (effMonths > 0) {
    const d = new Date(record.date + 'T00:00:00');
    d.setMonth(d.getMonth() + effMonths);
    candidates.push(d);
  }
  if (remainingKm !== null && remainingKm > 0 && avgPerDay) {
    candidates.push(new Date(now.getTime() + (remainingKm / avgPerDay) * DAY_MS));
  } else if (remainingKm !== null && remainingKm <= 0) {
    candidates.push(now);
  }
  if (candidates.length) estDate = new Date(Math.min(...candidates.map((d) => d.getTime())));

  const urgency: Urgency = pct >= 1 ? 'due' : pct >= 0.8 ? 'soon' : 'ok';

  return { urgency, pct, effKm, effMonths, remainingKm, remainingDays, overdueByKm, overdueByTime, estDate };
}

export function urgencyRank(u: Urgency): number {
  return u === 'due' ? 0 : u === 'soon' ? 1 : u === 'unknown' ? 2 : 3;
}

export interface DocStatus {
  urgency: 'none' | 'ok' | 'soon' | 'due';
  daysLeft: number | null;
}

export function docStatus(iso: string, warnDays = 30, now = new Date()): DocStatus {
  if (!iso) return { urgency: 'none', daysLeft: null };
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return { urgency: 'none', daysLeft: null };
  const daysLeft = Math.ceil((d.getTime() - now.getTime()) / DAY_MS);
  if (daysLeft < 0) return { urgency: 'due', daysLeft };
  if (daysLeft <= warnDays) return { urgency: 'soon', daysLeft };
  return { urgency: 'ok', daysLeft };
}
