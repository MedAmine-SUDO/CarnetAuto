import { useMemo, useState } from 'react';
import { Fuel as FuelIcon, Trash2, TrendingDown, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore, useT } from '@/lib/store';
import { fmtDate, fmtKm, todayISO } from '@/lib/i18n';

export default function Fuel() {
  const { state, addFuel, deleteFuel } = useStore();
  const t = useT();
  const lang = state.lang;

  const [date, setDate] = useState(todayISO());
  const [km, setKm] = useState('');
  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(false);

  const entries = useMemo(() => [...state.fuelLog].sort((a, b) => b.km - a.km), [state.fuelLog]);

  const stats = useMemo(() => {
    const asc = [...state.fuelLog].sort((a, b) => a.km - b.km);
    const consumptions: number[] = [];
    for (let i = 1; i < asc.length; i++) {
      const d = asc[i].km - asc[i - 1].km;
      if (d > 0) consumptions.push((asc[i].liters / d) * 100);
    }
    const avg = consumptions.length ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length : null;
    const last = consumptions.length ? consumptions[consumptions.length - 1] : null;
    const totalSpent = asc.reduce((sum, e) => sum + (e.price ?? 0), 0);
    return { avg, last, count: asc.length, totalSpent };
  }, [state.fuelLog]);

  const perEntryConsumption = useMemo(() => {
    const asc = [...state.fuelLog].sort((a, b) => a.km - b.km);
    const map = new Map<string, number>();
    for (let i = 1; i < asc.length; i++) {
      const d = asc[i].km - asc[i - 1].km;
      if (d > 0) map.set(asc[i].id, (asc[i].liters / d) * 100);
    }
    return map;
  }, [state.fuelLog]);

  const submit = () => {
    const kmNum = parseInt(km.replace(/[\s,]/g, ''));
    const litersNum = parseFloat(liters.replace(',', '.'));
    const priceNum = price ? parseFloat(price.replace(',', '.')) : null;
    if (isNaN(kmNum) || kmNum < 0 || isNaN(litersNum) || litersNum <= 0 || !date) {
      setError(true);
      return;
    }
    setError(false);
    addFuel({ date, km: kmNum, liters: litersNum, price: priceNum !== null && !isNaN(priceNum) ? priceNum : null });
    setKm('');
    setLiters('');
    setPrice('');
    setDate(todayISO());
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900 px-1">{t('fuel.title')}</h1>

      {/* add form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2">
          <FuelIcon className="w-4 h-4 text-blue-600" />
          {t('fuel.add')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t('fuel.date')}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t('fuel.km')}</Label>
            <Input inputMode="numeric" value={km} onChange={(e) => setKm(e.target.value)} placeholder={String(state.odometer)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t('fuel.liters')}</Label>
            <Input inputMode="decimal" value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="35.5" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">{t('fuel.price')}</Label>
            <Input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="—" className="h-11 rounded-xl" />
          </div>
        </div>
        {error && <p className="text-[13px] text-red-600">{t('fuel.invalid')}</p>}
        <Button onClick={submit} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700">{t('fuel.save')}</Button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label={t('fuel.avg')} value={stats.avg !== null ? stats.avg.toFixed(1) : '—'} unit={t('common.l100')} />
        <StatCard label={t('fuel.last')} value={stats.last !== null ? stats.last.toFixed(1) : '—'} unit={t('common.l100')} />
        <StatCard label={t('fuel.total')} value={String(stats.count)} unit="" />
      </div>

      {stats.totalSpent > 0 && (
        <div className="flex items-center gap-2 text-[13px] text-slate-500 px-1">
          <Wallet className="w-4 h-4" />
          {new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 0 }).format(stats.totalSpent)}
        </div>
      )}

      {/* history */}
      <div>
        <h2 className="text-[15px] font-semibold text-slate-900 px-1 mb-2">{t('fuel.history')}</h2>
        {entries.length === 0 ? (
          <p className="text-[13px] text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl px-4 py-6 text-center">
            {t('fuel.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((e) => {
              const c = perEntryConsumption.get(e.id);
              return (
                <div key={e.id} className="bg-white rounded-2xl border border-slate-200/80 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-slate-900">{fmtDate(e.date, lang)} · {fmtKm(e.km, lang)}</p>
                    <p className="text-[12px] text-slate-500">
                      {e.liters.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB')} L
                      {e.price !== null && ` · ${new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB').format(e.price)}`}
                    </p>
                  </div>
                  {c !== undefined && (
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2.5 py-1">
                      <TrendingDown className="w-3 h-3" />
                      {c.toFixed(1)} {t('common.l100')}
                    </span>
                  )}
                  <button onClick={() => deleteFuel(e.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {entries.length === 1 && <p className="text-[12px] text-slate-400 px-1 mt-2">{t('fuel.needTwo')}</p>}
        {entries.length > 0 && <p className="text-[12px] text-slate-400 px-1 mt-2">{t('fuel.note')}</p>}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 px-3 py-3.5 text-center">
      <p className="text-xl font-bold text-slate-900">
        {value}
        {unit && <span className="text-[11px] font-medium text-slate-400 ml-1">{unit}</span>}
      </p>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}
