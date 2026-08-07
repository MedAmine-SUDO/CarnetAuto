import type { FuelType } from '@/types';
import { getProfile } from './carProfiles';

export type SpecCategory = 'fuel' | 'engine' | 'fluids' | 'tires' | 'general';

export interface SpecDef {
  id: string;
  category: SpecCategory;
  type: 'choice' | 'text';
  options?: { value: string; labelKey: string }[];
  petrolOnly?: boolean;
  dieselOnly?: boolean;
}

export const SPEC_DEFS: SpecDef[] = [
  {
    id: 'fuelType',
    category: 'fuel',
    type: 'choice',
    options: [
      { value: 'sp95', labelKey: 'spec.fuel.sp95' },
      { value: 'sp95e10', labelKey: 'spec.fuel.sp95e10' },
      { value: 'sp98', labelKey: 'spec.fuel.sp98' },
      { value: 'b7', labelKey: 'spec.fuel.b7' },
      { value: 'b10', labelKey: 'spec.fuel.b10' },
      { value: 'b30', labelKey: 'spec.fuel.b30' },
    ],
  },
  { id: 'engineCode', category: 'engine', type: 'text' },
  { id: 'displacement', category: 'engine', type: 'text' },
  {
    id: 'cylinders',
    category: 'engine',
    type: 'choice',
    options: ['3', '4', '6', '8'].map((v) => ({ value: v, labelKey: `spec.cyl.${v}` })),
  },
  {
    id: 'sparkPlugs',
    category: 'engine',
    type: 'choice',
    petrolOnly: true,
    options: ['4', '6', '8'].map((v) => ({ value: v, labelKey: `spec.cyl.${v}` })),
  },
  {
    id: 'oilGrade',
    category: 'engine',
    type: 'choice',
    options: ['0W-20', '5W-30', '5W-40', '10W-40', '15W-40'].map((v) => ({ value: v, labelKey: `spec.oil.${v}` })),
  },
  { id: 'oilCapacity', category: 'engine', type: 'text' },
  {
    id: 'coolantType',
    category: 'fluids',
    type: 'choice',
    options: ['G11', 'G12', 'G12+', 'G13'].map((v) => ({ value: v, labelKey: `spec.cool.${v}` })),
  },
  {
    id: 'brakeFluid',
    category: 'fluids',
    type: 'choice',
    options: ['DOT 3', 'DOT 4', 'DOT 5.1'].map((v) => ({ value: v, labelKey: `spec.dot.${v.replace(/\s/g, '')}` })),
  },
  { id: 'tireSize', category: 'tires', type: 'text' },
  { id: 'tirePressureFront', category: 'tires', type: 'text' },
  { id: 'tirePressureRear', category: 'tires', type: 'text' },
  { id: 'tankCapacity', category: 'general', type: 'text' },
  { id: 'battery', category: 'general', type: 'text' },
  { id: 'transmission', category: 'general', type: 'text' },
];

export function specDef(id: string): SpecDef | undefined {
  return SPEC_DEFS.find((d) => d.id === id);
}

/** Recommended value for a spec given the car profile and engine type. */
export function recommendedSpec(id: string, profileId: string, fuel: FuelType): string {
  if (id === 'fuelType') return fuel === 'petrol' ? 'sp95e10' : 'b7';
  if (id === 'sparkPlugs') return '4';
  return getProfile(profileId).specs[id] ?? '';
}

/** The value currently shown (user override falls back to recommendation). */
export function currentSpec(
  id: string,
  profileId: string,
  fuel: FuelType,
  overrides: Record<string, string>,
): { value: string; custom: boolean } {
  if (overrides[id] !== undefined) return { value: overrides[id], custom: true };
  return { value: recommendedSpec(id, profileId, fuel), custom: false };
}
