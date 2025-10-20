import { useState, useRef, useEffect } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
  formatValue?: (value: number) => string;
  hideUnit?: boolean;
}

const getStepPrecision = (step: number) => {
  if (!Number.isFinite(step) || step <= 0) return 0;
  const stepString = step.toString();
  if (stepString.includes('e-')) {
    const exponent = Number(stepString.split('e-')[1]);
    return Number.isFinite(exponent) ? exponent : 0;
  }
  const decimalPart = stepString.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
};

export const Slider = ({ label, value, min, max, step = 1, onChange, unit = '', formatValue, hideUnit = false }: SliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stepPrecision = getStepPrecision(step);

  // Clamp percentage for visual display (slider position)
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const applyStep = (rawValue: number) => {
    if (!Number.isFinite(step) || step <= 0) return rawValue;
    const stepped = Math.round(rawValue / step) * step;
    return Number(stepped.toFixed(stepPrecision));
  };

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    const rawValue = (newPercentage / 100) * (max - min) + min;
    const clamped = Math.max(min, Math.min(max, rawValue));
    const steppedValue = applyStep(clamped);

    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, min, max, step]);

  // Update input value when value prop changes (from slider interaction)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleInputFocus = () => {
    setIsEditing(true);
    setInputValue(value.toString());
    // Select all text for easy editing
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseFloat(inputValue);

    // Validate that it's a number and not negative
    if (!isNaN(numValue) && numValue >= 0) {
      const clamped = Math.max(min, Math.min(max, numValue));
      const steppedValue = applyStep(clamped);
      onChange(steppedValue);
    } else {
      // Invalid input, revert to current value
      setInputValue(value.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="bg-white/90 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-[15px] text-gray-500 tracking-wider">{label}</div>
        <div className="bg-gray-200 rounded-full px-3 py-1.5 min-w-[60px] flex items-center justify-center gap-0.5">
          <input
            ref={inputRef}
            type="text"
            value={isEditing ? inputValue : (formatValue ? formatValue(value) : value.toString())}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="font-black text-[15px] text-gray-800 bg-transparent text-center outline-none max-w-[60px]"
          />
          {!hideUnit && unit && <span className="font-black text-[15px] text-gray-800">{unit}</span>}
        </div>
      </div>

      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-300 rounded cursor-pointer mb-4"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute h-full bg-primary rounded"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-4 border-primary rounded-full cursor-grab active:cursor-grabbing shadow-md"
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="flex justify-between font-black text-xs text-gray-500">
        <span>{min}</span>
        <span>{Math.round((max - min) / 2 + min)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
