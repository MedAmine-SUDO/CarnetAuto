import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppState, CarState, DocsState, FuelEntry, Lang, ServiceRecord } from '@/types';
import { makeT, todayISO } from './i18n';

const STORAGE_KEY = 'carnet-auto-v1';

const DEFAULT_STATE: AppState = {
  lang: 'fr',
  onboarded: false,
  car: null,
  odometer: 0,
  odoLog: [],
  services: {},
  intervalOverrides: {},
  fuelLog: [],
  docs: { insurance: '', inspection: '' },
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, docs: { ...DEFAULT_STATE.docs, ...(parsed.docs ?? {}) } };
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
  completeOnboarding: (p: OnboardingPayload) => void;
  updateOdometer: (km: number) => void;
  markDone: (itemId: string) => void;
  saveService: (itemId: string, rec: ServiceRecord, interval: { km: number; months: number }) => void;
  saveInterval: (itemId: string, interval: { km: number; months: number }) => void;
  clearService: (itemId: string) => void;
  addFuel: (e: Omit<FuelEntry, 'id'>) => void;
  deleteFuel: (id: string) => void;
  setDoc: (key: keyof DocsState, value: string) => void;
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
  }, [state]);

  const api = useMemo<StoreApi>(() => ({
    state,
    setLang: (lang) => setState((s) => ({ ...s, lang })),

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

    resetAll: () => setState((s) => ({ ...DEFAULT_STATE, lang: s.lang })),
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
