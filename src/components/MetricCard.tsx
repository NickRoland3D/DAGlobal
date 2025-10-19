interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  size?: 'small' | 'medium' | 'large';
}

export const MetricCard = ({ label, value, unit = '', size = 'medium' }: MetricCardProps) => {
  const valueSize = size === 'large' ? 'text-5xl' : size === 'medium' ? 'text-3xl' : 'text-xl';
  const unitSize = size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-base';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="font-black text-[15px] text-gray-500 tracking-wider mb-2">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-black ${valueSize} text-gray-800`}>
          {value}
        </span>
        {unit && (
          <span className={`font-black ${unitSize} text-gray-300`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
