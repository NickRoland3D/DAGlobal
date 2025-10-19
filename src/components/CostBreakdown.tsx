import { ProgressBar } from './ProgressBar';

interface CostBreakdownProps {
  mediaCost: number;
  inkCost: number;
  profitMargin: number;
  totalCost: number;
  sellingPrice: number;
  mediaType?: string;
}

export const CostBreakdown = ({ mediaCost, inkCost, profitMargin, totalCost, sellingPrice, mediaType = 'STANDARD' }: CostBreakdownProps) => {
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
            <span className="font-bold text-primary text-xs">{mediaCost.toFixed(2)} AED/m²</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProgressBar
          label="MEDIA COST"
          value={mediaCost}
          maxValue={sellingPrice}
          displayValue={`${mediaCost.toFixed(2)} AED`}
          color="bg-primary/50"
        />
        <ProgressBar
          label="INK COST"
          value={inkCost}
          maxValue={sellingPrice}
          displayValue={`${inkCost.toFixed(2)} AED`}
          color="bg-primary/30"
        />
        <ProgressBar
          label="PROFIT MARGIN / m²"
          value={profitMargin}
          maxValue={sellingPrice}
          displayValue={`${profitMargin.toFixed(0)} AED`}
          color="bg-primary"
        />
        <ProgressBar
          label="TOTAL COST / m²"
          value={totalCost}
          maxValue={sellingPrice}
          displayValue={`${totalCost.toFixed(2)} AED`}
          color="bg-primary/55"
        />
      </div>
    </div>
  );
};
