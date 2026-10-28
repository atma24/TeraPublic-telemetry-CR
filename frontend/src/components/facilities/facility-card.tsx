import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, Users } from "lucide-react";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { FACILITY_STATUS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PublicFacility } from "@/types/public";

const statusTone: Record<PublicFacility["status"], BadgeTone> = {
  operational: "success",
  renovation: "warning",
  closed: "danger",
};

export function FacilityCard({ facility, className }: { facility: PublicFacility; className?: string }) {
  const status = FACILITY_STATUS[facility.status] ?? { label: facility.status, tone: "neutral" };

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-lg border border-border bg-surface transition-colors hover:border-interactive/35",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-2.5">
        <Badge tone="info">{facility.category?.name ?? "Fasilitas"}</Badge>
        <Badge tone={statusTone[facility.status]}>{status.label}</Badge>
        <span className="ml-auto text-[10px] font-medium text-muted">
          {facility.is_state_owned ? "Milik negara" : "Swasta"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-sm font-semibold leading-snug text-text">
          <Link href={`/data/fasilitas/${facility.id}`} className="hover:text-interactive">
            {facility.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-relaxed text-muted">
          <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          <span>
            {facility.region?.name ?? "Wilayah tidak diketahui"}
            {facility.address ? ` · ${facility.address}` : ""}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" aria-hidden="true" />
            {formatNumber(facility.capacity)} kapasitas
          </span>
          {facility.npsn ? (
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3" aria-hidden="true" />
              NPSN {facility.npsn}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          <AccessTag active={facility.has_wheelchair_ramp} label="Ramp" />
          <AccessTag active={facility.has_tactile_paving} label="Tactile" />
          <AccessTag active={facility.has_disabled_toilet} label="Toilet" />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-[10px] text-muted">ID #{facility.id}</span>
          <Link
            href={`/data/fasilitas/${facility.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-interactive"
          >
            Lihat detail
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function AccessTag({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={cn(
        "rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold",
        active
          ? "border-success/20 bg-success/8 text-success"
          : "border-border bg-surface-2 text-muted/70 line-through",
      )}
    >
      {label}
    </span>
  );
}
