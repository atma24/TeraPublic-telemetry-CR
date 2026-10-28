"use client";

import dynamic from "next/dynamic";

import type { FacilityMapProps } from "./facility-map";

const FacilityMap = dynamic(() => import("./facility-map").then((module) => module.FacilityMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-64 w-full items-center justify-center rounded-lg border border-border bg-surface-2">
      <div className="flex flex-col items-center gap-2">
        <span className="size-6 animate-spin rounded-full border-2 border-border border-t-interactive" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Memuat peta
        </span>
      </div>
    </div>
  ),
});

export function FacilityMapClient(props: FacilityMapProps) {
  return <FacilityMap {...props} />;
}
