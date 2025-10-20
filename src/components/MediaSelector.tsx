import { MediaType } from '../types';
import { FormatCurrencyOptions } from '../utils/format';

interface MediaSelectorProps {
  mediaTypes: MediaType[];
  selected: MediaType;
  onChange: (media: MediaType) => void;
  showInfoIcon?: boolean;
  onInfoClick?: () => void;
  currencyLabel: string;
  formatCurrency: (value: number, options?: FormatCurrencyOptions) => string;
  unitLabel: string;
}

export const MediaSelector = ({ mediaTypes, selected, onChange, showInfoIcon = false, onInfoClick, currencyLabel, formatCurrency, unitLabel }: MediaSelectorProps) => {
  return (
    <div className="bg-white/90 rounded-3xl p-6 shadow-sm">
      <div className="font-black text-[15px] text-gray-500 tracking-wider mb-4 flex items-center justify-between">
        <span>MEDIA TYPE</span>
        {showInfoIcon && (
          <button
            onClick={onInfoClick}
            className="w-[19px] h-[19px] rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-400 text-xs font-bold">i</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {mediaTypes.map((media) => {
          const isSelected = selected.id === media.id;
          return (
            <button
              key={media.id}
              onClick={() => onChange(media)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-gray-300 text-black hover:bg-gray-400'
              }`}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="font-bold text-base">{media.name}</div>
                <div className="text-xs tracking-wide">{media.description}</div>
              </div>
              <div className="font-bold text-base">
                {currencyLabel} {formatCurrency(media.costPerSqm, { includeSymbol: false })}/{unitLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
