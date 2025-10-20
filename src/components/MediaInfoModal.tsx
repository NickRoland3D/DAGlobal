import { CostBreakdown } from './CostBreakdown';
import { MonthlyOverhead } from './MonthlyOverhead';
import { FormatCurrencyOptions } from '../utils/format';

interface MediaInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaCost: number;
  inkCost: number;
  profitMargin: number;
  totalCost: number;
  sellingPrice: number;
  mediaType: string;
  monthlyOverhead: number;
  onMonthlyOverheadChange: (value: number) => void;
  overheadMin: number;
  overheadMax: number;
  currencyLabel: string;
  formatCurrency: (value: number, options?: FormatCurrencyOptions) => string;
  unitLabel: string;
}

export const MediaInfoModal = ({
  isOpen,
  onClose,
  mediaCost,
  inkCost,
  profitMargin,
  totalCost,
  sellingPrice,
  mediaType,
  monthlyOverhead,
  onMonthlyOverheadChange,
  overheadMin,
  overheadMax,
  currencyLabel,
  formatCurrency,
  unitLabel,
}: MediaInfoModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <h2 className="font-black text-2xl text-gray-800">MEDIA DETAILS</h2>
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
        <div className="px-8 py-6 space-y-6">
          {/* Cost Breakdown */}
          <CostBreakdown
            mediaCost={mediaCost}
            inkCost={inkCost}
            profitMargin={profitMargin}
            totalCost={totalCost}
            sellingPrice={sellingPrice}
            mediaType={mediaType}
            currencyLabel={currencyLabel}
            formatCurrency={formatCurrency}
            unitLabel={unitLabel}
          />

          {/* Monthly Overhead */}
          <MonthlyOverhead
            value={monthlyOverhead}
            min={overheadMin}
            max={overheadMax}
            onChange={onMonthlyOverheadChange}
            currencyLabel={currencyLabel}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
};
