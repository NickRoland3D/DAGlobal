import { useState, useEffect } from 'react';
import { Settings, MediaType } from '../types';
import { DEFAULT_SETTINGS, ROLL_COVERAGE } from '../constants';

const STORAGE_KEY = 'dafigma-settings';

// Calculate cost per m² from roll price
const calculateCostPerSqm = (rollPrice: number, rollCoverage: number) =>
  parseFloat((rollPrice / rollCoverage).toFixed(2));

// Calculate ink cost per m² from bottle price and usage
const calculateInkCost = (pricePerBottle: number, usagePerSqm: number) =>
  parseFloat(((pricePerBottle / 500) * usagePerSqm).toFixed(2));

export const useSettings = () => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  // Update a specific setting
  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Update media roll price and recalculate cost per m²
  const updateMediaRollPrice = (
    mediaType: 'economy' | 'standard' | 'premium',
    rollPrice: number
  ) => {
    setSettings(prev => ({
      ...prev,
      mediaPricing: {
        ...prev.mediaPricing,
        [mediaType]: {
          rollPrice,
          costPerSqm: calculateCostPerSqm(rollPrice, prev.rollCoverage),
        },
      },
    }));
  };

  // Update ink pricing
  const updateInkPricing = (
    inkType: 'cmyk' | 'structural',
    updates: Partial<{ pricePerBottle: number; usagePerSqm: number; usagePercentage: number }>
  ) => {
    setSettings(prev => ({
      ...prev,
      inkPricing: {
        ...prev.inkPricing,
        [inkType]: {
          ...prev.inkPricing[inkType],
          ...updates,
        },
      },
    }));
  };

  // Reset to default settings
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Get media types with current pricing
  const getMediaTypes = (): MediaType[] => [
    {
      id: 'economy',
      name: 'Economy',
      description: 'Best Margin',
      costPerSqm: settings.mediaPricing.economy.costPerSqm,
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Balanced',
      costPerSqm: settings.mediaPricing.standard.costPerSqm,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Best Quality',
      costPerSqm: settings.mediaPricing.premium.costPerSqm,
    },
  ];

  // Calculate total ink cost per m²
  const getTotalInkCost = () => {
    const cmykCost = calculateInkCost(
      settings.inkPricing.cmyk.pricePerBottle,
      settings.inkPricing.cmyk.usagePerSqm
    );
    const structuralCost = calculateInkCost(
      settings.inkPricing.structural.pricePerBottle,
      settings.inkPricing.structural.usagePerSqm
    );
    return parseFloat((cmykCost + structuralCost).toFixed(2));
  };

  return {
    settings,
    updateSettings,
    updateMediaRollPrice,
    updateInkPricing,
    resetSettings,
    getMediaTypes,
    getTotalInkCost,
  };
};
