import { Settings, CurrencySettings } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  settings: Settings;
  onComplete: () => void;
  onUpdateSettings: (updates: Partial<Settings>) => void;
  onUpdateCurrency: (updates: Partial<CurrencySettings>) => void;
  onUpdateMediaRollPrice: (mediaType: 'economy' | 'standard' | 'premium', rollPrice: number) => void;
  onUpdateInkPricing: (
    inkType: 'cmyk' | 'structural',
    updates: Partial<{ pricePerBottle: number; usagePerSqm: number; usagePercentage: number }>
  ) => void;
}

export const OnboardingModal = ({
  isOpen,
  settings,
  onComplete,
  onUpdateSettings,
  onUpdateCurrency,
  onUpdateMediaRollPrice,
  onUpdateInkPricing,
}: OnboardingModalProps) => {
  if (!isOpen) return null;

  const isValid =
    Boolean(settings.currency.symbol) &&
    settings.listPrice > 0 &&
    settings.minimumInvestmentPrice > 0 &&
    settings.defaultSellingPrice > 0 &&
    settings.defaultMonthlyVolume > 0 &&
    settings.mediaPricing.economy.rollPrice > 0 &&
    settings.mediaPricing.standard.rollPrice > 0 &&
    settings.mediaPricing.premium.rollPrice > 0 &&
    settings.inkPricing.cmyk.pricePerBottle > 0 &&
    settings.inkPricing.structural.pricePerBottle > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-8 space-y-8">
        <div className="space-y-3">
          <h2 className="font-black text-3xl text-gray-800">Set Up Your Local Numbers</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tell the calculator how you price hardware, media, and ink in your region. These values seed the
            dashboard the first time it loads so reps see the most relevant defaults.
          </p>
          <div className="bg-secondary/30 border border-secondary/40 rounded-2xl px-4 py-3 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-700">Quick guide:</p>
            <p><span className="font-semibold">Minimum Investment</span> is the lowest deal you&apos;re willing to approve.</p>
            <p><span className="font-semibold">Default values</span> become the starting position for the dashboard sliders.</p>
            <p><span className="font-semibold">Media pricing</span> should cover economy, blended mid-tier, and premium rolls.</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-700">Currency & Formatting</h3>
              <p className="text-xs text-gray-500 mt-1">
                Choose how prices appear in the UI. The symbol is shown beside every amount and the locale controls grouping
                and decimals.
              </p>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-lg text-gray-700">Currency & Formatting</h3>
                <p className="text-xs text-gray-500 mt-1">Choose how prices and units appear across the dashboard.</p>
              </div>
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
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        settings.measurementUnit === 'sqm'
                          ? 'bg-white text-primary shadow'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      m²
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ measurementUnit: 'sqft' })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        settings.measurementUnit === 'sqft'
                          ? 'bg-white text-primary shadow'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      ft²
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
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
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="$"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  Locale (e.g. en-US)
                </label>
                <input
                  type="text"
                  value={settings.currency.locale}
                  onChange={(e) => onUpdateCurrency({ locale: e.target.value })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="en-US"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-700">MSRP & Pricing</h3>
              <p className="text-xs text-gray-500 mt-1">
                List price anchors the ROI calculations. Minimum investment is the floor you approve in deals, and defaults seed the
                dashboard sliders each time the calculator opens.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  Printer MSRP ({settings.currency.symbol || settings.currency.code})
                </label>
                <input
                  type="number"
                  value={settings.listPrice || ''}
                  onChange={(e) => onUpdateSettings({ listPrice: parseFloat(e.target.value) })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="Enter printer MSRP"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  Minimum Investment ({settings.currency.symbol || settings.currency.code})
                </label>
                <input
                  type="number"
                  value={settings.minimumInvestmentPrice || ''}
                  onChange={(e) => onUpdateSettings({ minimumInvestmentPrice: parseFloat(e.target.value) })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="Lowest offer you&apos;ll approve"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  Default Selling Price ({settings.currency.symbol || settings.currency.code}/{settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'})
                </label>
                <input
                  type="number"
                  value={settings.defaultSellingPrice || ''}
                  onChange={(e) => onUpdateSettings({ defaultSellingPrice: parseFloat(e.target.value) })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="Price per unit area"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  Default Monthly Output ({settings.measurementUnit === 'sqft' ? 'ft²' : 'm²'})
                </label>
                <input
                  type="number"
                  value={settings.defaultMonthlyVolume || ''}
                  onChange={(e) => onUpdateSettings({ defaultMonthlyVolume: parseFloat(e.target.value) })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="Typical monthly volume"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-700">Media Roll Pricing</h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter the average roll cost for each tier: economy (low-end media), standard (a blend of low and high),
                and premium (top-spec media). These anchors drive the cost-per-square-metre comparison cards.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {(['economy', 'standard', 'premium'] as const).map((type) => {
                const labelMap = {
                  economy: 'Economy',
                  standard: 'Standard',
                  premium: 'Premium',
                } as const;
                return (
                  <div key={type} className="space-y-2">
                    <label className="block font-bold text-sm text-gray-600">
                      {labelMap[type]} ({settings.currency.symbol || settings.currency.code} per roll)
                    </label>
                    <input
                      type="number"
                      value={settings.mediaPricing[type].rollPrice || ''}
                      onChange={(e) => onUpdateMediaRollPrice(type, parseFloat(e.target.value))}
                      className="w-full px-4 py-3 text-lg font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-700">Ink Bottle Pricing</h3>
              <p className="text-xs text-gray-500 mt-1">
                Provide the per-bottle pricing for CMYK and structural inks so the calculator can produce accurate production costs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  CMYK ({settings.currency.symbol || settings.currency.code} per 500ml)
                </label>
                <input
                  type="number"
                  value={settings.inkPricing.cmyk.pricePerBottle || ''}
                  onChange={(e) => onUpdateInkPricing('cmyk', { pricePerBottle: parseFloat(e.target.value) })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block font-bold text-sm text-gray-600 mb-1">
                  Structural ({settings.currency.symbol || settings.currency.code} per 500ml)
                </label>
                <input
                  type="number"
                  value={settings.inkPricing.structural.pricePerBottle || ''}
                  onChange={(e) => onUpdateInkPricing('structural', { pricePerBottle: parseFloat(e.target.value) })}
                  className="w-full px-5 py-3 text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary"
                  placeholder="0"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-gray-400">
            You can always fine-tune these values later in Settings.
          </p>
          <button
            onClick={onComplete}
            disabled={!isValid}
            className={`px-6 py-3 rounded-2xl text-white font-bold text-sm tracking-wide transition-colors ${
              isValid ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Save & Start
          </button>
        </div>
      </div>
    </div>
  );
};
