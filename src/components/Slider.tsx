import { useState, useRef, useEffect } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export const Slider = ({ label, value, min, max, step = 1, onChange, unit = '' }: SliderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clamp percentage for visual display (slider position)
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    const newValue = Math.round((newPercentage / 100) * (max - min) + min);
    const steppedValue = Math.round(newValue / step) * step;

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
      // Round to step increment
      const steppedValue = Math.round(numValue / step) * step;
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
        <div className="bg-gray-200 rounded-full px-4 py-1.5 min-w-[70px] flex items-center justify-center gap-0.5">
          <input
            ref={inputRef}
            type="text"
            value={isEditing ? inputValue : value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="font-black text-[15px] text-gray-800 bg-transparent text-center outline-none max-w-[50px]"
          />
          {unit && <span className="font-black text-[15px] text-gray-800">{unit}</span>}
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
