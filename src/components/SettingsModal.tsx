import { useState } from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (updates: Partial<Settings>) => void;
  onUpdateMediaRollPrice: (mediaType: 'economy' | 'standard' | 'premium', rollPrice: number) => void;
  onUpdateInkPricing: (
    inkType: 'cmyk' | 'structural',
    updates: Partial<{ pricePerBottle: number; usagePerSqm: number; usagePercentage: number }>
  ) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onUpdateMediaRollPrice,
  onUpdateInkPricing,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const handleInputChange = (field: keyof Settings, value: number) => {
    onUpdateSettings({ [field]: value });
  };

  const handleMediaRollPriceChange = (
    mediaType: 'economy' | 'standard' | 'premium',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdateMediaRollPrice(mediaType, numValue);
    }
  };

  const handleInkPriceChange = (inkType: 'cmyk' | 'structural', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdateInkPricing(inkType, { pricePerBottle: numValue });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <h2 className="font-black text-2xl text-gray-800">SETTINGS</h2>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Investment Settings */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-base text-gray-600 mb-2">
                List Price (AED)
              </label>
              <input
                type="number"
                value={settings.listPrice || ''}
                onChange={(e) => handleInputChange('listPrice', parseFloat(e.target.value))}
                className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-base text-gray-600 mb-2">
                Minimum Investment Price (AED)
              </label>
              <input
                type="number"
                value={settings.minimumInvestmentPrice || ''}
                onChange={(e) =>
                  handleInputChange('minimumInvestmentPrice', parseFloat(e.target.value))
                }
                className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Default Values */}
          <div>
            <h3 className="font-black text-lg text-gray-600 mb-4">DEFAULT VALUES</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Default Monthly Volume (m²)
                </label>
                <input
                  type="number"
                  value={settings.defaultMonthlyVolume || ''}
                  onChange={(e) =>
                    handleInputChange('defaultMonthlyVolume', parseFloat(e.target.value))
                  }
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Default Selling Price (AED/m²)
                </label>
                <input
                  type="number"
                  value={settings.defaultSellingPrice || ''}
                  onChange={(e) =>
                    handleInputChange('defaultSellingPrice', parseFloat(e.target.value))
                  }
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Default Media Type
                </label>
                <select
                  value={settings.defaultMediaType}
                  onChange={(e) =>
                    onUpdateSettings({
                      defaultMediaType: e.target.value as 'economy' | 'standard' | 'premium',
                    })
                  }
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary bg-white"
                >
                  <option value="economy">Economy</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Media Prices */}
          <div>
            <h3 className="font-black text-lg text-gray-600 mb-4">MEDIA PRICES</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Economy Media (AED per roll)
                </label>
                <input
                  type="number"
                  value={settings.mediaPricing.economy.rollPrice || ''}
                  onChange={(e) => handleMediaRollPriceChange('economy', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {settings.mediaPricing.economy.costPerSqm.toFixed(2)} AED/m²
                </p>
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Standard Media (AED per roll)
                </label>
                <input
                  type="number"
                  value={settings.mediaPricing.standard.rollPrice || ''}
                  onChange={(e) => handleMediaRollPriceChange('standard', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {settings.mediaPricing.standard.costPerSqm.toFixed(2)} AED/m²
                </p>
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Premium Media (AED per roll)
                </label>
                <input
                  type="number"
                  value={settings.mediaPricing.premium.rollPrice || ''}
                  onChange={(e) => handleMediaRollPriceChange('premium', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {settings.mediaPricing.premium.costPerSqm.toFixed(2)} AED/m²
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Ink Prices */}
          <div>
            <h3 className="font-black text-lg text-gray-600 mb-4">INK PRICES</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  CMYK Ink (AED per 500ml)
                </label>
                <input
                  type="number"
                  value={settings.inkPricing.cmyk.pricePerBottle || ''}
                  onChange={(e) => handleInkPriceChange('cmyk', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Usage: {settings.inkPricing.cmyk.usagePerSqm}ml/m² (
                  {settings.inkPricing.cmyk.usagePercentage}%)
                </p>
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Structural Ink (AED per 500ml)
                </label>
                <input
                  type="number"
                  value={settings.inkPricing.structural.pricePerBottle || ''}
                  onChange={(e) => handleInkPriceChange('structural', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Usage: {settings.inkPricing.structural.usagePerSqm}ml/m² (
                  {settings.inkPricing.structural.usagePercentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
