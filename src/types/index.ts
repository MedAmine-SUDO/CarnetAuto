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

export interface AppState {
  lang: Lang;
  onboarded: boolean;
  car: CarState | null;
  odometer: number;
  odoLog: OdoEntry[];
  services: Record<string, ServiceRecord>;
  intervalOverrides: Record<string, { km: number; months: number }>;
  fuelLog: FuelEntry[];
  docs: DocsState;
}
