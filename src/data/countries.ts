export type FuelFamily = 'petrol' | 'diesel';

export interface FuelOption {
  value: string;
  family: FuelFamily;
  /** Pump name as written at stations in this country — NOT translated. */
  name: string;
  /** Localized explanation of what this fuel is (i18n key). */
  hintKey: string;
  /** Pump handle color (hex) so users can match the pump at the station. */
  handle: string;
}

export interface Country {
  code: string;
  flag: string;
  nameKey: string;
  fuels: FuelOption[];
}

// handle colors
const GREEN = '#22c55e'; // petrol (standard)
const BLUE = '#3b82f6'; // premium petrol (98 / super)
const YELLOW = '#eab308'; // diesel / mazout
const AMBER = '#d97706'; // premium diesel
const GREY = '#94a3b8'; // LPG / GPL
const BLACK = '#334155'; // US diesel

const f = (value: string, family: FuelFamily, name: string, hintKey: string, handle: string): FuelOption => ({
  value,
  family,
  name,
  hintKey,
  handle,
});

export const COUNTRIES: Country[] = [
  {
    code: 'TN',
    flag: '🇹🇳',
    nameKey: 'country.TN',
    fuels: [
      f('sp95', 'petrol', 'Sans plomb 95', 'fuelHint.standardPetrol', GREEN),
      f('sp98', 'petrol', 'Sans plomb 98', 'fuelHint.premiumPetrol', GREEN),
      f('mazout', 'diesel', 'Mazout', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'DZ',
    flag: '🇩🇿',
    nameKey: 'country.DZ',
    fuels: [
      f('sp95', 'petrol', 'Sans plomb 95', 'fuelHint.standardPetrol', GREEN),
      f('sp98', 'petrol', 'Sans plomb 98', 'fuelHint.premiumPetrol', GREEN),
      f('gasoil', 'diesel', 'Gasoil', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'MA',
    flag: '🇲🇦',
    nameKey: 'country.MA',
    fuels: [
      f('sp95', 'petrol', 'Sans plomb 95', 'fuelHint.standardPetrol', GREEN),
      f('sp98', 'petrol', 'Sans plomb 98', 'fuelHint.premiumPetrol', GREEN),
      f('gazole', 'diesel', 'Gazole', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'LY',
    flag: '🇱🇾',
    nameKey: 'country.LY',
    fuels: [
      f('sp95', 'petrol', 'Essence 95', 'fuelHint.standardPetrol', GREEN),
      f('sp98', 'petrol', 'Essence 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'EG',
    flag: '🇪🇬',
    nameKey: 'country.EG',
    fuels: [
      f('octane80', 'petrol', 'Benzine 80', 'fuelHint.lowOctane', GREEN),
      f('octane92', 'petrol', 'Benzine 92', 'fuelHint.lowOctane', GREEN),
      f('octane95', 'petrol', 'Benzine 95', 'fuelHint.standardPetrol', GREEN),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'FR',
    flag: '🇫🇷',
    nameKey: 'country.FR',
    fuels: [
      f('sp95e5', 'petrol', 'Sans plomb 95-E5', 'fuelHint.standardPetrol', GREEN),
      f('sp95e10', 'petrol', 'Sans plomb 95-E10', 'fuelHint.standardPetrol', GREEN),
      f('sp98', 'petrol', 'Sans plomb 98', 'fuelHint.premiumPetrol', BLUE),
      f('gazoleb7', 'diesel', 'Gazole B7', 'fuelHint.biodiesel', YELLOW),
      f('gazoleb10', 'diesel', 'Gazole B10', 'fuelHint.biodiesel', YELLOW),
      f('gpl', 'petrol', 'GPLc', 'fuelHint.lpg', GREY),
    ],
  },
  {
    code: 'BE',
    flag: '🇧🇪',
    nameKey: 'country.BE',
    fuels: [
      f('sp95e5', 'petrol', 'Sans plomb 95-E5', 'fuelHint.standardPetrol', GREEN),
      f('sp95e10', 'petrol', 'Sans plomb 95-E10', 'fuelHint.standardPetrol', GREEN),
      f('sp98', 'petrol', 'Sans plomb 98', 'fuelHint.premiumPetrol', BLUE),
      f('gazoleb7', 'diesel', 'Gazole B7', 'fuelHint.biodiesel', YELLOW),
      f('gazoleb10', 'diesel', 'Gazole B10', 'fuelHint.biodiesel', YELLOW),
    ],
  },
  {
    code: 'ES',
    flag: '🇪🇸',
    nameKey: 'country.ES',
    fuels: [
      f('gasolina95', 'petrol', 'Gasolina 95', 'fuelHint.standardPetrol', GREEN),
      f('gasolina98', 'petrol', 'Gasolina 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Diésel', 'fuelHint.diesel', YELLOW),
      f('dieselplus', 'diesel', 'Diésel Plus', 'fuelHint.premiumDiesel', AMBER),
      f('gpl', 'petrol', 'GLP', 'fuelHint.lpg', GREY),
    ],
  },
  {
    code: 'IT',
    flag: '🇮🇹',
    nameKey: 'country.IT',
    fuels: [
      f('benzina95', 'petrol', 'Benzina 95', 'fuelHint.standardPetrol', GREEN),
      f('benzina98', 'petrol', 'Benzina 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
      f('gpl', 'petrol', 'GPL', 'fuelHint.lpg', GREY),
    ],
  },
  {
    code: 'DE',
    flag: '🇩🇪',
    nameKey: 'country.DE',
    fuels: [
      f('superE5', 'petrol', 'Super E5', 'fuelHint.standardPetrol', GREEN),
      f('superE10', 'petrol', 'Super E10', 'fuelHint.standardPetrol', GREEN),
      f('superPlus', 'petrol', 'Super Plus (98)', 'fuelHint.premiumPetrol', BLUE),
      f('dieselB7', 'diesel', 'Diesel B7', 'fuelHint.biodiesel', YELLOW),
      f('dieselB10', 'diesel', 'Diesel B10', 'fuelHint.biodiesel', YELLOW),
    ],
  },
  {
    code: 'NL',
    flag: '🇳🇱',
    nameKey: 'country.NL',
    fuels: [
      f('euro95e5', 'petrol', 'Euro 95 (E5)', 'fuelHint.standardPetrol', GREEN),
      f('euro95e10', 'petrol', 'Euro 95 (E10)', 'fuelHint.standardPetrol', GREEN),
      f('euro98', 'petrol', 'Euro 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
      f('premiumDiesel', 'diesel', 'Premium Diesel', 'fuelHint.premiumDiesel', AMBER),
    ],
  },
  {
    code: 'GB',
    flag: '🇬🇧',
    nameKey: 'country.GB',
    fuels: [
      f('unleadedE5', 'petrol', 'Unleaded (E5)', 'fuelHint.standardPetrol', GREEN),
      f('unleadedE10', 'petrol', 'Unleaded (E10)', 'fuelHint.standardPetrol', GREEN),
      f('superUnleaded', 'petrol', 'Super Unleaded', 'fuelHint.premiumPetrol', BLUE),
      f('dieselB7', 'diesel', 'Diesel (B7)', 'fuelHint.biodiesel', YELLOW),
      f('premiumDiesel', 'diesel', 'Premium Diesel', 'fuelHint.premiumDiesel', AMBER),
    ],
  },
  {
    code: 'PT',
    flag: '🇵🇹',
    nameKey: 'country.PT',
    fuels: [
      f('gasolina95', 'petrol', 'Gasolina 95', 'fuelHint.standardPetrol', GREEN),
      f('gasolina98', 'petrol', 'Gasolina 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Gasóleo', 'fuelHint.diesel', YELLOW),
      f('dieselplus', 'diesel', 'Gasóleo Plus', 'fuelHint.premiumDiesel', AMBER),
    ],
  },
  {
    code: 'US',
    flag: '🇺🇸',
    nameKey: 'country.US',
    fuels: [
      f('regular', 'petrol', 'Regular (87)', 'fuelHint.regular', GREEN),
      f('midgrade', 'petrol', 'Mid-Grade (89)', 'fuelHint.midgrade', '#f97316'),
      f('premium', 'petrol', 'Premium (91-93)', 'fuelHint.highOctane', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', BLACK),
    ],
  },
  {
    code: 'CA',
    flag: '🇨🇦',
    nameKey: 'country.CA',
    fuels: [
      f('regular', 'petrol', 'Regular (87)', 'fuelHint.regular', GREEN),
      f('midgrade', 'petrol', 'Mid-Grade (89)', 'fuelHint.midgrade', '#f97316'),
      f('premium', 'petrol', 'Premium (91-93)', 'fuelHint.highOctane', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', BLACK),
    ],
  },
  {
    code: 'SA',
    flag: '🇸🇦',
    nameKey: 'country.SA',
    fuels: [
      f('gulf91', 'petrol', 'Petrol 91', 'fuelHint.lowOctane', GREEN),
      f('gulf95', 'petrol', 'Petrol 95', 'fuelHint.standardPetrol', GREEN),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'AE',
    flag: '🇦🇪',
    nameKey: 'country.AE',
    fuels: [
      f('special95', 'petrol', 'Special 95', 'fuelHint.standardPetrol', GREEN),
      f('super98', 'petrol', 'Super 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'KW',
    flag: '🇰🇼',
    nameKey: 'country.KW',
    fuels: [
      f('premium91', 'petrol', 'Premium 91', 'fuelHint.lowOctane', GREEN),
      f('super98', 'petrol', 'Super 98', 'fuelHint.premiumPetrol', BLUE),
      f('diesel', 'diesel', 'Diesel', 'fuelHint.diesel', YELLOW),
    ],
  },
  {
    code: 'TR',
    flag: '🇹🇷',
    nameKey: 'country.TR',
    fuels: [
      f('benzin95', 'petrol', 'Benzin 95', 'fuelHint.standardPetrol', GREEN),
      f('benzin98', 'petrol', 'Benzin 98', 'fuelHint.premiumPetrol', BLUE),
      f('mazot', 'diesel', 'Mazot', 'fuelHint.diesel', YELLOW),
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
