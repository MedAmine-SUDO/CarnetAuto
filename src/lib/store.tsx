import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppState, CarState, DocsState, FuelEntry, Lang, NotificationSettings, ServiceRecord } from '@/types';
import { makeT, todayISO } from './i18n';
import { syncNotifications } from './notifications';
import { defaultFuelForCountry, fuelFamily, isFuelInCountry, DEFAULT_COUNTRY } from '@/data/countries';

const STORAGE_KEY = 'carnet-auto-v1';

const DEFAULT_NOTIFS: NotificationSettings = {
  enabled: false,
  time: '09:00',
  items: {},
  docs: {},
};

const DEFAULT_STATE: AppState = {
  lang: 'fr',
  country: DEFAULT_COUNTRY,
  onboarded: false,
  car: null,
  odometer: 0,
  odoLog: [],
  services: {},
  intervalOverrides: {},
  fuelLog: [],
  docs: { insurance: '', inspection: '' },
  notifications: DEFAULT_NOTIFS,
  vehicleSpecs: {},
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      docs: { ...DEFAULT_STATE.docs, ...(parsed.docs ?? {}) },
      notifications: { ...DEFAULT_NOTIFS, ...(parsed.notifications ?? {}) },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export interface OnboardingPayload {
  car: CarState;
  odometer: number;
  lastOilKm: number | null;
  lastOilDate: string;
  docs: DocsState;
}

interface StoreApi {
  state: AppState;
  setLang: (lang: Lang) => void;
  setCountry: (code: string) => void;
  completeOnboarding: (p: OnboardingPayload) => void;
  updateOdometer: (km: number) => void;
  markDone: (itemId: string) => void;
  saveService: (itemId: string, rec: ServiceRecord, interval: { km: number; months: number }) => void;
  saveInterval: (itemId: string, interval: { km: number; months: number }) => void;
  clearService: (itemId: string) => void;
  addFuel: (e: Omit<FuelEntry, 'id'>) => void;
  deleteFuel: (id: string) => void;
  setDoc: (key: keyof DocsState, value: string) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  setNotifPref: (category: 'items' | 'docs', key: string, pref: NotificationSettings['items'][string]) => void;
  setVehicleSpec: (id: string, value: string) => void;
  resetVehicleSpec: (id: string) => void;
  resetAllSpecs: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — app keeps working in memory
    }
    syncNotifications(state);
  }, [state]);

  const api = useMemo<StoreApi>(() => ({
    state,
    setLang: (lang) => setState((s) => ({ ...s, lang })),

    setCountry: (code) =>
      setState((s) => {
        const vehicleSpecs = { ...s.vehicleSpecs };
        if (vehicleSpecs.fuelType !== undefined && !isFuelInCountry(code, vehicleSpecs.fuelType)) {
          vehicleSpecs.fuelType = defaultFuelForCountry(code, fuelFamily(vehicleSpecs.fuelType));
        }
        return { ...s, country: code, vehicleSpecs };
      }),

    completeOnboarding: (p) =>
      setState((s) => {
        const services: AppState['services'] = {};
        if (p.lastOilKm !== null && p.lastOilDate) {
          services.oil = { date: p.lastOilDate, km: p.lastOilKm };
        }
        return {
          ...s,
          onboarded: true,
          car: p.car,
          odometer: p.odometer,
          odoLog: [{ date: todayISO(), km: p.odometer }],
          services,
          intervalOverrides: {},
          docs: p.docs,
        };
      }),

    updateOdometer: (km) =>
      setState((s) => {
        const odoLog = [...s.odoLog];
        const today = todayISO();
        const last = odoLog[odoLog.length - 1];
        if (last && last.date === today) odoLog[odoLog.length - 1] = { date: today, km };
        else odoLog.push({ date: today, km });
        return { ...s, odometer: km, odoLog };
      }),

    markDone: (itemId) =>
      setState((s) => ({
        ...s,
        services: { ...s.services, [itemId]: { date: todayISO(), km: s.odometer } },
      })),

    saveService: (itemId, rec, interval) =>
      setState((s) => ({
        ...s,
        services: { ...s.services, [itemId]: rec },
        intervalOverrides: { ...s.intervalOverrides, [itemId]: interval },
      })),

    saveInterval: (itemId, interval) =>
      setState((s) => ({
        ...s,
        intervalOverrides: { ...s.intervalOverrides, [itemId]: interval },
      })),

    clearService: (itemId) =>
      setState((s) => {
        const services = { ...s.services };
        delete services[itemId];
        return { ...s, services };
      }),

    addFuel: (e) =>
      setState((s) => {
        const entry: FuelEntry = { ...e, id: Math.random().toString(36).slice(2) + Date.now().toString(36) };
        const fuelLog = [...s.fuelLog, entry].sort((a, b) => a.km - b.km);
        // fill-up doubles as an odometer reading
        let odometer = s.odometer;
        let odoLog = s.odoLog;
        if (e.km > s.odometer) {
          odometer = e.km;
          odoLog = [...s.odoLog, { date: e.date, km: e.km }];
        }
        return { ...s, fuelLog, odometer, odoLog };
      }),

    deleteFuel: (id) => setState((s) => ({ ...s, fuelLog: s.fuelLog.filter((f) => f.id !== id) })),

    setDoc: (key, value) => setState((s) => ({ ...s, docs: { ...s.docs, [key]: value } })),

    setNotifications: (patch) => setState((s) => ({ ...s, notifications: { ...s.notifications, ...patch } })),

    setNotifPref: (category, key, pref) =>
      setState((s) => ({
        ...s,
        notifications: { ...s.notifications, [category]: { ...s.notifications[category], [key]: pref } },
      })),

    setVehicleSpec: (id, value) =>
      setState((s) => {
        const vehicleSpecs = { ...s.vehicleSpecs, [id]: value };
        return { ...s, vehicleSpecs };
      }),

    resetVehicleSpec: (id) =>
      setState((s) => {
        const vehicleSpecs = { ...s.vehicleSpecs };
        delete vehicleSpecs[id];
        return { ...s, vehicleSpecs };
      }),

    resetAllSpecs: () => setState((s) => ({ ...s, vehicleSpecs: {} })),

    resetAll: () => setState((s) => ({ ...DEFAULT_STATE, lang: s.lang, country: s.country })),
  }), [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function useT() {
  const { state } = useStore();
  return useMemo(() => makeT(state.lang), [state.lang]);
}
