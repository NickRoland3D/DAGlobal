import { useState, useMemo } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useSettings } from './hooks/useSettings';
import { SLIDER_RANGES } from './constants';
import { Slider } from './components/Slider';
import { MediaSelector } from './components/MediaSelector';
import { MetricCard } from './components/MetricCard';
import { ProgressBar } from './components/ProgressBar';
import { ROIChart } from './components/ROIChart';
import { PieChart } from './components/PieChart';
import { CostBreakdown } from './components/CostBreakdown';
import { MonthlyOverhead } from './components/MonthlyOverhead';
import { SettingsModal } from './components/SettingsModal';
import { PriceCalculator } from './components/PriceCalculator';
import { MediaInfoModal } from './components/MediaInfoModal';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMediaInfoOpen, setIsMediaInfoOpen] = useState(false);

  const {
    settings,
    updateSettings,
    updateMediaRollPrice,
    updateInkPricing,
    getMediaTypes,
    getTotalInkCost,
  } = useSettings();

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
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getInvestmentTextSize = (value: number) => {
    const digits = value.toString().replace(/,/g, '').length;
    if (digits <= 6) return 'text-5xl';
    if (digits <= 9) return 'text-4xl';
    if (digits <= 12) return 'text-3xl';
    return 'text-2xl';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 md:py-0 overflow-x-auto">
      {/* Header Buttons */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-10 flex gap-2.5">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-gray-200 px-4 py-1.5 rounded-2xl hover:bg-gray-300 transition-colors"
          >
            <span className="font-black text-base text-gray-500 tracking-wide">SETTINGS</span>
          </button>
          <button className="bg-gray-200 px-4 py-1.5 rounded-2xl hover:bg-gray-300 transition-colors">
            <span className="font-black text-base text-gray-500 tracking-wide">SHARE</span>
          </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
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
        overheadMin={SLIDER_RANGES.monthlyOverhead.min}
        overheadMax={SLIDER_RANGES.monthlyOverhead.max}
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
                <span className="font-black text-lg text-gray-400">AED</span>
                <span className={`font-black ${getInvestmentTextSize(state.totalInvestment || 0)} text-gray-800`}>
                  {(state.totalInvestment || 0).toLocaleString()}
                </span>
              </div>
            </button>

            {/* Monthly Output Slider */}
            <Slider
              label="MONTHLY OUTPUT (m²)"
              value={state.monthlyOutput}
              min={SLIDER_RANGES.monthlyOutput.min}
              max={SLIDER_RANGES.monthlyOutput.max}
              step={SLIDER_RANGES.monthlyOutput.step}
              onChange={setMonthlyOutput}
            />

            {/* Selling Price Slider */}
            <Slider
              label="SELLING PRICE (AED/m²)"
              value={state.sellingPrice}
              min={SLIDER_RANGES.sellingPrice.min}
              max={SLIDER_RANGES.sellingPrice.max}
              step={SLIDER_RANGES.sellingPrice.step}
              onChange={setSellingPrice}
            />

            {/* Media Type Selector - No info icon on desktop */}
            <MediaSelector
              mediaTypes={mediaTypes}
              selected={state.selectedMedia}
              onChange={setSelectedMedia}
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
                <span className="font-black text-lg text-gray-400">AED</span>
                <span className={`font-black ${getInvestmentTextSize(state.totalInvestment || 0)} text-gray-800`}>
                  {(state.totalInvestment || 0).toLocaleString()}
                </span>
              </div>
            </button>

            {/* Monthly Output Slider */}
            <Slider
              label="MONTHLY OUTPUT (m²)"
              value={state.monthlyOutput}
              min={SLIDER_RANGES.monthlyOutput.min}
              max={SLIDER_RANGES.monthlyOutput.max}
              step={SLIDER_RANGES.monthlyOutput.step}
              onChange={setMonthlyOutput}
            />

            {/* Selling Price Slider */}
            <Slider
              label="SELLING PRICE (AED/m²)"
              value={state.sellingPrice}
              min={SLIDER_RANGES.sellingPrice.min}
              max={SLIDER_RANGES.sellingPrice.max}
              step={SLIDER_RANGES.sellingPrice.step}
              onChange={setSellingPrice}
            />

            {/* Media Type Selector - With info icon on tablet/mobile */}
            <MediaSelector
              mediaTypes={mediaTypes}
              selected={state.selectedMedia}
              onChange={setSelectedMedia}
              showInfoIcon={true}
              onInfoClick={() => setIsMediaInfoOpen(true)}
            />
          </div>

          {/* Middle/Right Panel - Desktop 3-column ONLY */}
          <div className="hidden xl:flex flex-1 min-w-[460px] max-w-[580px] h-[750px] flex-col justify-between">
            {/* ROI Chart */}
            <ROIChart data={metrics.roiData} />

            {/* Cost Breakdown - Desktop only */}
            <CostBreakdown
              mediaCost={metrics.mediaCost}
              inkCost={metrics.inkCost}
              profitMargin={metrics.profitMarginPerSqm}
              totalCost={metrics.totalCostPerSqm}
              sellingPrice={state.sellingPrice}
              mediaType={state.selectedMedia.name}
            />

            {/* Monthly Overhead - Desktop only */}
            <MonthlyOverhead
              value={state.monthlyOverhead}
              min={SLIDER_RANGES.monthlyOverhead.min}
              max={SLIDER_RANGES.monthlyOverhead.max}
              onChange={setMonthlyOverhead}
            />
          </div>

          {/* Right Panel - Desktop 3-column */}
          <div className="hidden xl:flex w-[360px] h-[750px] flex-col justify-between">
            {/* Monthly Profit */}
            <MetricCard
              label="MONTHLY PROFIT"
              value={formatNumber(metrics.monthlyProfit)}
              unit="AED"
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
                  AED {formatNumber(metrics.monthlyRevenue)}
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
                  {metrics.breakEvenVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })} m²
                </span>
              </div>
            </div>
          </div>

          {/* Tablet 2-column Layout - Right Column */}
          <div className="flex xl:hidden w-full md:flex-1 flex-col gap-4 md:gap-6">
            {/* ROI Chart */}
            <ROIChart data={metrics.roiData} />

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
                      {formatNumber(metrics.monthlyProfit)}
                    </span>
                    <span className="font-black text-xl text-gray-300 mt-4">AED</span>
                  </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white rounded-3xl px-6 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-gray-500 tracking-wider">
                      MONTHLY REVENUE
                    </span>
                    <span className="font-black text-xl text-gray-800">
                      AED {formatNumber(metrics.monthlyRevenue)}
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
                      {metrics.breakEvenVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })} m²
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
    </div>
  );
}

export default App;
