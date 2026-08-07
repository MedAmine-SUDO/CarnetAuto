import { ArrowLeft, Check, Globe } from 'lucide-react';
import { useStore, useT } from '@/lib/store';
import { COUNTRIES } from '@/data/countries';

export default function CountrySettings({ onBack }: { onBack: () => void }) {
  const { state, setCountry } = useStore();
  const t = useT();

  return (
    <div className="space-y-4">
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
            <Globe className="w-5 h-5 text-blue-600" />
            {t('country.title')}
          </h1>
        </div>
      </div>

      <p className="text-[13px] text-slate-500 px-1">{t('country.sub')}</p>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
        {COUNTRIES.map((c) => {
          const selected = state.country === c.code;
          return (
            <button
              key={c.code}
              onClick={() => {
                setCountry(c.code);
                onBack();
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left active:bg-slate-50"
            >
              <span className="flex items-center gap-3 text-[15px] font-medium text-slate-900">
                <span className="text-xl">{c.flag}</span>
                {t(c.nameKey)}
              </span>
              {selected && <Check className="w-5 h-5 text-blue-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
