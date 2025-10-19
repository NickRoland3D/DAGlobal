interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  displayValue: string;
  color?: string;
}

export const ProgressBar = ({ label, value, maxValue, displayValue, color = 'bg-primary/50' }: ProgressBarProps) => {
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div className="p-2.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-primary text-xs">{label}</span>
        <span className="text-black text-xs font-bold">{displayValue}</span>
      </div>
      <div className="relative h-2 bg-secondary rounded">
        <div
          className={`absolute h-full ${color} rounded`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
