import { Capacitor } from '@capacitor/core';
import { LocalNotifications, type Schedule } from '@capacitor/local-notifications';
import type { AppState, NotifLeadId, NotifPref } from '@/types';
import { getProfile } from '@/data/carProfiles';
import { avgKmPerDay, computeStatus } from './status';
import { makeT } from './i18n';

const DAY_MS = 86400000;
const NOTIF_ID_BASE = 1000;

export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export async function ensurePermission(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted';
  } catch {
    return false;
  }
}

function leadDays(id: NotifLeadId): number {
  switch (id) {
    case '1h': return 1 / 24;
    case '1d': return 1;
    case '3d': return 3;
    case '1w': return 7;
    case '2w': return 14;
    case '1m': return 30;
  }
}

interface DueInfo {
  id: string;
  category: 'item' | 'doc';
  title: string;
  dueDate: Date;
  pref: NotifPref;
}

/** Collect everything the user asked to be reminded about, with its due date. */
export function buildDueInfo(state: AppState): DueInfo[] {
  const t = makeT(state.lang);
  const notif = state.notifications;
  if (!notif.enabled || !state.car) return [];

  const out: DueInfo[] = [];
  const avg = avgKmPerDay(state.odoLog);
  const profile = getProfile(state.car.profileId);

  if (profile) {
    for (const def of profile.items) {
      const pref = notif.items[def.id];
      if (!pref?.enabled) continue;
      const st = computeStatus(
        def,
        state.car.fuel,
        state.services[def.id],
        state.intervalOverrides[def.id],
        state.odometer,
        avg,
      );
      if (!st.estDate) continue; // not tracked yet, no due date
      out.push({ id: def.id, category: 'item', title: t(`item.${def.id}`), dueDate: st.estDate, pref });
    }
  }

  const docs: { key: 'insurance' | 'inspection' }[] = [{ key: 'insurance' }, { key: 'inspection' }];
  for (const { key } of docs) {
    const pref = notif.docs[key];
    const iso = state.docs[key];
    if (!pref?.enabled || !iso) continue;
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) continue;
    out.push({ id: key, category: 'doc', title: t(key === 'insurance' ? 'dash.insurance' : 'dash.inspection'), dueDate: d, pref });
  }

  return out;
}

interface Entry {
  id: number;
  title: string;
  body: string;
  schedule: Schedule;
}

/** Build every scheduled notification for the current state. */
function buildEntries(state: AppState): Entry[] {
  const t = makeT(state.lang);
  const due = buildDueInfo(state);
  const [hour, minute] = state.notifications.time.split(':').map((n) => parseInt(n, 10) || 0);
  const now = new Date();
  const entries: Entry[] = [];
  let n = 0;

  for (const info of due) {
    const overdue = info.dueDate.getTime() < now.getTime() - DAY_MS;

    if (overdue) {
      // keep reminding every day until the task is done
      const days = Math.round((now.getTime() - info.dueDate.getTime()) / DAY_MS);
      const body = info.category === 'doc'
        ? t('notif.docOverdue', { d: days })
        : t('notif.itemOver', { d: days });
      entries.push({
        id: NOTIF_ID_BASE + n++,
        title: info.title,
        body,
        schedule: { on: { hour, minute }, every: 'day', count: 365 },
      });
      continue;
    }

    for (const leadId of info.pref.leads) {
      const fireTime = new Date(info.dueDate.getTime() - leadDays(leadId) * DAY_MS);
      fireTime.setHours(hour, minute, 0, 0);

      // if the lead window has already started, fire at the next occurrence of the chosen time
      if (fireTime.getTime() <= now.getTime()) {
        const next = new Date(now);
        next.setHours(hour, minute, 0, 0);
        if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
        fireTime.setTime(next.getTime());
      }

      const days = Math.round((info.dueDate.getTime() - fireTime.getTime()) / DAY_MS);
      const body = info.category === 'doc'
        ? t('notif.docLeft', { d: days })
        : t('notif.itemLeft', { d: days });

      entries.push({ id: NOTIF_ID_BASE + n++, title: info.title, body, schedule: { at: fireTime } });
    }
  }

  return entries;
}

/** Cancel everything and re-schedule from the current state. Call on every state change. */
export async function syncNotifications(state: AppState): Promise<void> {
  if (!isNative()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: NOTIF_ID_BASE }] });
  } catch {
    // nothing pending
  }

  if (!state.notifications.enabled) return;

  const entries = buildEntries(state);
  if (entries.length === 0) return;

  const perm = await ensurePermission();
  if (!perm) return;

  try {
    await LocalNotifications.schedule({ notifications: entries });
  } catch {
    // scheduling failed — ignore
  }
}
