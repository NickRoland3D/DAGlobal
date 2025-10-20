import { useState, useMemo, useEffect } from 'react';
import { CalculatorState, CalculatedMetrics, MediaType } from '../types';
import { DEFAULT_VALUES } from '../constants';

interface UseCalculatorProps {
  mediaTypes: MediaType[];
  totalInvestment: number;
  defaultMonthlyOutput: number;
  defaultSellingPrice: number;
  defaultMediaType: 'economy' | 'standard' | 'premium';
  totalInkCost: number;
  minimumInvestment: number;
}

export const useCalculator = ({
  mediaTypes,
  totalInvestment,
  defaultMonthlyOutput,
  defaultSellingPrice,
  defaultMediaType,
  totalInkCost,
  minimumInvestment,
}: UseCalculatorProps) => {
  const [state, setState] = useState<CalculatorState>({
    totalInvestment: totalInvestment,
    monthlyOutput: defaultMonthlyOutput,
    sellingPrice: defaultSellingPrice,
    selectedMedia: mediaTypes.find(m => m.id === defaultMediaType) || mediaTypes[0],
    monthlyOverhead: DEFAULT_VALUES.monthlyOverhead,
    inkCost: totalInkCost,
    isBelowMinimumInvestment: totalInvestment < minimumInvestment,
  });

  // Update state when settings change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      totalInvestment: totalInvestment,
      inkCost: totalInkCost,
      selectedMedia: mediaTypes.find(m => m.id === prev.selectedMedia.id) || mediaTypes[0],
      isBelowMinimumInvestment: totalInvestment < minimumInvestment,
    }));
  }, [mediaTypes, totalInvestment, totalInkCost, minimumInvestment]);

  const metrics = useMemo<CalculatedMetrics>(() => {
    const { monthlyOutput, sellingPrice, selectedMedia, inkCost, monthlyOverhead, totalInvestment } = state;

    // Calculate costs
    const mediaCost = selectedMedia.costPerSqm;
    const totalCostPerSqm = mediaCost + inkCost;
    const profitMarginPerSqm = sellingPrice - totalCostPerSqm;

    // Calculate revenue and profit
    const monthlyRevenue = monthlyOutput * sellingPrice;
    const monthlyCosts = (monthlyOutput * totalCostPerSqm) + monthlyOverhead;
    const monthlyProfit = monthlyRevenue - monthlyCosts;

    // Calculate payback period
    const paybackPeriod = monthlyProfit > 0 ? totalInvestment / monthlyProfit : 0;

    // Calculate break-even volume
    const breakEvenVolume = profitMarginPerSqm > 0
      ? totalInvestment / profitMarginPerSqm
      : 0;

    // Generate ROI data for 24 months
    const roiData = Array.from({ length: 24 }, (_, i) => {
      const month = i + 1;
      const cumulativeReturn = (monthlyProfit * month) - totalInvestment;
      return {
        month,
        monthlyProfit,
        cumulativeReturn,
      };
    });

    return {
      mediaCost,
      inkCost,
      totalCostPerSqm,
      profitMarginPerSqm,
      monthlyRevenue,
      monthlyProfit,
      paybackPeriod,
      breakEvenVolume,
      roiData,
    };
  }, [state]);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setMonthlyOutput = (value: number) => updateState({ monthlyOutput: value });
  const setSellingPrice = (value: number) => updateState({ sellingPrice: value });
  const setSelectedMedia = (media: MediaType) => updateState({ selectedMedia: media });
  const setMonthlyOverhead = (value: number) => updateState({ monthlyOverhead: value });
  const setTotalInvestment = (value: number) => updateState({
    totalInvestment: value,
    isBelowMinimumInvestment: value < minimumInvestment,
  });
  return {
    state,
    metrics,
    setMonthlyOutput,
    setSellingPrice,
    setSelectedMedia,
    setMonthlyOverhead,
    setTotalInvestment,
  };
};
