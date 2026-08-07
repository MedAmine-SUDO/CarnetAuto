import { ArrowLeft, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useStore, useT } from '@/lib/store';
import { getProfile } from '@/data/carProfiles';
import { NOTIF_LEAD_OPTIONS, type NotifLeadId, type NotifPref } from '@/types';
import { ensurePermission, isNative } from '@/lib/notifications';

export default function NotificationSettings({ onBack }: { onBack: () => void }) {
  const { state, setNotifications, setNotifPref } = useStore();
  const t = useT();
  const notif = state.notifications;

  if (!state.car) return null;
  const profile = getProfile(state.car.profileId);

  const prefFor = (category: 'items' | 'docs', key: string): NotifPref =>
    notif[category][key] ?? { enabled: false, leads: [] };

  const togglePref = (category: 'items' | 'docs', key: string, enabled: boolean) => {
    const cur = prefFor(category, key);
    setNotifPref(category, key, { ...cur, enabled, leads: enabled && cur.leads.length === 0 ? ['1w'] : cur.leads });
  };

  const toggleLead = (category: 'items' | 'docs', key: string, leadId: NotifLeadId) => {
    const cur = prefFor(category, key);
    const leads = cur.leads.includes(leadId)
      ? cur.leads.filter((l) => l !== leadId)
      : [...cur.leads, leadId];
    setNotifPref(category, key, { ...cur, leads });
  };

  const toggleEnabled = async (on: boolean) => {
    if (on && isNative()) {
      const ok = await ensurePermission();
      if (!ok) return;
    }
    setNotifications({ enabled: on });
  };

  const leadChips = (category: 'items' | 'docs', key: string) => {
    const pref = prefFor(category, key);
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {NOTIF_LEAD_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggleLead(category, key, opt.id)}
            className={`h-8 rounded-lg text-[11px] font-medium transition-colors ${
              pref.leads.includes(opt.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t(`notif.lead.${opt.id}`)}
          </button>
        ))}
      </div>
    );
  };

  const prefRow = (category: 'items' | 'docs', key: string, label: string) => {
    const pref = prefFor(category, key);
    return (
      <div className={`rounded-2xl border p-3.5 space-y-2.5 transition-colors ${pref.enabled ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200/80 bg-white'}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] font-medium text-slate-900">{label}</p>
          <Switch checked={pref.enabled} onCheckedChange={(on) => togglePref(category, key, on)} />
        </div>
        {pref.enabled && (
          <>
            <p className="text-[11px] text-slate-500">{t('set.notif.remind')}</p>
            {leadChips(category, key)}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600"
          aria-label={t('ob.back')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          {t('set.notif.title')}
        </h1>
      </div>

      {!isNative() && (
        <p className="text-[12px] text-amber-600 bg-amber-50 rounded-xl px-3 py-2">{t('set.notif.nonative')}</p>
      )}

      {/* master toggle + time */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-[15px] text-slate-900">{t('set.notif.enable')}</p>
            <p className="text-[13px] text-slate-500 mt-0.5">{t('set.notif.sub')}</p>
          </div>
          <Switch checked={notif.enabled} onCheckedChange={toggleEnabled} />
        </div>

        {notif.enabled && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[13px] text-slate-500">{t('set.notif.time')}</p>
            <Input
              type="time"
              value={notif.time}
              onChange={(e) => setNotifications({ time: e.target.value || '09:00' })}
              className="h-12 rounded-xl bg-white text-[16px]"
            />
          </div>
        )}
      </div>

      {notif.enabled && (
        <>
          {/* maintenance items */}
          <div className="space-y-2">
            <p className="font-semibold text-[15px] text-slate-900 px-1">{t('set.notif.maintenance')}</p>
            {profile.items.map((def) => prefRow('items', def.id, t(`item.${def.id}`)))}
          </div>

          {/* documents */}
          <div className="space-y-2">
            <p className="font-semibold text-[15px] text-slate-900 px-1">{t('set.notif.documents')}</p>
            {prefRow('docs', 'insurance', t('dash.insurance'))}
            {prefRow('docs', 'inspection', t('dash.inspection'))}
          </div>

          <p className="text-[12px] text-slate-400 px-1">{t('set.notif.leadHint')}</p>
        </>
      )}
    </div>
  );
}
