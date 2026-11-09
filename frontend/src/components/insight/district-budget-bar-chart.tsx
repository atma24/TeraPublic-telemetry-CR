"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactRupiah, formatPercent } from "@/lib/format";
import type { CityBreakdown } from "@/types/public";

function shortCityName(city: string): string {
  return city
    .replace("Kota Administrasi ", "")
    .replace("Kabupaten Administrasi ", "Kab. ")
    .replace("Jakarta ", "Jak-");
}

function axisValue(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(0)} T`;
  if (absolute >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)} M`;
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} jt`;
  return String(value);
}

export function DistrictBudgetBarChart({
  cityBreakdown,
}: {
  cityBreakdown: CityBreakdown[];
}) {
  const data = cityBreakdown.map((item) => ({
    city: shortCityName(item.city),
    fullName: item.city,
    alokasi: Number(item.budget_allocated),
    realisasi: Number(item.budget_realized),
    rasio: item.realization_rate,
  }));

  return (
    <div className="h-[310px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="city"
            tick={{ fill: "var(--muted)", fontSize: 10 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={axisValue}
            tick={{ fill: "var(--muted)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            formatter={(value, name) => [
              formatCompactRupiah(Number(value)),
              name === "realisasi" ? "Realisasi" : "Alokasi",
            ]}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload as { fullName?: string; rasio?: number } | undefined;
              return item?.fullName
                ? `${item.fullName} (${formatPercent(item.rasio ?? 0)} terserap)`
                : String(label);
            }}
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
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
            formatter={(val) => (val === "realisasi" ? "Realisasi APBD" : "Alokasi Pagu")}
          />
          <Bar dataKey="alokasi" name="alokasi" fill="var(--chart-3)" radius={[4, 4, 0, 0]} maxBarSize={36} />
          <Bar dataKey="realisasi" name="realisasi" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
