import { useState } from 'react';
import { ArrowLeft, ChevronRight, ClipboardList, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, useT } from '@/lib/store';
import { getProfile } from '@/data/carProfiles';
import { fuelOptionsForCountry } from '@/data/countries';
import { SPEC_DEFS, specDef, currentSpec, recommendedSpec, type SpecCategory } from '@/data/specs';
import { fmtKm } from '@/lib/i18n';

export default function VehicleSpecs({ onBack }: { onBack: () => void }) {
  const { state, setVehicleSpec, resetVehicleSpec, resetAllSpecs } = useStore();
  const t = useT();

  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!state.car) return null;
  const profile = getProfile(state.car.profileId);
  const fuel = state.car.fuel;
  const country = state.country;
  const overrides = state.vehicleSpecs;
  const fuelOptions = fuelOptionsForCountry(country);

  const categories: SpecCategory[] = ['fuel', 'engine', 'fluids', 'tires', 'general'];

  const optionsFor = (
    id: string,
  ): { value: string; labelKey?: string; name?: string; hintKey?: string }[] =>
    id === 'fuelType' ? fuelOptions : (specDef(id)?.options ?? []);

  const displayValue = (id: string, value: string) => {
    const def = specDef(id);
    if (def?.type === 'choice') {
      const opt = optionsFor(id)?.find((o) => o.value === value);
      return opt ? (opt.name ?? t(opt.labelKey ?? '')) : value || t('spec.notSet');
    }
    return value || t('spec.notSet');
  };

  const openEdit = (id: string) => {
    const cur = currentSpec(id, profile.id, fuel, country, overrides);
    setEditing(id);
    setEditValue(cur.value);
  };

  const saveEdit = () => {
    if (editing) setVehicleSpec(editing, editValue.trim());
    setEditing(null);
  };

  const editingDef = editing ? specDef(editing) : undefined;

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
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            {t('spec.title')}
          </h1>
          <p className="text-[12px] text-slate-500">
            {profile.name} · {t(state.car.fuel === 'petrol' ? 'ob.petrol' : 'ob.diesel')} · {fmtKm(state.odometer, state.lang)}
          </p>
        </div>
      </div>

      <p className="text-[13px] text-slate-500 px-1">{t('spec.sub')}</p>

      {/* reset all */}
      {Object.keys(overrides).length > 0 && (
        <button
          onClick={resetAllSpecs}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-red-200 text-red-600 text-[14px] font-medium bg-red-50/50"
        >
          <RotateCcw className="w-4 h-4" />
          {t('spec.resetAll')}
        </button>
      )}

      {categories.map((cat) => {
        const defs = SPEC_DEFS.filter(
          (d) => d.category === cat && (fuel === 'petrol' ? !d.dieselOnly : !d.petrolOnly),
        );
        return (
          <div key={cat} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <p className="px-4 pt-3.5 pb-1 font-semibold text-[15px] text-slate-900">{t(`spec.category.${cat}`)}</p>
            <div className="divide-y divide-slate-100">
              {defs.map((def) => {
                const cur = currentSpec(def.id, profile.id, fuel, country, overrides);
                return (
                  <button
                    key={def.id}
                    onClick={() => openEdit(def.id)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left active:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] text-slate-500">{t(`spec.${def.id}`)}</p>
                      <p className="text-[15px] font-semibold text-slate-900 truncate">
                        {displayValue(def.id, cur.value)}
                        {cur.custom && (
                          <span className="ml-2 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 align-middle">
                            {t('spec.custom')}
                          </span>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        {editingDef && (
          <DialogContent className="max-w-sm w-[calc(100vw-2rem)] rounded-2xl p-5">
            <DialogHeader>
              <DialogTitle>{t(`spec.${editingDef.id}`)}</DialogTitle>
            </DialogHeader>

            {editingDef.type === 'choice' && editingDef.id === 'fuelType' ? (
              <div className="space-y-2">
                {optionsFor(editingDef.id)?.map((opt) => {
                  const selected = editValue === opt.value;
                  const rec = recommendedSpec(editingDef.id, profile.id, fuel, country);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setEditValue(opt.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                        selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-[15px] font-semibold ${selected ? 'text-white' : 'text-slate-900'}`}>
                          {opt.name}
                        </span>
                        {opt.value === rec && (
                          <span
                            className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                              selected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            {t('spec.recommended')}
                          </span>
                        )}
                      </span>
                      <span className={`block text-[12px] mt-0.5 ${selected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {t(opt.hintKey ?? '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : editingDef.type === 'choice' ? (
              <div className="grid grid-cols-3 gap-2">
                {optionsFor(editingDef.id)?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setEditValue(opt.value)}
                    className={`h-11 rounded-xl text-[13px] font-medium border transition-colors ${
                      editValue === opt.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {t(opt.labelKey ?? '')}
                  </button>
                ))}
              </div>
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-12 rounded-xl text-[16px]"
                placeholder={t('spec.notSet')}
                autoFocus
              />
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(null)} className="flex-1 h-11 rounded-xl">
                {t('spec.cancel')}
              </Button>
              <Button
                onClick={() => {
                  if (editing) resetVehicleSpec(editing);
                  setEditing(null);
                }}
                className="h-11 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button onClick={saveEdit} className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700">
                {t('spec.save')}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
