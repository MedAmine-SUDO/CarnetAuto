export type FuelFamily = 'petrol' | 'diesel';

export interface FuelOption {
  value: string;
  family: FuelFamily;
  labelKey: string;
}

export interface Country {
  code: string;
  flag: string;
  nameKey: string;
  fuels: FuelOption[];
}

const f = (value: string, family: FuelFamily, labelKey: string): FuelOption => ({ value, family, labelKey });

export const COUNTRIES: Country[] = [
  {
    code: 'TN',
    flag: '🇹🇳',
    nameKey: 'country.TN',
    fuels: [f('sp95', 'petrol', 'fuel.sp95'), f('sp98', 'petrol', 'fuel.sp98'), f('mazout', 'diesel', 'fuel.mazout')],
  },
  {
    code: 'DZ',
    flag: '🇩🇿',
    nameKey: 'country.DZ',
    fuels: [f('sp95', 'petrol', 'fuel.sp95'), f('sp98', 'petrol', 'fuel.sp98'), f('gasoil', 'diesel', 'fuel.gasoil')],
  },
  {
    code: 'MA',
    flag: '🇲🇦',
    nameKey: 'country.MA',
    fuels: [f('sp95', 'petrol', 'fuel.sp95'), f('sp98', 'petrol', 'fuel.sp98'), f('gazole', 'diesel', 'fuel.gazole')],
  },
  {
    code: 'LY',
    flag: '🇱🇾',
    nameKey: 'country.LY',
    fuels: [f('sp95', 'petrol', 'fuel.sp95'), f('sp98', 'petrol', 'fuel.sp98'), f('diesel', 'diesel', 'fuel.diesel')],
  },
  {
    code: 'EG',
    flag: '🇪🇬',
    nameKey: 'country.EG',
    fuels: [
      f('octane80', 'petrol', 'fuel.octane80'),
      f('octane92', 'petrol', 'fuel.octane92'),
      f('octane95', 'petrol', 'fuel.octane95'),
      f('diesel', 'diesel', 'fuel.diesel'),
    ],
  },
  {
    code: 'FR',
    flag: '🇫🇷',
    nameKey: 'country.FR',
    fuels: [
      f('sp95e5', 'petrol', 'fuel.sp95e5'),
      f('sp95e10', 'petrol', 'fuel.sp95e10'),
      f('sp98', 'petrol', 'fuel.sp98'),
      f('gazoleb7', 'diesel', 'fuel.gazoleb7'),
      f('gazoleb10', 'diesel', 'fuel.gazoleb10'),
      f('gpl', 'petrol', 'fuel.gpl'),
    ],
  },
  {
    code: 'BE',
    flag: '🇧🇪',
    nameKey: 'country.BE',
    fuels: [
      f('sp95e5', 'petrol', 'fuel.sp95e5'),
      f('sp95e10', 'petrol', 'fuel.sp95e10'),
      f('sp98', 'petrol', 'fuel.sp98'),
      f('gazoleb7', 'diesel', 'fuel.gazoleb7'),
      f('gazoleb10', 'diesel', 'fuel.gazoleb10'),
    ],
  },
  {
    code: 'ES',
    flag: '🇪🇸',
    nameKey: 'country.ES',
    fuels: [
      f('gasolina95', 'petrol', 'fuel.gasolina95'),
      f('gasolina98', 'petrol', 'fuel.gasolina98'),
      f('diesel', 'diesel', 'fuel.diesel'),
      f('dieselplus', 'diesel', 'fuel.dieselplus'),
      f('gpl', 'petrol', 'fuel.gpl'),
    ],
  },
  {
    code: 'IT',
    flag: '🇮🇹',
    nameKey: 'country.IT',
    fuels: [
      f('benzina95', 'petrol', 'fuel.benzina95'),
      f('benzina98', 'petrol', 'fuel.benzina98'),
      f('diesel', 'diesel', 'fuel.diesel'),
      f('gpl', 'petrol', 'fuel.gpl'),
    ],
  },
  {
    code: 'DE',
    flag: '🇩🇪',
    nameKey: 'country.DE',
    fuels: [
      f('superE5', 'petrol', 'fuel.superE5'),
      f('superE10', 'petrol', 'fuel.superE10'),
      f('superPlus', 'petrol', 'fuel.superPlus'),
      f('dieselB7', 'diesel', 'fuel.dieselB7'),
      f('dieselB10', 'diesel', 'fuel.dieselB10'),
    ],
  },
  {
    code: 'NL',
    flag: '🇳🇱',
    nameKey: 'country.NL',
    fuels: [
      f('euro95e5', 'petrol', 'fuel.euro95e5'),
      f('euro95e10', 'petrol', 'fuel.euro95e10'),
      f('euro98', 'petrol', 'fuel.euro98'),
      f('diesel', 'diesel', 'fuel.diesel'),
      f('premiumDiesel', 'diesel', 'fuel.premiumDiesel'),
    ],
  },
  {
    code: 'GB',
    flag: '🇬🇧',
    nameKey: 'country.GB',
    fuels: [
      f('unleadedE5', 'petrol', 'fuel.unleadedE5'),
      f('unleadedE10', 'petrol', 'fuel.unleadedE10'),
      f('superUnleaded', 'petrol', 'fuel.superUnleaded'),
      f('dieselB7', 'diesel', 'fuel.dieselB7'),
      f('premiumDiesel', 'diesel', 'fuel.premiumDiesel'),
    ],
  },
  {
    code: 'PT',
    flag: '🇵🇹',
    nameKey: 'country.PT',
    fuels: [
      f('gasolina95', 'petrol', 'fuel.gasolina95'),
      f('gasolina98', 'petrol', 'fuel.gasolina98'),
      f('diesel', 'diesel', 'fuel.diesel'),
      f('dieselplus', 'diesel', 'fuel.dieselplus'),
    ],
  },
  {
    code: 'US',
    flag: '🇺🇸',
    nameKey: 'country.US',
    fuels: [
      f('regular', 'petrol', 'fuel.regular'),
      f('midgrade', 'petrol', 'fuel.midgrade'),
      f('premium', 'petrol', 'fuel.premium'),
      f('diesel', 'diesel', 'fuel.diesel'),
    ],
  },
  {
    code: 'CA',
    flag: '🇨🇦',
    nameKey: 'country.CA',
    fuels: [
      f('regular', 'petrol', 'fuel.regular'),
      f('midgrade', 'petrol', 'fuel.midgrade'),
      f('premium', 'petrol', 'fuel.premium'),
      f('diesel', 'diesel', 'fuel.diesel'),
    ],
  },
  {
    code: 'SA',
    flag: '🇸🇦',
    nameKey: 'country.SA',
    fuels: [
      f('gulf91', 'petrol', 'fuel.gulf91'),
      f('gulf95', 'petrol', 'fuel.gulf95'),
      f('diesel', 'diesel', 'fuel.diesel'),
    ],
  },
  {
    code: 'AE',
    flag: '🇦🇪',
    nameKey: 'country.AE',
    fuels: [
      f('special95', 'petrol', 'fuel.special95'),
      f('super98', 'petrol', 'fuel.super98'),
      f('diesel', 'diesel', 'fuel.diesel'),
    ],
  },
  {
    code: 'KW',
    flag: '🇰🇼',
    nameKey: 'country.KW',
    fuels: [
      f('premium91', 'petrol', 'fuel.premium91'),
      f('super98', 'petrol', 'fuel.super98'),
      f('diesel', 'diesel', 'fuel.diesel'),
    ],
  },
  {
    code: 'TR',
    flag: '🇹🇷',
    nameKey: 'country.TR',
    fuels: [
      f('benzin95', 'petrol', 'fuel.benzin95'),
      f('benzin98', 'petrol', 'fuel.benzin98'),
      f('mazot', 'diesel', 'fuel.mazot'),
    ],
  },
];

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));

const fuelFamilyByValue = new Map<string, FuelFamily>();
for (const c of COUNTRIES) for (const fuel of c.fuels) fuelFamilyByValue.set(fuel.value, fuel.family);

export function countryByCode(code: string): Country {
  return byCode.get(code) ?? COUNTRIES[0];
}

export function fuelOptionsForCountry(code: string): FuelOption[] {
  return countryByCode(code).fuels;
}

export function fuelFamily(value: string): FuelFamily {
  return fuelFamilyByValue.get(value) ?? 'petrol';
}

export function isFuelInCountry(code: string, value: string): boolean {
  return fuelOptionsForCountry(code).some((f2) => f2.value === value);
}

/** The default fuel option for a given engine type in a country. */
export function defaultFuelForCountry(code: string, family: FuelFamily): string {
  return (
    fuelOptionsForCountry(code).find((f2) => f2.family === family)?.value ?? (family === 'petrol' ? 'sp95' : 'diesel')
  );
}

export const DEFAULT_COUNTRY = 'TN';
