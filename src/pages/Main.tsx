import { LayoutDashboard, Fuel, Settings as SettingsIcon, Wrench } from 'lucide-react';
import { useT } from '@/lib/store';
import { useNav, type Tab } from '@/lib/navigation';
import Dashboard from '@/sections/Dashboard';
import Maintenance from '@/sections/Maintenance';
import FuelSection from '@/sections/Fuel';
import Settings from '@/sections/Settings';

export default function Main() {
  const t = useT();
  const { tab, setTab } = useNav();

  const tabs: { id: Tab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: 'home', icon: LayoutDashboard, label: t('nav.home') },
    { id: 'maintenance', icon: Wrench, label: t('nav.maintenance') },
    { id: 'fuel', icon: Fuel, label: t('nav.fuel') },
    { id: 'settings', icon: SettingsIcon, label: t('nav.settings') },
  ];

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="max-w-md mx-auto px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-28">
        {tab === 'home' && <Dashboard onGoToMaintenance={() => setTab('maintenance')} />}
        {tab === 'maintenance' && <Maintenance />}
        {tab === 'fuel' && <FuelSection />}
        {tab === 'settings' && <Settings />}
      </div>

      {/* bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200">
        <div className="max-w-md mx-auto grid grid-cols-4 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {tabs.map(({ id, icon: Icon, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
