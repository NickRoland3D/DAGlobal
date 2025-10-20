export interface MediaType {
  id: 'economy' | 'standard' | 'premium';
  name: string;
  description: string;
  costPerSqm: number;
}

export interface MediaPricing {
  rollPrice: number;
  costPerSqm: number;
}

export interface InkPricing {
  pricePerBottle: number; // price per 500ml
  usagePerSqm: number; // ml per m²
  usagePercentage: number; // percentage for display
}

export interface CurrencySettings {
  code: string;
  symbol: string;
  locale: string;
  useDecimals: boolean;
  decimalPlaces: number;
}

export interface Settings {
  listPrice: number;
  minimumInvestmentPrice: number;
  defaultMonthlyVolume: number;
  defaultSellingPrice: number;
  defaultMediaType: 'economy' | 'standard' | 'premium';
  hasCompletedSetup: boolean;
  currency: CurrencySettings;
  measurementUnit: 'sqm' | 'sqft';
  mediaPricing: {
    economy: MediaPricing;
    standard: MediaPricing;
    premium: MediaPricing;
  };
  inkPricing: {
    cmyk: InkPricing;
    structural: InkPricing;
  };
  rollCoverage: number; // m² per roll (default 75)
}

export interface CalculatorState {
  totalInvestment: number;
  monthlyOutput: number;
  sellingPrice: number;
  selectedMedia: MediaType;
  monthlyOverhead: number;
  inkCost: number;
  isBelowMinimumInvestment: boolean;
}

export interface CalculatedMetrics {
  mediaCost: number;
  inkCost: number;
  totalCostPerSqm: number;
  profitMarginPerSqm: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  paybackPeriod: number;
  breakEvenVolume: number;
  roiData: Array<{
    month: number;
    monthlyProfit: number;
    cumulativeReturn: number;
  }>;
}
