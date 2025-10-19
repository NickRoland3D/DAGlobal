import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface ROIChartProps {
  data: Array<{
    month: number;
    monthlyProfit: number;
    cumulativeReturn: number;
  }>;
}

export const ROIChart = ({ data }: ROIChartProps) => {
  const chartData = data.filter((_, i) => i === 0 || (i + 1) % 3 === 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `AED ${(value / 1000).toFixed(0)}K`;
    if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
    if (value <= -1000000) return `AED ${(value / 1000).toFixed(0)}K`;
    if (value <= -1000) return `AED ${(value / 1000).toFixed(0)}K`;
    return `AED ${value}`;
  };

  const renderLegend = () => {
    const items = [
      { name: 'MONTHLY PROFIT', color: '#2d5f5d' },
      { name: 'CUMULATIVE RETURN', color: '#7d9897' },
      { name: 'BREAK-EVEN', color: '#e8b44c' },
    ];

    return (
      <div className="flex gap-4 items-center justify-center mt-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-gray-500 tracking-wider">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white/90 rounded-2xl p-6">
      <div className="font-black text-[15px] text-gray-500 tracking-wider mb-4">
        ROI TIMELINE & PROFIT PROJECTION
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => `M${value}`}
            tick={{ fontSize: 10, fill: '#808080' }}
            stroke="#e0e0e0"
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 10, fill: '#808080' }}
            stroke="#e0e0e0"
            domain={[-200000, 400000]}
            ticks={[400000, 300000, 200000, 100000, 0, -100000, -200000]}
          />
          <Legend
            content={renderLegend}
            wrapperStyle={{ paddingTop: 10 }}
          />
          <ReferenceLine
            y={0}
            stroke="#e8b44c"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="cumulativeReturn"
            stroke="#7d9897"
            strokeWidth={2}
            fill="#7d9897"
            fillOpacity={0.3}
            name="CUMULATIVE RETURN"
          />
          <Line
            type="monotone"
            dataKey="monthlyProfit"
            stroke="#2d5f5d"
            strokeWidth={2}
            dot={false}
            name="MONTHLY PROFIT"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
