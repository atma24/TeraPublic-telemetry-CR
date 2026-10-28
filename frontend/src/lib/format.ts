import { toNumber } from "./utils";

const numberFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });
const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  compactDisplay: "long",
  maximumFractionDigits: 2,
});

export function formatNumber(value: number | string | null | undefined): string {
  return numberFormatter.format(toNumber(value));
}

export function formatDecimal(value: number | string | null | undefined): string {
  return decimalFormatter.format(toNumber(value));
}

export function formatPercent(value: number | string | null | undefined, digits = 1): string {
  return `${toNumber(value).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatRupiah(value: number | string | null | undefined): string {
  return `Rp ${numberFormatter.format(toNumber(value))}`;
}

export function formatCompactRupiah(value: number | string | null | undefined): string {
  const amount = toNumber(value);
  if (Math.abs(amount) >= 1_000_000_000_000_000) {
    return `Rp ${decimalFormatter.format(amount / 1_000_000_000_000_000)} kuadriliun`;
  }
  if (Math.abs(amount) >= 1_000_000_000_000) {
    return `Rp ${decimalFormatter.format(amount / 1_000_000_000_000)} triliun`;
  }
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${decimalFormatter.format(amount / 1_000_000_000)} miliar`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${decimalFormatter.format(amount / 1_000_000)} juta`;
  }
  return `Rp ${compactFormatter.format(amount)}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diff = Date.now() - date.getTime();
  if (diff < 0) return "Baru saja";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDate(value);
}

export function formatArea(value: number | string | null | undefined): string {
  return `${decimalFormatter.format(toNumber(value))} km²`;
}

export function formatCompactNumber(value: number | string | null | undefined): string {
  return compactFormatter.format(toNumber(value));
}
