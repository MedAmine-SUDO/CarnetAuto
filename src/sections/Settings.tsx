import { useState } from 'react';
import { Bell, Car, ChevronRight, ClipboardList, Database, Globe, Info, Languages, Pencil } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, useT } from '@/lib/store';
import { useNav } from '@/lib/navigation';
import { getProfile } from '@/data/carProfiles';
import { countryByCode } from '@/data/countries';
import { fmtKm } from '@/lib/i18n';
import ScanOdometerButton from '@/components/ScanOdometerButton';
import NotificationSettings from './NotificationSettings';
import VehicleSpecs from './VehicleSpecs';
import CountrySettings from './CountrySettings';

export default function Settings() {
  const { state, setLang, updateOdometer, resetAll } = useStore();
  const { settingsScreen, setSettingsScreen } = useNav();
  const t = useT();
  const lang = state.lang;
  const notif = state.notifications;

  const [confirmReset, setConfirmReset] = useState(false);
  const [kmOpen, setKmOpen] = useState(false);
  const [kmValue, setKmValue] = useState('');

  if (settingsScreen === 'notifications')
    return <NotificationSettings onBack={() => setSettingsScreen('main')} />;
  if (settingsScreen === 'specs') return <VehicleSpecs onBack={() => setSettingsScreen('main')} />;
  if (settingsScreen === 'country') return <CountrySettings onBack={() => setSettingsScreen('main')} />;

  if (!state.car) return null;
  const profile = getProfile(state.car.profileId);

  const enabledCount =
    Object.values(notif.items).filter((p) => p.enabled).length +
    Object.values(notif.docs).filter((p) => p.enabled).length;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900 px-1">{t('set.title')}</h1>

      {/* language */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
        <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2 mb-3">
          <Languages className="w-4 h-4 text-blue-600" />
          {t('set.language')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['fr', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`h-11 rounded-xl text-[14px] font-medium border transition-colors ${
                lang === l ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {l === 'fr' ? 'Français' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* country */}
      <button
        onClick={() => setSettingsScreen("country")}
        className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            {t('set.country')}
          </p>
          <p className="text-[13px] text-slate-500 mt-0.5">{t('set.country.sub')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{countryByCode(state.country).flag}</span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </button>

      {/* notifications */}
      <button
        onClick={() => setSettingsScreen("notifications")}
        className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            {t('set.notif.title')}
          </p>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {notif.enabled
              ? enabledCount > 0
                ? `${t('set.notif.configured')} · ${t('set.notif.time')} ${notif.time}`
                : t('set.notif.notConfigured')
              : t('set.notif.notConfigured')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${notif.enabled ? 'bg-green-500' : 'bg-slate-300'}`} />
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </button>

      {/* vehicle specs */}
      <button
        onClick={() => setSettingsScreen("specs")}
        className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            {t('spec.title')}
          </p>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {Object.keys(state.vehicleSpecs).length > 0
              ? `${Object.keys(state.vehicleSpecs).length} ${t('spec.custom').toLowerCase()}`
              : t('spec.recommended')}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </button>

      {/* vehicle */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-600" />
          {t('set.vehicle')}
        </p>
        <div className="text-[14px] text-slate-600 space-y-1">
          <p className="font-medium text-slate-900">
            {profile.name}
            {state.car.year && <span className="text-slate-400 font-normal"> · {state.car.year}</span>}
          </p>
          <p>{t(state.car.fuel === 'petrol' ? 'ob.petrol' : 'ob.diesel')} · {fmtKm(state.odometer, lang)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-xl"
            onClick={() => { setKmValue(String(state.odometer)); setKmOpen(true); }}
          >
            <Pencil className="w-4 h-4 mr-1.5" />
            {t('set.editKm')}
          </Button>
          <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setConfirmReset(true)}>
            {t('set.changeCar')}
          </Button>
        </div>
      </div>

      {/* data */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
        <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          {t('set.data')}
        </p>
        <p className="text-[13px] text-slate-500">{t('set.dataNote')}</p>
        <Button
          variant="ghost"
          className="w-full h-11 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => setConfirmReset(true)}
        >
          {t('set.reset')}
        </Button>
      </div>

      {/* about */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
        <p className="font-semibold text-[15px] text-slate-900 flex items-center gap-2 mb-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          {t('set.about')}
        </p>
        <p className="text-[13px] text-slate-500">{t('set.version')}</p>
      </div>

      {/* reset / change car confirm */}
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="max-w-sm w-[calc(100vw-2rem)] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('set.reset')}</AlertDialogTitle>
            <AlertDialogDescription>{t('set.resetWarn')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t('set.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={resetAll} className="rounded-xl bg-red-600 hover:bg-red-700">
              {t('set.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* odometer dialog */}
      <Dialog open={kmOpen} onOpenChange={setKmOpen}>
        <DialogContent className="max-w-sm w-[calc(100vw-2rem)] rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle>{t('dash.newKm')}</DialogTitle>
          </DialogHeader>
          <Input inputMode="numeric" value={kmValue} onChange={(e) => setKmValue(e.target.value)} className="h-12 rounded-xl text-lg" autoFocus />
          <ScanOdometerButton onDetected={(v) => setKmValue(String(v))} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setKmOpen(false)} className="flex-1 h-11 rounded-xl">{t('dash.cancel')}</Button>
            <Button
              onClick={() => {
                const v = parseInt(kmValue.replace(/[\s,]/g, ''));
                if (!isNaN(v) && v >= 0) updateOdometer(v);
                setKmOpen(false);
              }}
              className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {t('dash.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
