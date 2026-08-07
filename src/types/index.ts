export type Lang = 'fr' | 'en';
export type FuelType = 'petrol' | 'diesel';

export interface MaintenanceItemDef {
  id: string;
  intervalKm: number;       // 0 = not tracked by km
  intervalMonths: number;   // 0 = not tracked by time
  dieselKm?: number;        // overrides for diesel engines
  dieselMonths?: number;
  petrolOnly?: boolean;
  dieselOnly?: boolean;
  critical?: boolean;
}

export interface CarProfile {
  id: string;
  name: string;
  years: string;
  timingChain: boolean;     // true = timing chain (no periodic belt replacement)
  items: MaintenanceItemDef[];
  specs: Record<string, string>;  // recommended vehicle specs (non fuel-dependent)
}

export interface ServiceRecord {
  date: string;             // ISO yyyy-mm-dd
  km: number;
}

export interface OdoEntry {
  date: string;
  km: number;
}

export interface FuelEntry {
  id: string;
  date: string;
  km: number;
  liters: number;
  price: number | null;     // total paid, optional
}

export interface CarState {
  profileId: string;
  fuel: FuelType;
  year: string;
}

export interface DocsState {
  insurance: string;        // ISO date or ''
  inspection: string;       // visite technique
}

export type NotifLeadId = '1h' | '1d' | '3d' | '1w' | '2w' | '1m';

export interface NotifLeadOption {
  id: NotifLeadId;
  days: number;
}

export const NOTIF_LEAD_OPTIONS: NotifLeadOption[] = [
  { id: '1h', days: 1 / 24 },
  { id: '1d', days: 1 },
  { id: '3d', days: 3 },
  { id: '1w', days: 7 },
  { id: '2w', days: 14 },
  { id: '1m', days: 30 },
];

export function leadDays(id: NotifLeadId): number {
  return NOTIF_LEAD_OPTIONS.find((o) => o.id === id)?.days ?? 0;
}

export interface NotifPref {
  enabled: boolean;
  leads: NotifLeadId[];       // which reminders, e.g. 1 month AND 1 week AND 1 day before
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;               // "HH:MM" time of day
  items: Record<string, NotifPref>;   // key = maintenance item id
  docs: Record<string, NotifPref>;    // key = 'insurance' | 'inspection'
}

export interface AppState {
  lang: Lang;
  country: string;            // ISO country code — drives fuel naming
  onboarded: boolean;
  car: CarState | null;
  odometer: number;
  odoLog: OdoEntry[];
  services: Record<string, ServiceRecord>;
  intervalOverrides: Record<string, { km: number; months: number }>;
  fuelLog: FuelEntry[];
  docs: DocsState;
  notifications: NotificationSettings;
  vehicleSpecs: Record<string, string>;  // user overrides for vehicle specs
}
