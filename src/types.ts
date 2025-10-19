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
  pricePerBottle: number; // AED per 500ml
  usagePerSqm: number; // ml per m²
  usagePercentage: number; // percentage for display
}

export interface Settings {
  listPrice: number;
  minimumInvestmentPrice: number;
  defaultMonthlyVolume: number;
  defaultSellingPrice: number;
  defaultMediaType: 'economy' | 'standard' | 'premium';
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
