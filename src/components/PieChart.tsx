import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  profit: number;
  mediaCost: number;
  inkCost: number;
  className?: string;
}

export const PieChart = ({ profit, mediaCost, inkCost, className = '' }: PieChartProps) => {
  const totalCost = mediaCost + inkCost;
  const total = profit + totalCost;
  const profitPercentage = Math.round((profit / total) * 100);

  const data = [
    { name: 'PROFIT', value: profit, color: '#2d5f5d' },
    { name: 'MEDIA', value: mediaCost, color: '#7d9897' },
    { name: 'INK', value: inkCost, color: '#afc1c0' },
  ];

  return (
    <div className={`bg-white rounded-3xl p-6 flex flex-col items-center ${className}`}>
      <div className="font-black text-[10px] text-primary tracking-wider mb-2">
        PROFIT MARGIN
      </div>

      <div className="relative w-full max-w-[280px] mx-auto h-[260px]">
        <ResponsiveContainer width="100%" height={260}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="95%"
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPie>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-black text-5xl text-gray-800 leading-none">
            {profitPercentage}%
          </div>
          <div className="font-black text-sm text-gray-500 tracking-wider mt-2">
            MARGIN
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[10px] text-gray-500 tracking-wider">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
