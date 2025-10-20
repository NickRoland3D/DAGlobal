import { useState, useEffect } from 'react';
import { Settings, MediaType, CurrencySettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const STORAGE_KEY = 'dafigma-settings';

// Calculate cost per m² from roll price
const calculateCostPerSqm = (rollPrice: number, rollCoverage: number) =>
  parseFloat((rollPrice / rollCoverage).toFixed(2));

// Calculate ink cost per m² from bottle price and usage
const calculateInkCost = (pricePerBottle: number, usagePerSqm: number) =>
  parseFloat(((pricePerBottle / 500) * usagePerSqm).toFixed(2));

const mergeWithDefaults = (stored: Partial<Settings>): Settings => {
  const hasCompletedSetup =
    stored.hasCompletedSetup !== undefined ? stored.hasCompletedSetup : true;

  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    hasCompletedSetup,
    currency: {
      ...DEFAULT_SETTINGS.currency,
      ...(stored.currency ?? {}),
    },
    measurementUnit: stored.measurementUnit ?? DEFAULT_SETTINGS.measurementUnit,
    mediaPricing: {
      economy: {
        ...DEFAULT_SETTINGS.mediaPricing.economy,
        ...(stored.mediaPricing?.economy ?? {}),
      },
      standard: {
        ...DEFAULT_SETTINGS.mediaPricing.standard,
        ...(stored.mediaPricing?.standard ?? {}),
      },
      premium: {
        ...DEFAULT_SETTINGS.mediaPricing.premium,
        ...(stored.mediaPricing?.premium ?? {}),
      },
    },
    inkPricing: {
      cmyk: {
        ...DEFAULT_SETTINGS.inkPricing.cmyk,
        ...(stored.inkPricing?.cmyk ?? {}),
      },
      structural: {
        ...DEFAULT_SETTINGS.inkPricing.structural,
        ...(stored.inkPricing?.structural ?? {}),
      },
    },
  };
};

export const useSettings = () => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return mergeWithDefaults(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return { ...DEFAULT_SETTINGS };
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

  const updateCurrencySettings = (updates: Partial<CurrencySettings>) => {
    setSettings(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        ...updates,
      },
    }));
  };

  const replaceSettings = (incoming: Partial<Settings>) => {
    setSettings(() => {
      const merged = mergeWithDefaults({
        ...incoming,
        hasCompletedSetup: incoming.hasCompletedSetup !== undefined ? incoming.hasCompletedSetup : true,
      });

      return {
        ...merged,
        mediaPricing: {
          economy: {
            ...merged.mediaPricing.economy,
            costPerSqm: calculateCostPerSqm(merged.mediaPricing.economy.rollPrice, merged.rollCoverage),
          },
          standard: {
            ...merged.mediaPricing.standard,
            costPerSqm: calculateCostPerSqm(merged.mediaPricing.standard.rollPrice, merged.rollCoverage),
          },
          premium: {
            ...merged.mediaPricing.premium,
            costPerSqm: calculateCostPerSqm(merged.mediaPricing.premium.rollPrice, merged.rollCoverage),
          },
        },
      };
    });
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
    setSettings({ ...DEFAULT_SETTINGS });
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
    updateCurrencySettings,
    replaceSettings,
    updateMediaRollPrice,
    updateInkPricing,
    resetSettings,
    getMediaTypes,
    getTotalInkCost,
  };
};
