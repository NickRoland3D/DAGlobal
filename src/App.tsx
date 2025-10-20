import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useSettings } from './hooks/useSettings';
import { SLIDER_RANGES } from './constants';
import { Slider } from './components/Slider';
import { MediaSelector } from './components/MediaSelector';
import { MetricCard } from './components/MetricCard';
import { ROIChart } from './components/ROIChart';
import { PieChart } from './components/PieChart';
import { CostBreakdown } from './components/CostBreakdown';
import { MonthlyOverhead } from './components/MonthlyOverhead';
import { SettingsModal } from './components/SettingsModal';
import { PriceCalculator } from './components/PriceCalculator';
import { MediaInfoModal } from './components/MediaInfoModal';
import { formatCurrency, formatNumber } from './utils/format';
import { OnboardingModal } from './components/OnboardingModal';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMediaInfoOpen, setIsMediaInfoOpen] = useState(false);
  const [isShareNoticeOpen, setIsShareNoticeOpen] = useState(false);
  const telemetrySnapshotRef = useRef<string | null>(null);

  const {
    settings,
    updateSettings,
    updateCurrencySettings,
    replaceSettings,
    updateMediaRollPrice,
    updateInkPricing,
    getMediaTypes,
    getTotalInkCost,
  } = useSettings();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    setIsOnboardingOpen(!settings.hasCompletedSetup);
  }, [settings.hasCompletedSetup]);

  const buildTelemetrySnapshot = useCallback(() => ({
    locale: settings.currency.locale,
    currencySymbol: settings.currency.symbol,
    currencyCode: settings.currency.code,
    measurementUnit: settings.measurementUnit,
    listPrice: settings.listPrice,
    minimumInvestmentPrice: settings.minimumInvestmentPrice,
    defaultMonthlyVolume: settings.defaultMonthlyVolume,
    defaultSellingPrice: settings.defaultSellingPrice,
    mediaPricing: settings.mediaPricing,
    inkPricing: settings.inkPricing,
  }), [settings]);

  const sendTelemetrySnapshot = useCallback(() => {
    if (!settings.hasCompletedSetup) return;
    const snapshot = JSON.stringify(buildTelemetrySnapshot());
    if (telemetrySnapshotRef.current === snapshot) return;
    telemetrySnapshotRef.current = snapshot;

    const endpoint = '/.netlify/functions/collect-settings';
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([snapshot], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: snapshot,
        keepalive: true,
      }).catch((error) => console.error('Failed to send telemetry snapshot', error));
    }
  }, [buildTelemetrySnapshot, settings.hasCompletedSetup]);

  const handleOnboardingComplete = () => {
    updateSettings({ hasCompletedSetup: true });
    sendTelemetrySnapshot();
  };

  const mediaTypes = useMemo(() => getMediaTypes(), [settings]);
  const totalInkCost = useMemo(() => getTotalInkCost(), [settings]);

  const {
    state,
    metrics,
    setMonthlyOutput,
    setSellingPrice,
    setSelectedMedia,
    setMonthlyOverhead,
    setTotalInvestment,
  } = useCalculator({
    mediaTypes,
    totalInvestment: settings.listPrice,
    defaultMonthlyOutput: settings.defaultMonthlyVolume,
    defaultSellingPrice: settings.defaultSellingPrice,
    defaultMediaType: settings.defaultMediaType,
    totalInkCost,
    minimumInvestment: settings.minimumInvestmentPrice,
  });

  const currencyLabel = settings.currency.symbol || settings.currency.code;
  const unitLabel = settings.measurementUnit === 'sqft' ? 'ft²' : 'm²';

  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false);
    sendTelemetrySnapshot();
  }, [sendTelemetrySnapshot]);

  const formatCurrencyValue = (value: number, options?: Parameters<typeof formatCurrency>[2]) =>
    formatCurrency(value, settings, options);

  const formatCompactCurrency = (value: number) =>
    formatCurrency(value, settings, { compact: true, includeSymbol: false });

  const formatNumberValue = (value: number, options?: Intl.NumberFormatOptions) =>
    formatNumber(value, settings, options);

  const sellingPriceRange = useMemo(() => {
    const basePrice = settings.defaultSellingPrice || SLIDER_RANGES.sellingPrice.min;
    const candidateMin = Math.max(1, Math.round(basePrice * 0.25));
    const candidateMax = Math.max(candidateMin + 1, Math.round(basePrice * 2));
    const min = Math.max(1, Math.min(SLIDER_RANGES.sellingPrice.min, candidateMin));
    const max = Math.max(SLIDER_RANGES.sellingPrice.max, candidateMax);
    const step = 1;
    return {
      min,
      max,
      step,
    };
  }, [settings.defaultSellingPrice]);

  const monthlyOverheadRange = useMemo(() => {
    const baseInvestment = settings.listPrice || SLIDER_RANGES.monthlyOverhead.max;
    const candidateMax = Math.ceil((baseInvestment * 0.4) / SLIDER_RANGES.monthlyOverhead.step) * SLIDER_RANGES.monthlyOverhead.step;
    const max = Math.max(candidateMax, SLIDER_RANGES.monthlyOverhead.max);
    return {
      min: SLIDER_RANGES.monthlyOverhead.min,
      max,
      step: SLIDER_RANGES.monthlyOverhead.step,
    };
  }, [settings.listPrice]);

  useEffect(() => {
    if (state.sellingPrice < sellingPriceRange.min) {
      setSellingPrice(sellingPriceRange.min);
    } else if (state.sellingPrice > sellingPriceRange.max) {
      setSellingPrice(sellingPriceRange.max);
    }
  }, [state.sellingPrice, sellingPriceRange.min, sellingPriceRange.max, setSellingPrice]);

  useEffect(() => {
    if (state.monthlyOverhead > monthlyOverheadRange.max) {
      setMonthlyOverhead(monthlyOverheadRange.max);
    }
  }, [state.monthlyOverhead, monthlyOverheadRange.max, setMonthlyOverhead]);

  const formatSliderCurrency = (val: number) =>
    formatCurrencyValue(val, { includeSymbol: false, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatSliderOutput = (val: number) => formatNumberValue(val, { maximumFractionDigits: 0 });

  const getInvestmentTextSize = (value: number) => {
    const digits = value.toString().replace(/,/g, '').length;
    if (digits <= 6) return 'text-5xl';
    if (digits <= 9) return 'text-4xl';
    if (digits <= 12) return 'text-3xl';
    return 'text-2xl';
  };

  const isInRedZone = state.isBelowMinimumInvestment;

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-8 md:py-0 overflow-x-auto transition-colors duration-300 ${
        isInRedZone ? 'bg-[#fbeaea]' : 'bg-background'
      }`}
    >
      <OnboardingModal
        isOpen={isOnboardingOpen}
        settings={settings}
        onComplete={handleOnboardingComplete}
        onUpdateSettings={updateSettings}
        onUpdateCurrency={updateCurrencySettings}
        onUpdateMediaRollPrice={updateMediaRollPrice}
        onUpdateInkPricing={updateInkPricing}
      />

      {/* Header Buttons */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-10 flex gap-2.5">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-gray-200 px-4 py-1.5 rounded-2xl hover:bg-gray-300 transition-colors"
          >
            <span className="font-black text-base text-gray-500 tracking-wide">SETTINGS</span>
          </button>
          <button
            className="bg-gray-200 px-4 py-1.5 rounded-2xl hover:bg-gray-300 transition-colors"
            onClick={() => setIsShareNoticeOpen(true)}
          >
            <span className="font-black text-base text-gray-500 tracking-wide">SHARE</span>
          </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onUpdateSettings={updateSettings}
        onUpdateCurrency={updateCurrencySettings}
        onReplaceSettings={replaceSettings}
        onUpdateMediaRollPrice={updateMediaRollPrice}
        onUpdateInkPricing={updateInkPricing}
      />

      {/* Price Calculator Modal */}
      <PriceCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        listPrice={settings.listPrice}
        currentPrice={state.totalInvestment}
        onConfirm={(price) => setTotalInvestment(price)}
        currencyLabel={currencyLabel}
        formatCurrency={(value, options) => formatCurrencyValue(value, options)}
      />

      {/* Media Info Modal */}
      <MediaInfoModal
        isOpen={isMediaInfoOpen}
        onClose={() => setIsMediaInfoOpen(false)}
        mediaCost={metrics.mediaCost}
        inkCost={metrics.inkCost}
        profitMargin={metrics.profitMarginPerSqm}
        totalCost={metrics.totalCostPerSqm}
        sellingPrice={state.sellingPrice}
        mediaType={state.selectedMedia.name}
        monthlyOverhead={state.monthlyOverhead}
        onMonthlyOverheadChange={setMonthlyOverhead}
        overheadMin={monthlyOverheadRange.min}
        overheadMax={monthlyOverheadRange.max}
        currencyLabel={currencyLabel}
        formatCurrency={(value, options) => formatCurrencyValue(value, options)}
        unitLabel={unitLabel}
      />

      <div className="w-full max-w-[1440px] px-4 md:px-8">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Left Panel - Desktop */}
          <div className="hidden xl:flex w-[360px] h-[750px] flex-col justify-between">
            {/* Total Investment */}
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="bg-white/90 rounded-3xl p-6 shadow-sm hover:bg-white transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2.5">
                <span className="font-black text-lg text-gray-400">{currencyLabel}</span>
                <span className={`font-black ${getInvestmentTextSize(state.totalInvestment || 0)} text-gray-800`}>
                  {formatCurrencyValue(state.totalInvestment || 0, {
                    includeSymbol: false,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </button>

            {/* Monthly Output Slider */}
            <Slider
              label={`MONTHLY OUTPUT (${unitLabel})`}
              value={state.monthlyOutput}
              min={SLIDER_RANGES.monthlyOutput.min}
              max={SLIDER_RANGES.monthlyOutput.max}
              step={SLIDER_RANGES.monthlyOutput.step}
              onChange={setMonthlyOutput}
              formatValue={formatSliderOutput}
            />

            {/* Selling Price Slider */}
            <Slider
              label={`SELLING PRICE (${currencyLabel}/${unitLabel})`}
              value={state.sellingPrice}
              min={sellingPriceRange.min}
              max={sellingPriceRange.max}
              step={sellingPriceRange.step}
              onChange={setSellingPrice}
              formatValue={formatSliderCurrency}
              hideUnit
            />

            {/* Media Type Selector - No info icon on desktop */}
            <MediaSelector
              mediaTypes={mediaTypes}
              selected={state.selectedMedia}
              onChange={setSelectedMedia}
              currencyLabel={currencyLabel}
              formatCurrency={(value, options) => formatCurrencyValue(value, options)}
              unitLabel={unitLabel}
            />
          </div>

          {/* Left Panel - Tablet/Mobile */}
          <div className="flex xl:hidden w-full md:w-[360px] md:h-[688px] flex-col gap-4 md:gap-6 md:justify-between">
            {/* Total Investment */}
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="bg-white/90 rounded-3xl p-6 shadow-sm hover:bg-white transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2.5">
                <span className="font-black text-lg text-gray-400">{currencyLabel}</span>
                <span className={`font-black ${getInvestmentTextSize(state.totalInvestment || 0)} text-gray-800`}>
                  {formatCurrencyValue(state.totalInvestment || 0, {
                    includeSymbol: false,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </button>

            {/* Monthly Output Slider */}
            <Slider
              label={`MONTHLY OUTPUT (${unitLabel})`}
              value={state.monthlyOutput}
              min={SLIDER_RANGES.monthlyOutput.min}
              max={SLIDER_RANGES.monthlyOutput.max}
              step={SLIDER_RANGES.monthlyOutput.step}
              onChange={setMonthlyOutput}
              formatValue={formatSliderOutput}
            />

            {/* Selling Price Slider */}
            <Slider
              label={`SELLING PRICE (${currencyLabel}/${unitLabel})`}
              value={state.sellingPrice}
              min={sellingPriceRange.min}
              max={sellingPriceRange.max}
              step={sellingPriceRange.step}
              onChange={setSellingPrice}
              formatValue={formatSliderCurrency}
              hideUnit
            />

            {/* Media Type Selector - With info icon on tablet/mobile */}
            <MediaSelector
              mediaTypes={mediaTypes}
              selected={state.selectedMedia}
              onChange={setSelectedMedia}
              showInfoIcon={true}
              onInfoClick={() => setIsMediaInfoOpen(true)}
              currencyLabel={currencyLabel}
              formatCurrency={(value, options) => formatCurrencyValue(value, options)}
              unitLabel={unitLabel}
            />
          </div>

          {/* Middle/Right Panel - Desktop 3-column ONLY */}
          <div className="hidden xl:flex flex-1 min-w-[460px] max-w-[580px] h-[750px] flex-col justify-between">
            {/* ROI Chart */}
            <ROIChart
              data={metrics.roiData}
              currencyLabel={currencyLabel}
              formatCurrency={(value, options) => formatCurrencyValue(value, options)}
            />

            {/* Cost Breakdown - Desktop only */}
            <CostBreakdown
              mediaCost={metrics.mediaCost}
              inkCost={metrics.inkCost}
              profitMargin={metrics.profitMarginPerSqm}
              totalCost={metrics.totalCostPerSqm}
              sellingPrice={state.sellingPrice}
              mediaType={state.selectedMedia.name}
              currencyLabel={currencyLabel}
              formatCurrency={(value, options) => formatCurrencyValue(value, options)}
              unitLabel={unitLabel}
            />

            {/* Monthly Overhead - Desktop only */}
            <MonthlyOverhead
              value={state.monthlyOverhead}
              min={monthlyOverheadRange.min}
              max={monthlyOverheadRange.max}
              onChange={setMonthlyOverhead}
              currencyLabel={currencyLabel}
              formatCurrency={(value, options) => formatCurrencyValue(value, options)}
            />
          </div>

          {/* Right Panel - Desktop 3-column */}
          <div className="hidden xl:flex w-[360px] h-[750px] flex-col justify-between">
            {/* Monthly Profit */}
            <MetricCard
              label="MONTHLY PROFIT"
              value={formatCompactCurrency(metrics.monthlyProfit)}
              unit={currencyLabel}
              size="large"
            />

            {/* Pie Chart */}
            <PieChart
              profit={metrics.profitMarginPerSqm}
              mediaCost={metrics.mediaCost}
              inkCost={metrics.inkCost}
            />

            {/* Payback Period */}
            <div className="bg-white rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-black text-[15px] text-gray-500 tracking-wider">
                  PAYBACK PERIOD
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-2xl text-gray-800">
                    {metrics.paybackPeriod.toFixed(1)}
                  </span>
                  <span className="font-bold text-sm text-gray-600">MONTHS</span>
                </div>
              </div>
              <div className="relative h-3 bg-secondary rounded-full">
                <div
                  className="absolute h-full bg-primary/50 rounded-full"
                  style={{ width: `${Math.min(100, (metrics.paybackPeriod / 24) * 100)}%` }}
                />
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white rounded-3xl px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-[15px] text-gray-500 tracking-wider">
                  MONTHLY REVENUE
                </span>
                <span className="font-black text-xl text-gray-800">
                  {currencyLabel} {formatCompactCurrency(metrics.monthlyRevenue)}
                </span>
              </div>
            </div>

            {/* Break Even Volume */}
            <div className="bg-white rounded-3xl px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-[15px] text-gray-500 tracking-wider">
                  BREAK EVEN VOLUME
                </span>
                <span className="font-black text-xl text-gray-800">
                  {formatNumberValue(metrics.breakEvenVolume, { maximumFractionDigits: 0 })} {unitLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Tablet 2-column Layout - Right Column */}
          <div className="flex xl:hidden w-full md:flex-1 flex-col gap-4 md:gap-6">
            {/* ROI Chart */}
            <ROIChart
              data={metrics.roiData}
              currencyLabel={currencyLabel}
              formatCurrency={(value, options) => formatCurrencyValue(value, options)}
            />

            {/* Bottom Section - 2 columns on tablet, single column on mobile */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-[18px] items-stretch">
              {/* Left: Metrics Stack (298px on tablet, full width on mobile) */}
              <div className="w-full md:w-[298px] flex flex-col gap-3 md:gap-[18px]">
                {/* Monthly Profit */}
                <div className="bg-white/90 rounded-3xl px-6 py-2.5 shadow-sm h-[100px] flex flex-col justify-between">
                  <div className="font-black text-[15px] text-gray-500 tracking-wider">
                    MONTHLY PROFIT
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="font-black text-[41px] text-gray-800 leading-none">
                      {formatCompactCurrency(metrics.monthlyProfit)}
                    </span>
                    <span className="font-black text-xl text-gray-300 mt-4">{currencyLabel}</span>
                  </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white rounded-3xl px-6 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-gray-500 tracking-wider">
                      MONTHLY REVENUE
                    </span>
                    <span className="font-black text-xl text-gray-800">
                      {currencyLabel} {formatCompactCurrency(metrics.monthlyRevenue)}
                    </span>
                  </div>
                </div>

                {/* Payback Period */}
                <div className="bg-white rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-black text-xs text-gray-500 tracking-wider">
                      PAYBACK PERIOD
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-2xl text-gray-800">
                        {metrics.paybackPeriod.toFixed(1)}
                      </span>
                      <span className="font-bold text-sm text-gray-600">MONTHS</span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-secondary rounded-full">
                    <div
                      className="absolute h-full bg-primary/50 rounded-full"
                      style={{ width: `${Math.min(100, (metrics.paybackPeriod / 24) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Break Even Volume */}
                <div className="bg-white rounded-3xl px-6 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-gray-500 tracking-wider">
                      BREAK EVEN VOLUME
                    </span>
                    <span className="font-black text-xl text-gray-800">
                      {formatNumberValue(metrics.breakEvenVolume, { maximumFractionDigits: 0 })} {unitLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Pie Chart (264px on tablet, full width on mobile) */}
              <div className="w-full md:flex-1 md:w-[264px] flex">
                <PieChart
                  profit={metrics.profitMarginPerSqm}
                  mediaCost={metrics.mediaCost}
                  inkCost={metrics.inkCost}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShareNoticeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsShareNoticeOpen(false)}
        >
          <div
            className="bg-white rounded-3xl px-8 py-6 shadow-lg max-w-sm text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-black text-xl text-gray-800">Coming Soon</h2>
            <p className="text-sm text-gray-500">
              Sharing and exporting dashboards is coming in a future update. Stay tuned!
            </p>
            <button
              onClick={() => setIsShareNoticeOpen(false)}
              className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
