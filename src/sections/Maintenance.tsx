import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { useStore, useT } from '@/lib/store';
import { applicableItems, getProfile } from '@/data/carProfiles';
import { avgKmPerDay, computeStatus, urgencyRank } from '@/lib/status';
import ItemRow from '@/components/ItemRow';
import ItemDialog from '@/components/ItemDialog';
import type { MaintenanceItemDef } from '@/types';

export default function Maintenance() {
  const { state } = useStore();
  const t = useT();
  const [selected, setSelected] = useState<MaintenanceItemDef | null>(null);
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    if (!state.car) return [];
    const profile = getProfile(state.car.profileId);
    const avg = avgKmPerDay(state.odoLog);
    return applicableItems(profile, state.car.fuel)
      .map((def) => ({
        def,
        st: computeStatus(def, state.car!.fuel, state.services[def.id], state.intervalOverrides[def.id], state.odometer, avg),
      }))
      .sort((a, b) => urgencyRank(a.st.urgency) - urgencyRank(b.st.urgency) || b.st.pct - a.st.pct);
  }, [state]);

  if (!state.car) return null;
  const profile = getProfile(state.car.profileId);

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-slate-900 px-1">{t('mt.title')}</h1>

      {profile.timingChain && (
        <div className="flex gap-2.5 items-start bg-blue-50 text-blue-700 rounded-2xl px-4 py-3 text-[13px]">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{t('mt.chainNote')}</p>
        </div>
      )}

      {items.map(({ def, st }) => (
        <ItemRow
          key={def.id}
          def={def}
          status={st}
          t={t}
          lang={state.lang}
          onClick={() => { setSelected(def); setOpen(true); }}
        />
      ))}

      <ItemDialog def={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
