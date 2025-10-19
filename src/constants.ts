import { MediaType, Settings } from './types';

export const ROLL_COVERAGE = 75; // m² per roll

// Calculate cost per m² from roll price
const calculateCostPerSqm = (rollPrice: number) =>
  parseFloat((rollPrice / ROLL_COVERAGE).toFixed(2));

// Calculate ink cost per m² from bottle price and usage
const calculateInkCost = (pricePerBottle: number, usagePerSqm: number) =>
  parseFloat(((pricePerBottle / 500) * usagePerSqm).toFixed(2));

export const DEFAULT_SETTINGS: Settings = {
  listPrice: 220000,
  minimumInvestmentPrice: 195000,
  defaultMonthlyVolume: 150,
  defaultSellingPrice: 190,
  defaultMediaType: 'economy',
  mediaPricing: {
    economy: {
      rollPrice: 1670,
      costPerSqm: calculateCostPerSqm(1670), // 22.27
    },
    standard: {
      rollPrice: 2260,
      costPerSqm: calculateCostPerSqm(2260), // 30.13
    },
    premium: {
      rollPrice: 2850,
      costPerSqm: calculateCostPerSqm(2850), // 38.00
    },
  },
  inkPricing: {
    cmyk: {
      pricePerBottle: 375,
      usagePerSqm: 9,
      usagePercentage: 60,
    },
    structural: {
      pricePerBottle: 460,
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
