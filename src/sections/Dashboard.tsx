import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, Car, CheckCircle2, Fuel as FuelIcon, Gauge, Pencil, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore, useT } from '@/lib/store';
import { applicableItems, getProfile } from '@/data/carProfiles';
import { avgKmPerDay, computeStatus, docStatus, urgencyRank, type DocStatus } from '@/lib/status';
import { fmtKm } from '@/lib/i18n';
import ItemRow from '@/components/ItemRow';
import ItemDialog from '@/components/ItemDialog';
import type { DocsState, MaintenanceItemDef } from '@/types';

export default function Dashboard({ onGoToMaintenance }: { onGoToMaintenance: () => void }) {
  const { state, updateOdometer, setDoc } = useStore();
  const t = useT();
  const lang = state.lang;

  const [kmOpen, setKmOpen] = useState(false);
  const [kmValue, setKmValue] = useState('');
  const [docEdit, setDocEdit] = useState<keyof DocsState | null>(null);
  const [docValue, setDocValue] = useState('');
  const [selected, setSelected] = useState<MaintenanceItemDef | null>(null);
  const [itemOpen, setItemOpen] = useState(false);

  const data = useMemo(() => {
    if (!state.car) return null;
    const profile = getProfile(state.car.profileId);
    const avg = avgKmPerDay(state.odoLog);
    const items = applicableItems(profile, state.car.fuel).map((def) => ({
      def,
      st: computeStatus(def, state.car!.fuel, state.services[def.id], state.intervalOverrides[def.id], state.odometer, avg),
    }));
    const sorted = [...items].sort((a, b) => urgencyRank(a.st.urgency) - urgencyRank(b.st.urgency) || b.st.pct - a.st.pct);
    return {
      profile,
      avg,
      sorted,
      due: items.filter((i) => i.st.urgency === 'due').length,
      soon: items.filter((i) => i.st.urgency === 'soon').length,
      hasRecords: Object.keys(state.services).length > 0,
    };
  }, [state]);

  if (!state.car || !data) return null;
  const { profile, avg, sorted, due, soon, hasRecords } = data;

  const insurance = docStatus(state.docs.insurance);
  const inspection = docStatus(state.docs.inspection);
  const docsDue = insurance.urgency === 'due' || inspection.urgency === 'due';

  const saveKm = () => {
    const v = parseInt(kmValue.replace(/[\s,]/g, ''));
    if (!isNaN(v) && v >= 0) updateOdometer(v);
    setKmOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[13px] text-slate-500 font-medium">{t('appName')}</p>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {profile.name}
            {state.car.year && <span className="text-sm font-medium text-slate-400">{state.car.year}</span>}
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1.5">
          {state.car.fuel === 'petrol' ? <FuelIcon className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
          {t(state.car.fuel === 'petrol' ? 'ob.petrol' : 'ob.diesel')}
        </span>
      </div>

      {/* odometer card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-5 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-100 text-[13px] font-medium">
            <Gauge className="w-4 h-4" />
            {t('dash.odometer')}
          </div>
          <button
            onClick={() => { setKmValue(String(state.odometer)); setKmOpen(true); }}
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 transition rounded-full px-3.5 py-1.5 text-[13px] font-medium"
          >
            <Pencil className="w-3.5 h-3.5" />
            {t('dash.updateKm')}
          </button>
        </div>
        <p className="mt-2 text-4xl font-bold tracking-tight">{fmtKm(state.odometer, lang)}</p>
        {avg && <p className="mt-1 text-[13px] text-blue-100">{t('dash.perDay', { v: Math.round(avg) })}</p>}
      </div>

      {/* status banner */}
      {due > 0 || docsDue ? (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3.5">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{t('dash.dueCount', { n: due + (docsDue ? 1 : 0) })}</p>
        </div>
      ) : soon > 0 ? (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl px-4 py-3.5">
          <CalendarClock className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{t('dash.soonCount', { n: soon })}</p>
        </div>
      ) : hasRecords ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-4 py-3.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">{t('dash.allGood')}</p>
            <p className="text-[12px] opacity-80">{t('dash.allGoodSub')}</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 text-slate-600 rounded-2xl px-4 py-3.5 text-[13px]">{t('dash.trackHint')}</div>
      )}

      {/* documents */}
      <div>
        <h2 className="text-[15px] font-semibold text-slate-900 px-1 mb-2">{t('dash.documents')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <DocCard
            icon={<ShieldCheck className="w-5 h-5" />}
            label={t('dash.insurance')}
            st={insurance}
            t={t}
            onEdit={() => { setDocEdit('insurance'); setDocValue(state.docs.insurance); }}
          />
          <DocCard
            icon={<ClipboardCheck className="w-5 h-5" />}
            label={t('dash.inspection')}
            st={inspection}
            t={t}
            onEdit={() => { setDocEdit('inspection'); setDocValue(state.docs.inspection); }}
          />
        </div>
      </div>

      {/* attention list */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-[15px] font-semibold text-slate-900">{t('dash.attention')}</h2>
          <button onClick={onGoToMaintenance} className="text-[13px] font-medium text-blue-600">
            {t('dash.viewAll')}
          </button>
        </div>
        <div className="space-y-2.5">
          {sorted.slice(0, 3).map(({ def, st }) => (
            <ItemRow
              key={def.id}
              def={def}
              status={st}
              t={t}
              lang={lang}
              onClick={() => { setSelected(def); setItemOpen(true); }}
            />
          ))}
        </div>
      </div>

      {/* odometer dialog */}
      <Dialog open={kmOpen} onOpenChange={setKmOpen}>
        <DialogContent className="max-w-sm w-[calc(100vw-2rem)] rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle>{t('dash.newKm')}</DialogTitle>
          </DialogHeader>
          <Input
            inputMode="numeric"
            value={kmValue}
            onChange={(e) => setKmValue(e.target.value)}
            className="h-12 rounded-xl text-lg"
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setKmOpen(false)} className="flex-1 h-11 rounded-xl">{t('dash.cancel')}</Button>
            <Button onClick={saveKm} className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700">{t('dash.save')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* doc date dialog */}
      <Dialog open={docEdit !== null} onOpenChange={(o) => !o && setDocEdit(null)}>
        <DialogContent className="max-w-sm w-[calc(100vw-2rem)] rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle>{docEdit === 'insurance' ? t('dash.insurance') : t('dash.inspection')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t('dash.editDate')}</Label>
            <Input type="date" value={docValue} onChange={(e) => setDocValue(e.target.value)} className="h-12 rounded-xl" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDocEdit(null)} className="flex-1 h-11 rounded-xl">{t('dash.cancel')}</Button>
            <Button
              onClick={() => { if (docEdit) setDoc(docEdit, docValue); setDocEdit(null); }}
              className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {t('dash.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ItemDialog def={selected} open={itemOpen} onOpenChange={setItemOpen} />
    </div>
  );
}

function DocCard({
  icon, label, st, t, onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  st: DocStatus;
  t: (key: string, vars?: Record<string, string | number>) => string;
  onEdit: () => void;
}) {
  const styles = {
    none: { text: 'text-slate-400', iconBox: 'bg-slate-100 text-slate-400', border: 'border-slate-200' },
    ok: { text: 'text-emerald-600', iconBox: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
    soon: { text: 'text-amber-600', iconBox: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
    due: { text: 'text-red-600', iconBox: 'bg-red-50 text-red-600', border: 'border-red-200' },
  }[st.urgency];

  const line =
    st.urgency === 'none' ? t('dash.notSet')
    : st.daysLeft === 0 ? t('dash.expiresToday')
    : st.urgency === 'due' ? t('dash.expiredSince', { n: Math.abs(st.daysLeft ?? 0) })
    : t('dash.expiresIn', { n: st.daysLeft ?? 0 });

  return (
    <button onClick={onEdit} className={`text-left rounded-2xl border px-4 py-3.5 bg-white active:scale-[0.98] transition-transform ${styles.border}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${styles.iconBox}`}>{icon}</div>
      <p className="text-[13px] font-medium text-slate-900">{label}</p>
      <p className={`text-[12px] font-medium mt-0.5 ${styles.text}`}>{line}</p>
    </button>
  );
}
