"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatNumber } from "@/lib/format";

interface DisabilityAccessChartProps {
  rampCount: number;
  tactileCount: number;
  toiletCount: number;
}

export function DisabilityAccessChart({
  rampCount,
  tactileCount,
  toiletCount,
}: DisabilityAccessChartProps) {
  const data = [
    { name: "Ramp Kursi Roda", value: rampCount, color: "var(--chart-1)" },
    { name: "Ubin Pemandu", value: tactileCount, color: "var(--chart-2)" },
    { name: "Toilet Khusus Difabel", value: toiletCount, color: "var(--chart-4)" },
  ];

  const total = rampCount + tactileCount + toiletCount;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--surface)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${formatNumber(Number(value))} fasilitas (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
                String(name),
              ]}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 11,
                boxShadow: "var(--shadow-soft)",
              }}
              itemStyle={{ color: "var(--text)" }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid w-full grid-cols-3 gap-2 border-t border-border pt-3 text-center">
        <div>
          <p className="text-[10px] font-semibold text-muted">Ramp</p>
          <p className="font-display text-sm font-bold text-text">{formatNumber(rampCount)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted">Ubin Pemandu</p>
          <p className="font-display text-sm font-bold text-text">{formatNumber(tactileCount)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted">Toilet Difabel</p>
          <p className="font-display text-sm font-bold text-text">{formatNumber(toiletCount)}</p>
        </div>
      </div>
    </div>
  );
}
