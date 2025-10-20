import { useState, useRef, useEffect } from 'react';
import { FormatCurrencyOptions } from '../utils/format';

interface MonthlyOverheadProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  currencyLabel: string;
  formatCurrency: (value: number, options?: FormatCurrencyOptions) => string;
}

export const MonthlyOverhead = ({ value, min, max, onChange, currencyLabel, formatCurrency }: MonthlyOverheadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clamp percentage for visual display
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const handleMouseDown = () => {
    if (!isEnabled) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    const newValue = Math.round((newPercentage / 100) * (max - min) + min);
    const steppedValue = Math.round(newValue / 1000) * 1000;

    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleApply = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      onChange(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Update input value when value prop changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleInputFocus = () => {
    if (!isEnabled) return;
    setIsEditing(true);
    setInputValue(value.toString());
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(inputValue);

    if (!isNaN(numValue) && numValue >= 0) {
      const steppedValue = Math.round(numValue / 1000) * 1000;
      onChange(steppedValue);
    } else {
      setInputValue(value.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const formattedValue = formatCurrency(value, { includeSymbol: false });
  const midpoint = Math.round((max - min) / 2 + min);

  return (
    <div className="bg-white/90 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="font-black text-[15px] text-gray-500 tracking-wider">
          MONTHLY OVERHEAD
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`relative w-12 h-5 rounded-full cursor-pointer transition-colors ${
              isEnabled ? 'bg-primary' : 'bg-gray-300'
            }`}
            onClick={handleApply}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                isEnabled ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </div>
          <button
            onClick={handleApply}
            className={`text-[15px] font-normal tracking-wider transition-colors ${
              isEnabled ? 'text-primary' : 'text-gray-400'
            }`}
          >
            APPLY
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {isEnabled ? (
            <input
              ref={inputRef}
              type="text"
              value={isEditing ? inputValue : formattedValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="font-black text-xl text-primary bg-transparent outline-none max-w-[100px]"
            />
          ) : (
            <span className="font-black text-xl text-primary">{formatCurrency(0, { includeSymbol: false })}</span>
          )}
          <span className="font-bold text-xs text-secondary">{currencyLabel}</span>
        </div>

        <div
          ref={sliderRef}
          className={`relative h-2 bg-secondary rounded cursor-pointer ${
            !isEnabled && 'opacity-50'
          }`}
          onMouseDown={handleMouseDown}
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 ${
              isEnabled ? 'border-primary' : 'border-gray-400'
            } rounded-full shadow ${
              isEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'
            }`}
            style={{ left: `${isEnabled ? percentage : 0}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className="flex justify-between font-black text-xs text-gray-300 pt-1">
          <span>{formatCurrency(min, { includeSymbol: false, compact: true })}</span>
          <span>{formatCurrency(midpoint, { includeSymbol: false, compact: true })}</span>
          <span>{formatCurrency(max, { includeSymbol: false, compact: true })}</span>
        </div>
      </div>
    </div>
  );
};
