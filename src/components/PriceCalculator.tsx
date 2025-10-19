import { useState, useEffect } from 'react';

interface PriceCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  listPrice: number;
  currentPrice: number;
  onConfirm: (price: number) => void;
}

export const PriceCalculator = ({
  isOpen,
  onClose,
  listPrice,
  currentPrice,
  onConfirm,
}: PriceCalculatorProps) => {
  const [displayValue, setDisplayValue] = useState((currentPrice || listPrice || 0).toString());
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const validPrice = currentPrice || listPrice || 0;
      setDisplayValue(validPrice.toString());
      // Calculate discount based on current price vs list price
      const discountPercent = ((listPrice - validPrice) / listPrice) * 100;
      setDiscount(Math.round(discountPercent));
    }
  }, [isOpen, currentPrice, listPrice]);

  if (!isOpen) return null;

  const handleNumberClick = (num: string) => {
    const validPrice = currentPrice || listPrice || 0;
    if (displayValue === '0' || displayValue === validPrice.toString()) {
      setDisplayValue(num);
    } else {
      setDisplayValue(displayValue + num);
    }
    setDiscount(0); // Clear discount when manually entering numbers
  };

  const handleClear = () => {
    setDisplayValue((listPrice || 0).toString());
    setDiscount(0);
  };

  const handleConfirm = () => {
    const parsedValue = parseInt(displayValue);
    const finalPrice = (!isNaN(parsedValue) && parsedValue > 0) ? parsedValue : (listPrice || 0);
    onConfirm(finalPrice);
    onClose();
  };

  const getCurrentDisplayPrice = () => {
    const parsed = parseInt(displayValue);
    if (discount > 0) {
      return Math.round(listPrice * (1 - discount / 100));
    }
    return (!isNaN(parsed) && parsed > 0) ? parsed : 0;
  };

  const calculatedPrice = getCurrentDisplayPrice();

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-3xl p-6 mx-4">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-300"
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

        {/* Header Pills */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-gray-800 rounded-2xl px-4 py-3 text-center">
            <div className="text-xs font-bold text-gray-400 mb-1">LIST</div>
            <div className="text-lg font-bold text-gray-300">{formatPrice(listPrice)}</div>
          </div>
          <div className="flex-1 bg-gray-800 rounded-2xl px-4 py-3 text-center">
            <div className="text-xs font-bold text-primary mb-1">DISCOUNT</div>
            <div className="text-lg font-bold text-primary">{discount}%</div>
          </div>
        </div>

        {/* Large Price Display */}
        <div className="text-center mb-8 py-6 border-b border-gray-700">
          <div className="text-sm text-gray-500 mb-2">AED</div>
          <div className="text-5xl font-black text-white">
            {formatPrice(calculatedPrice)}
          </div>
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {numberButtons.map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-6 rounded-2xl transition-colors"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="bg-[#e57373] hover:bg-[#d66464] text-white text-2xl font-bold py-6 rounded-2xl transition-colors"
          >
            C
          </button>

          {/* Zero Button */}
          <button
            onClick={() => handleNumberClick('0')}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-6 rounded-2xl transition-colors"
          >
            0
          </button>

          {/* 000 Button */}
          <button
            onClick={() => handleNumberClick('000')}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl font-bold py-6 rounded-2xl transition-colors"
          >
            000
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-primary hover:bg-primary/90 text-white text-lg font-bold py-4 rounded-2xl transition-colors"
        >
          Confirm Price
        </button>
      </div>
    </div>
  );
};
