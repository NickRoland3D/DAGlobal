import { ProgressBar } from './ProgressBar';
import { FormatCurrencyOptions } from '../utils/format';

interface CostBreakdownProps {
  mediaCost: number;
  inkCost: number;
  profitMargin: number;
  totalCost: number;
  sellingPrice: number;
  mediaType?: string;
  currencyLabel: string;
  formatCurrency: (value: number, options?: FormatCurrencyOptions) => string;
  unitLabel: string;
}

export const CostBreakdown = ({
  mediaCost,
  inkCost,
  profitMargin,
  totalCost,
  sellingPrice,
  mediaType = 'STANDARD',
  currencyLabel,
  formatCurrency,
  unitLabel,
}: CostBreakdownProps) => {
  const compactOptions: FormatCurrencyOptions = { includeSymbol: false };
  const formattedMediaCost = formatCurrency(mediaCost, compactOptions);
  const formattedInkCost = formatCurrency(inkCost, compactOptions);
  const formattedProfitMargin = formatCurrency(profitMargin, { ...compactOptions, minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedTotalCost = formatCurrency(totalCost, compactOptions);

  return (
    <div className="bg-white/90 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-[15px] text-gray-500 tracking-wider">
          COST BREAKDOWN
        </div>
        <div className="flex gap-2.5">
          <div className="bg-gray-200 rounded-full px-3 py-1">
            <span className="font-bold text-gray-600 text-xs">{mediaType.toUpperCase()}</span>
          </div>
          <div className="bg-secondary rounded-full px-3 py-1">
            <span className="font-bold text-primary text-xs">
              {currencyLabel} {formattedMediaCost}/{unitLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProgressBar
          label="MEDIA COST"
          value={mediaCost}
          maxValue={sellingPrice}
          displayValue={`${currencyLabel} ${formattedMediaCost}`}
          color="bg-primary/50"
        />
        <ProgressBar
          label="INK COST"
          value={inkCost}
          maxValue={sellingPrice}
          displayValue={`${currencyLabel} ${formattedInkCost}`}
          color="bg-primary/30"
        />
        <ProgressBar
          label={`PROFIT MARGIN / ${unitLabel}`}
          value={profitMargin}
          maxValue={sellingPrice}
          displayValue={`${currencyLabel} ${formattedProfitMargin}`}
          color="bg-primary"
        />
        <ProgressBar
          label={`TOTAL COST / ${unitLabel}`}
          value={totalCost}
          maxValue={sellingPrice}
          displayValue={`${currencyLabel} ${formattedTotalCost}`}
          color="bg-primary/55"
        />
      </div>
    </div>
  );
};
