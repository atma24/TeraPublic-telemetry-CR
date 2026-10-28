"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactRupiah } from "@/lib/format";
import type { ForecastMonth, HistoricalMonth } from "@/types/ml";

interface ChartPoint {
  periode: string;
  aktual: number | null;
  proyeksi: number | null;
}

function periodLabel(periode: string): string {
  if (/^\d{6}$/.test(periode)) {
    const month = Number(periode.slice(4, 6));
    const year = periode.slice(2, 4);
    const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${names[month - 1] ?? periode} '${year}`;
  }
  return periode;
}

function axisValue(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(0)} T`;
  if (absolute >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)} M`;
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} jt`;
  return String(value);
}

export function BudgetForecastChart({
  historical,
  forecast,
}: {
  historical: HistoricalMonth[];
  forecast: ForecastMonth[];
}) {
  const points: ChartPoint[] = historical.map((item) => ({
    periode: item.periode,
    aktual: Number(item.total_realized),
    proyeksi: null,
  }));

  if (points.length > 0) {
    points[points.length - 1] = {
      ...points[points.length - 1],
      proyeksi: points[points.length - 1].aktual,
    };
  }

  for (const item of forecast) {
    points.push({
      periode: item.periode,
      aktual: null,
      proyeksi: Number(item.predicted_monthly_realized),
    });
  }

  return (
    <div className="h-[310px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="periode"
            tickFormatter={periodLabel}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={axisValue}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={54}
          />
          <Tooltip
            formatter={(value, name) => [formatCompactRupiah(Number(value)), name === "aktual" ? "Aktual" : "Proyeksi"]}
            labelFormatter={(label) => periodLabel(String(label))}
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
            formatter={(value) => (value === "aktual" ? "Realisasi aktual" : "Proyeksi model")}
            wrapperStyle={{ fontSize: 10, color: "var(--muted)" }}
          />
          <Line
            type="monotone"
            dataKey="aktual"
            stroke="var(--chart-1)"
            strokeWidth={2.2}
            dot={{ r: 2, fill: "var(--chart-1)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="proyeksi"
            stroke="var(--chart-4)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 2, fill: "var(--chart-4)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
