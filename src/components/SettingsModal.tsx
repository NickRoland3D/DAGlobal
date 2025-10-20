import { useEffect, useRef, useState } from 'react';
import { Settings, CurrencySettings } from '../types';
import { formatCurrency } from '../utils/format';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (updates: Partial<Settings>) => void;
  onUpdateCurrency: (updates: Partial<CurrencySettings>) => void;
  onReplaceSettings: (incoming: Partial<Settings>) => void;
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
  onUpdateCurrency,
  onReplaceSettings,
  onUpdateMediaRollPrice,
  onUpdateInkPricing,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const currencyLabel = settings.currency.symbol || settings.currency.code;

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

  const handleCurrencyChange = <K extends keyof CurrencySettings>(field: K, value: CurrencySettings[K]) => {
    onUpdateCurrency({ [field]: value });
  };

  const formatCurrencyValue = (value: number) => formatCurrency(value, settings, { includeSymbol: false });

  useEffect(() => {
    if (!isOpen) {
      setImportError(null);
    }
  }, [isOpen]);

  const handleExportSettings = () => {
    try {
      const data = JSON.stringify(settings, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dafigma-settings.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setImportError(null);
    } catch (error) {
      console.error('Failed to export settings:', error);
      setImportError('Unable to export settings. Please try again.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        onReplaceSettings(parsed);
        setImportError(null);
      } catch (error) {
        console.error('Failed to import settings:', error);
        setImportError('Import failed. Please provide a valid JSON file.');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileImport}
        />
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
          {/* Currency & Formatting */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-black text-lg text-gray-600">CURRENCY & FORMATTING</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Decimals</span>
                  <button
                    type="button"
                    onClick={() => {
                      const useDecimals = !settings.currency.useDecimals;
                      onUpdateCurrency({
                        useDecimals,
                        decimalPlaces: useDecimals ? 2 : 0,
                      });
                    }}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.currency.useDecimals ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.currency.useDecimals ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Units</span>
                  <div className="flex gap-1 bg-gray-200 rounded-full p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ measurementUnit: 'sqm' })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${settings.measurementUnit === 'sqm' ? 'bg-white text-primary shadow' : 'text-gray-600 hover:text-primary'}`}
                    >
                      m²
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ measurementUnit: 'sqft' })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${settings.measurementUnit === 'sqft' ? 'bg-white text-primary shadow' : 'text-gray-600 hover:text-primary'}`}
                    >
                      ft²
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={settings.currency.symbol}
                  onChange={(e) => {
                    const symbol = e.target.value;
                    const inferredCode = symbol.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
                    onUpdateCurrency({
                      symbol,
                      ...(inferredCode.length === 3 ? { code: inferredCode } : {}),
                    });
                  }}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Locale (e.g. en-US)
                </label>
                <input
                  type="text"
                  value={settings.currency.locale}
                  onChange={(e) => handleCurrencyChange('locale', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Investment Settings */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-base text-gray-600 mb-2">
                List Price ({currencyLabel})
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
                Minimum Investment Price ({currencyLabel})
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
                  Default Monthly Volume ({settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'})
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
                  Default Selling Price ({currencyLabel}/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'})
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
            <div className="mb-4">
              <h3 className="font-black text-lg text-gray-600">MEDIA PRICES</h3>
              <p className="text-xs text-gray-500 mt-1">
                Use the average roll cost for each segment: economy (low-end media), standard (a mix of low and high),
                and premium (high-end media).
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Economy Media ({currencyLabel} per roll)
                </label>
                <input
                  type="number"
                  value={settings.mediaPricing.economy.rollPrice || ''}
                  onChange={(e) => handleMediaRollPriceChange('economy', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {currencyLabel} {formatCurrencyValue(settings.mediaPricing.economy.costPerSqm)}/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Standard Media ({currencyLabel} per roll)
                </label>
                <input
                  type="number"
                  value={settings.mediaPricing.standard.rollPrice || ''}
                  onChange={(e) => handleMediaRollPriceChange('standard', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {currencyLabel} {formatCurrencyValue(settings.mediaPricing.standard.costPerSqm)}/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Premium Media ({currencyLabel} per roll)
                </label>
                <input
                  type="number"
                  value={settings.mediaPricing.premium.rollPrice || ''}
                  onChange={(e) => handleMediaRollPriceChange('premium', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {currencyLabel} {formatCurrencyValue(settings.mediaPricing.premium.costPerSqm)}/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'}
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
                  CMYK Ink ({currencyLabel} per 500ml)
                </label>
                <input
                  type="number"
                  value={settings.inkPricing.cmyk.pricePerBottle || ''}
                  onChange={(e) => handleInkPriceChange('cmyk', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Usage: {settings.inkPricing.cmyk.usagePerSqm}ml/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'} (
                  {settings.inkPricing.cmyk.usagePercentage}%)
                </p>
              </div>

              <div>
                <label className="block font-bold text-base text-gray-600 mb-2">
                  Structural Ink ({currencyLabel} per 500ml)
                </label>
                <input
                  type="number"
                  value={settings.inkPricing.structural.pricePerBottle || ''}
                  onChange={(e) => handleInkPriceChange('structural', e.target.value)}
                  className="w-full px-6 py-4 text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Usage: {settings.inkPricing.structural.usagePerSqm}ml/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'} (
                  {settings.inkPricing.structural.usagePercentage}%)
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Data Management */}
          <div>
            <h3 className="font-black text-lg text-gray-600 mb-4">DATA MANAGEMENT</h3>
            {importError && (
              <p className="text-sm text-red-500 mb-3">
                {importError}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportSettings}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-2xl text-sm font-bold text-gray-700 transition-colors"
              >
                Export Settings
              </button>
              <button
                onClick={handleImportClick}
                className="px-5 py-2 bg-primary hover:bg-primary/90 rounded-2xl text-sm font-bold text-white transition-colors"
              >
                Import Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
