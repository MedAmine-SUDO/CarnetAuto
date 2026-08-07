import { useState } from 'react';
import { ArrowLeft, ArrowRight, Car, Check, Languages, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore, useT } from '@/lib/store';
import { CAR_PROFILES } from '@/data/carProfiles';
import type { FuelType } from '@/types';

export default function Onboarding() {
  const { state, setLang, completeOnboarding } = useStore();
  const t = useT();

  const [step, setStep] = useState(0);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [fuel, setFuel] = useState<FuelType>('petrol');
  const [year, setYear] = useState('');
  const [odometer, setOdometer] = useState('');
  const [lastOilKm, setLastOilKm] = useState('');
  const [lastOilDate, setLastOilDate] = useState('');
  const [insurance, setInsurance] = useState('');
  const [inspection, setInspection] = useState('');
  const [kmError, setKmError] = useState(false);

  const steps = [t('ob.welcome'), t('ob.chooseCar'), t('ob.fuelType'), t('ob.currentKm')];

  const finish = () => {
    const km = parseInt(odometer.replace(/[\s,]/g, ''));
    if (isNaN(km) || km < 0) { setKmError(true); return; }
    const oilKm = lastOilKm ? parseInt(lastOilKm.replace(/[\s,]/g, '')) : NaN;
    completeOnboarding({
      car: { profileId: profileId ?? 'yaris', fuel, year: year.trim() },
      odometer: km,
      lastOilKm: !isNaN(oilKm) && lastOilDate ? oilKm : null,
      lastOilDate,
      docs: { insurance, inspection },
    });
  };

  const next = () => {
    if (step === 3) {
      const km = parseInt(odometer.replace(/[\s,]/g, ''));
      if (isNaN(km) || km < 0) { setKmError(true); return; }
      finish();
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      {/* top bar */}
      <div className="max-w-md w-full mx-auto px-5 pt-[max(1.5rem,env(safe-area-inset-top))] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Wrench className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-slate-900">{t('appName')}</span>
        </div>
        <button
          onClick={() => setLang(state.lang === 'fr' ? 'en' : 'fr')}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5"
        >
          <Languages className="w-3.5 h-3.5" />
          {state.lang === 'fr' ? 'FR' : 'EN'}
        </button>
      </div>

      {/* progress */}
      <div className="max-w-md w-full mx-auto px-5 mt-5 flex gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`} />
        ))}
      </div>

      <div className="flex-1 max-w-md w-full mx-auto px-5 py-6 flex flex-col">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">{steps[step]}</h1>

        {step === 0 && (
          <div className="space-y-5 mt-2">
            <p className="text-[15px] text-slate-600 leading-relaxed">{t('ob.welcomeSub')}</p>
            <div className="bg-blue-50 text-blue-700 rounded-2xl px-4 py-3.5 text-[13px]">{t('ob.supportedSoon')}</div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3 mt-2">
            {CAR_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setProfileId(p.id)}
                className={`w-full flex items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-all active:scale-[0.99] ${
                  profileId === p.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${profileId === p.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Car className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  <p className="text-[13px] text-slate-500">{p.years}</p>
                </div>
                {profileId === p.id && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              {(['petrol', 'diesel'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFuel(f)}
                  className={`h-14 rounded-2xl border-2 text-[15px] font-semibold transition-all active:scale-[0.98] ${
                    fuel === f ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {t(f === 'petrol' ? 'ob.petrol' : 'ob.diesel')}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-slate-500">{t('ob.year')}</Label>
              <Input inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder={t('ob.yearPh')} className="h-12 rounded-xl bg-white" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 mt-2 overflow-y-auto">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-slate-500">{t('ob.currentKm')}</Label>
              <Input
                inputMode="numeric"
                value={odometer}
                onChange={(e) => { setOdometer(e.target.value); setKmError(false); }}
                placeholder={t('ob.currentKmPh')}
                className={`h-12 rounded-xl bg-white text-lg font-semibold ${kmError ? 'border-red-400' : ''}`}
                autoFocus
              />
              {kmError && <p className="text-[12px] text-red-600">{t('ob.kmRequired')}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-slate-500">{t('ob.lastOil')}</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input inputMode="numeric" value={lastOilKm} onChange={(e) => setLastOilKm(e.target.value)} placeholder={t('ob.lastOilKm')} className="h-12 rounded-xl bg-white" />
                <Input type="date" value={lastOilDate} onChange={(e) => setLastOilDate(e.target.value)} className="h-12 rounded-xl bg-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] text-slate-500">{t('ob.docs')}</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">{t('ob.insuranceExp')}</p>
                  <Input type="date" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="h-12 rounded-xl bg-white" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">{t('ob.inspectionExp')}</p>
                  <Input type="date" value={inspection} onChange={(e) => setInspection(e.target.value)} className="h-12 rounded-xl bg-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* nav buttons */}
        <div className="mt-auto pt-6 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="h-13 px-5 rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('ob.back')}
            </Button>
          )}
          <Button
            onClick={next}
            disabled={(step === 1 && !profileId) || (step === 3 && !odometer)}
            className="flex-1 h-13 rounded-2xl text-[15px] bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
          >
            {step === 3 ? t('ob.start') : t('ob.next')}
            {step < 3 && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
