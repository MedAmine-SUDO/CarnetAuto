import { ChevronRight, Cog } from 'lucide-react';
import type { Lang, MaintenanceItemDef } from '@/types';
import type { ItemStatus } from '@/lib/status';
import { ITEM_ICONS, URGENCY_STYLES, statusLine } from './itemShared';

interface Props {
  def: MaintenanceItemDef;
  status: ItemStatus;
  t: (key: string, vars?: Record<string, string | number>) => string;
  lang: Lang;
  onClick: () => void;
}

export default function ItemRow({ def, status, t, lang, onClick }: Props) {
  const Icon = ITEM_ICONS[def.id] ?? Cog;
  const styles = URGENCY_STYLES[status.urgency];
  const pct = Math.min(1, Math.max(0, status.pct));

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-slate-200/80 px-4 py-3.5 flex items-center gap-3 active:scale-[0.99] transition-transform"
    >
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-[15px] text-slate-900 truncate">{t(`item.${def.id}`)}</p>
          {def.critical && <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-red-600 bg-red-50 rounded-full px-2 py-0.5">!</span>}
        </div>
        <p className={`text-[13px] mt-0.5 ${styles.text}`}>{statusLine(status, t, lang)}</p>
        {status.urgency !== 'unknown' && (
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${Math.max(4, pct * 100)}%` }} />
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
    </button>
  );
}
