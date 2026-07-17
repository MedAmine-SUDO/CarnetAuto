import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore, useT } from '@/lib/store';
import { computeStatus, effectiveInterval } from '@/lib/status';
import { fmtDate, fmtKm, todayISO } from '@/lib/i18n';
import { ITEM_ICONS, statusLine } from './itemShared';
import type { MaintenanceItemDef } from '@/types';
import { Cog } from 'lucide-react';

interface Props {
  def: MaintenanceItemDef | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ItemDialog({ def, open, onOpenChange }: Props) {
  const { state, saveService, saveInterval, clearService } = useStore();
  const t = useT();
  const lang = state.lang;

  const [date, setDate] = useState('');
  const [km, setKm] = useState('');
  const [intKm, setIntKm] = useState('');
  const [intMo, setIntMo] = useState('');

  useEffect(() => {
    if (!def || !open || !state.car) return;
    const rec = state.services[def.id];
    const eff = effectiveInterval(def, state.car.fuel, state.intervalOverrides[def.id]);
    setDate(rec?.date ?? '');
    setKm(rec ? String(rec.km) : '');
    setIntKm(String(eff.km));
    setIntMo(String(eff.months));
  }, [def, open, state.car, state.services, state.intervalOverrides]);

  if (!def || !state.car) return null;

  const Icon = ITEM_ICONS[def.id] ?? Cog;
  const rec = state.services[def.id];
  const st = computeStatus(def, state.car.fuel, rec, state.intervalOverrides[def.id], state.odometer, null);

  const intervalKm = Math.max(0, parseInt(intKm) || 0);
  const intervalMo = Math.max(0, parseInt(intMo) || 0);

  const handleSave = () => {
    const kmNum = parseInt(km.replace(/\s/g, ''));
    if (date && !isNaN(kmNum) && kmNum >= 0) {
      saveService(def.id, { date, km: kmNum }, { km: intervalKm, months: intervalMo });
    } else {
      saveInterval(def.id, { km: intervalKm, months: intervalMo });
    }
    onOpenChange(false);
  };

  const handleDone = () => {
    saveService(def.id, { date: todayISO(), km: state.odometer }, { km: intervalKm, months: intervalMo });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-[calc(100vw-2rem)] rounded-2xl p-5 max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg leading-tight">{t(`item.${def.id}`)}</DialogTitle>
          </div>
        </DialogHeader>

        {def.critical && (
          <p className="text-[13px] text-red-600 bg-red-50 rounded-xl px-3 py-2">{t('mt.criticalNote')}</p>
        )}

        <p className="text-sm text-slate-500">
          {rec ? t('mt.last', { d: fmtDate(rec.date, lang), v: fmtKm(rec.km, lang) }) : t('st.never')}
          {' — '}
          <span className="font-medium text-slate-700">{statusLine(st, t, lang)}</span>
        </p>

        <Button onClick={handleDone} className="w-full h-12 rounded-xl text-[15px] bg-blue-600 hover:bg-blue-700">
          {t('mt.markDone', { v: fmtKm(state.odometer, lang) })}
        </Button>

        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">{t('mt.lastDate')}</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">{t('mt.lastKm')}</Label>
              <Input inputMode="numeric" value={km} onChange={(e) => setKm(e.target.value)} placeholder="0" className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">{t('mt.intKm')}</Label>
              <Input inputMode="numeric" value={intKm} onChange={(e) => setIntKm(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">{t('mt.intMo')}</Label>
              <Input inputMode="numeric" value={intMo} onChange={(e) => setIntMo(e.target.value)} className="h-11 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="flex-1 h-11 rounded-xl">
            {t('mt.saveChanges')}
          </Button>
          {rec && (
            <Button
              variant="ghost"
              onClick={() => { clearService(def.id); onOpenChange(false); }}
              className="h-11 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {t('mt.removeRecord')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
