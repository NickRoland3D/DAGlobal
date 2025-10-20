import { MediaType, Settings } from './types';

export const ROLL_COVERAGE = 75; // m² per roll

// Calculate cost per m² from roll price
const calculateCostPerSqm = (rollPrice: number) =>
  parseFloat((rollPrice / ROLL_COVERAGE).toFixed(2));

// Calculate ink cost per m² from bottle price and usage
const calculateInkCost = (pricePerBottle: number, usagePerSqm: number) =>
  parseFloat(((pricePerBottle / 500) * usagePerSqm).toFixed(2));

export const DEFAULT_SETTINGS: Settings = {
  listPrice: 52995,
  minimumInvestmentPrice: 48900,
  defaultMonthlyVolume: 1000,
  defaultSellingPrice: 45,
  defaultMediaType: 'economy',
  hasCompletedSetup: false,
  currency: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    useDecimals: true,
    decimalPlaces: 2,
  },
  measurementUnit: 'sqft',
  mediaPricing: {
    economy: {
      rollPrice: 435.49,
      costPerSqm: calculateCostPerSqm(435.49),
    },
    standard: {
      rollPrice: 640.81,
      costPerSqm: calculateCostPerSqm(640.81),
    },
    premium: {
      rollPrice: 792.99,
      costPerSqm: calculateCostPerSqm(792.99),
    },
  },
  inkPricing: {
    cmyk: {
      pricePerBottle: 98.95,
      usagePerSqm: 9,
      usagePercentage: 60,
    },
    structural: {
      pricePerBottle: 98.95,
      usagePerSqm: 6,
      usagePercentage: 40,
    },
  },
  rollCoverage: ROLL_COVERAGE,
};

export const MEDIA_TYPES: MediaType[] = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Best Margin',
    costPerSqm: DEFAULT_SETTINGS.mediaPricing.economy.costPerSqm,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced',
    costPerSqm: DEFAULT_SETTINGS.mediaPricing.standard.costPerSqm,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Best Quality',
    costPerSqm: DEFAULT_SETTINGS.mediaPricing.premium.costPerSqm,
  },
];

export const SLIDER_RANGES = {
  monthlyOutput: { min: 50, max: 1000, step: 10 },
  sellingPrice: { min: 100, max: 500, step: 10 },
  monthlyOverhead: { min: 0, max: 50000, step: 1000 },
};

const calculateTotalInkCost = () => {
  const cmykCost = calculateInkCost(
    DEFAULT_SETTINGS.inkPricing.cmyk.pricePerBottle,
    DEFAULT_SETTINGS.inkPricing.cmyk.usagePerSqm
  );
  const structuralCost = calculateInkCost(
    DEFAULT_SETTINGS.inkPricing.structural.pricePerBottle,
    DEFAULT_SETTINGS.inkPricing.structural.usagePerSqm
  );
  return parseFloat((cmykCost + structuralCost).toFixed(2));
};

export const DEFAULT_VALUES = {
  totalInvestment: DEFAULT_SETTINGS.listPrice,
  monthlyOutput: DEFAULT_SETTINGS.defaultMonthlyVolume,
  sellingPrice: DEFAULT_SETTINGS.defaultSellingPrice,
  inkCost: calculateTotalInkCost(),
  monthlyOverhead: 0,
};
