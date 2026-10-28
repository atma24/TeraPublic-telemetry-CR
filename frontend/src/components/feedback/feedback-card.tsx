import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin, MessageSquareQuote, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { FEEDBACK_CATEGORIES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CitizenFeedback } from "@/types/public";
import { FeedbackStatusBadge } from "./feedback-status-badge";

export function FeedbackCard({
  feedback,
  showCitizen = false,
  actions,
  className,
}: {
  feedback: CitizenFeedback;
  showCitizen?: boolean;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("rounded-lg border border-border bg-surface", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <FeedbackStatusBadge status={feedback.status} />
          <Badge tone="outline">{FEEDBACK_CATEGORIES[feedback.category] ?? feedback.category}</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <code className="rounded-sm bg-surface-2 px-1.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-muted">
            {feedback.tracking_code}
          </code>
          <CopyButton value={feedback.tracking_code} label="Salin kode" />
        </div>
      </div>

      <div className="px-5 py-4">
        <h2 className="font-display text-base font-semibold leading-snug text-text">{feedback.title}</h2>
        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted">{feedback.description}</p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted">
          <div className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <dt className="sr-only">Tanggal laporan</dt>
            <dd>{formatDateTime(feedback.created_at)}</dd>
          </div>
          {feedback.facility ? (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              <dt className="sr-only">Fasilitas</dt>
              <dd>
                <Link
                  href={`/data/fasilitas/${feedback.facility.id}`}
                  className="font-medium text-text hover:text-interactive hover:underline"
                >
                  {feedback.facility.name}
                </Link>
              </dd>
            </div>
          ) : null}
          {showCitizen ? (
            <div className="inline-flex items-center gap-1.5">
              <UserRound className="size-3.5" aria-hidden="true" />
              <dt className="sr-only">Pelapor</dt>
              <dd>
                {feedback.citizen_name}
                {feedback.citizen_email ? ` · ${feedback.citizen_email}` : ""}
              </dd>
            </div>
          ) : null}
          {feedback.photo_url ? (
            <a
              href={feedback.photo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-interactive hover:underline"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Foto lampiran
            </a>
          ) : null}
        </dl>

        {feedback.admin_response ? (
          <div className="mt-4 rounded-md border border-interactive/20 bg-interactive/5 px-3.5 py-3">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-interactive">
              <MessageSquareQuote className="size-3.5" aria-hidden="true" />
              Tanggapan admin
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-text">
              {feedback.admin_response}
            </p>
            {feedback.resolved_at ? (
              <p className="mt-1 text-[10px] text-muted">Diselesaikan {formatDateTime(feedback.resolved_at)}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {actions ? <div className="border-t border-border px-5 py-3">{actions}</div> : null}
    </article>
  );
}
