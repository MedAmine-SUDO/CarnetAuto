import { Battery, CircleDot, Cog, Disc, Droplet, Droplets, Filter, Thermometer, Wind, Zap, type LucideIcon } from 'lucide-react';
import type { Lang } from '@/types';
import type { ItemStatus, Urgency } from '@/lib/status';
import { fmtDate, fmtKm } from '@/lib/i18n';

export const ITEM_ICONS: Record<string, LucideIcon> = {
  oil: Droplets,
  airFilter: Wind,
  fuelFilter: Filter,
  sparkPlugs: Zap,
  timingBelt: Cog,
  coolant: Thermometer,
  brakeFluid: Droplet,
  brakePads: Disc,
  tires: CircleDot,
  battery: Battery,
};

export const URGENCY_STYLES: Record<Urgency, { dot: string; text: string; bar: string; iconBg: string }> = {
  due: { dot: 'bg-red-500', text: 'text-red-600', bar: 'bg-red-500', iconBg: 'bg-red-50 text-red-600' },
  soon: { dot: 'bg-amber-400', text: 'text-amber-600', bar: 'bg-amber-400', iconBg: 'bg-amber-50 text-amber-600' },
  unknown: { dot: 'bg-slate-300', text: 'text-slate-500', bar: 'bg-slate-300', iconBg: 'bg-slate-100 text-slate-400' },
  ok: { dot: 'bg-emerald-500', text: 'text-emerald-600', bar: 'bg-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
};

type T = (key: string, vars?: Record<string, string | number>) => string;

export function statusLine(st: ItemStatus, t: T, lang: Lang): string {
  if (st.urgency === 'unknown') return t('st.neverSub');

  const timeText = (days: number, overdue: boolean): string => {
    const abs = Math.abs(days);
    if (abs >= 61) {
      const m = Math.max(1, Math.round(abs / 30.44));
      return overdue ? t('st.overMonths', { m }) : t('st.leftMonths', { m });
    }
    return overdue ? t('st.overDays', { d: abs }) : t('st.leftDays', { d: abs });
  };

  if (st.urgency === 'due') {
    if (st.overdueByKm && st.remainingKm !== null) return t('st.overKm', { v: fmtKm(-st.remainingKm, lang) });
    if (st.remainingDays !== null) return timeText(st.remainingDays, true);
    return t('st.due');
  }

  // ok / soon — primary axis: km when available, else time
  let primary = '';
  if (st.remainingKm !== null && st.remainingKm > 0) primary = t('st.leftKm', { v: fmtKm(st.remainingKm, lang) });
  else if (st.remainingDays !== null) primary = timeText(st.remainingDays, false);

  if (st.estDate && st.remainingKm !== null && st.remainingDays !== null) {
    const iso = st.estDate.toISOString().slice(0, 10);
    return `${primary} · ${t('st.estDate', { d: fmtDate(iso, lang) })}`;
  }
  return primary;
}

export function urgencyLabel(u: Urgency, t: T): string {
  return u === 'due' ? t('st.due') : u === 'soon' ? t('st.soon') : u === 'ok' ? t('st.ok') : t('st.never');
}
