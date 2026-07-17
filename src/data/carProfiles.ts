import type { CarProfile } from '@/types';

// Maintenance interval templates per car model.
// Values are sensible defaults (manufacturer-style recommendations);
// the user can edit every interval in the app.
export const CAR_PROFILES: CarProfile[] = [
  {
    id: 'yaris',
    name: 'Toyota Yaris',
    years: '1999+',
    timingChain: true, // 1.0 / 1.3 / 1.5 VVT-i & D-4D use a timing chain
    items: [
      { id: 'oil', intervalKm: 15000, intervalMonths: 12, dieselKm: 10000 },
      { id: 'airFilter', intervalKm: 40000, intervalMonths: 24, dieselKm: 30000 },
      { id: 'sparkPlugs', intervalKm: 60000, intervalMonths: 48, petrolOnly: true },
      { id: 'fuelFilter', intervalKm: 30000, intervalMonths: 24, dieselOnly: true },
      { id: 'coolant', intervalKm: 100000, intervalMonths: 60 },
      { id: 'brakeFluid', intervalKm: 0, intervalMonths: 24 },
      { id: 'brakePads', intervalKm: 30000, intervalMonths: 24 },
      { id: 'tires', intervalKm: 40000, intervalMonths: 48 },
      { id: 'battery', intervalKm: 0, intervalMonths: 48 },
    ],
  },
  {
    id: 'p106',
    name: 'Peugeot 106',
    years: '1991–2003',
    timingChain: false, // belt-driven — critical to replace on time
    items: [
      { id: 'oil', intervalKm: 10000, intervalMonths: 12 },
      { id: 'airFilter', intervalKm: 30000, intervalMonths: 24 },
      { id: 'sparkPlugs', intervalKm: 30000, intervalMonths: 24, petrolOnly: true },
      { id: 'fuelFilter', intervalKm: 40000, intervalMonths: 48, dieselKm: 20000, dieselMonths: 24 },
      { id: 'timingBelt', intervalKm: 120000, intervalMonths: 60, critical: true },
      { id: 'coolant', intervalKm: 60000, intervalMonths: 48 },
      { id: 'brakeFluid', intervalKm: 0, intervalMonths: 24 },
      { id: 'brakePads', intervalKm: 30000, intervalMonths: 24 },
      { id: 'tires', intervalKm: 40000, intervalMonths: 48 },
      { id: 'battery', intervalKm: 0, intervalMonths: 48 },
    ],
  },
];

export function getProfile(id: string): CarProfile {
  return CAR_PROFILES.find((p) => p.id === id) ?? CAR_PROFILES[0];
}

export function applicableItems(profile: CarProfile, fuel: 'petrol' | 'diesel') {
  return profile.items.filter((i) => (fuel === 'petrol' ? !i.dieselOnly : !i.petrolOnly));
}
