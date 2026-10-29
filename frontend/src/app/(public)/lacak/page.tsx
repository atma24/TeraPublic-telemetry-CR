import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3, FileText, Search, Sparkles, Ticket } from "lucide-react";

import { FeedbackCard } from "@/components/feedback/feedback-card";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/form";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { getPublicFeedbackByCode } from "@/lib/api/public";
import { isApiError } from "@/lib/api/client";
import { firstParam } from "@/lib/utils";
import type { SearchParams } from "@/types/api";
import type { CitizenFeedback } from "@/types/public";

export const metadata: Metadata = {
  title: "Lacak Aduan",
  description: "Pantau status aduan fasilitas publik TeraPublic menggunakan kode pelacakan.",
};

const stages = [
  { key: "submitted", label: "Diajukan", step: 1 },
  { key: "verified", label: "Terverifikasi", step: 2 },
  { key: "in_review", label: "Ditindaklanjuti", step: 3 },
  { key: "resolved", label: "Selesai", step: 4 },
];

function getStageIndex(status: CitizenFeedback["status"]): number {
  if (status === "resolved") return 4;
  if (status === "in_review") return 3;
  if (status === "verified") return 2;
  if (status === "submitted") return 1;
  return 0; // rejected or unknown
}

export default async function TrackFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const rawCode = firstParam(params.kode)?.trim().toUpperCase() ?? "";
  const code = rawCode.slice(0, 40);

  let feedback: CitizenFeedback | null = null;
  let errorMessage: string | null = null;

  if (code) {
    try {
      const response = await getPublicFeedbackByCode(code);
      feedback = response.data;
    } catch (error) {
      if (isApiError(error)) {
        errorMessage =
          error.status === 404
            ? "Kode pelacakan tidak ditemukan. Periksa kembali huruf dan angkanya."
            : error.message;
      } else {
        errorMessage = "Status aduan belum dapat dimuat.";
      }
    }
  }

  const currentStage = feedback ? getStageIndex(feedback.status) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Pelacakan warga"
        title="Cek status laporan Anda"
        description="Pantau perkembangan verifikasi, disposisi penanganan, dan tanggapan admin secara transparan."
        breadcrumbs={[{ label: "Lacak aduan" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/aduan/buat"
              className="inline-flex items-center gap-1.5 rounded-lg bg-interactive px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-interactive-hover"
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Buat aduan baru
            </Link>
          </div>
        }
        widget={
          <div className="rounded-xl border border-border/80 bg-surface/90 p-4 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <Clock3 className="size-3.5 text-interactive" />
                SLA Respons Laporan
              </span>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                &lt; 24 Jam Kerja
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text">
                <CheckCircle2 className="size-3.5 text-interactive" />
                Pelacakan Real-time
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text">
                <Ticket className="size-3.5 text-interactive" />
                Format #ADU-JKT
              </span>
            </div>
          </div>
        }
      />

      <div className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <form
            method="get"
            action="/lacak"
            className="card-hover relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:border-interactive/40 sm:p-7"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-interactive/5 blur-3xl" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="kode" className="font-display text-sm font-bold text-text">
                  Kode pelacakan aduan
                </label>
                <p className="mt-1 text-xs text-muted">Contoh format: TP-2026-ABC12</p>
              </div>
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-interactive/10 text-interactive">
                <Ticket className="size-4" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <input
                  id="kode"
                  name="kode"
                  type="text"
                  defaultValue={code}
                  placeholder="TP-2026-ABC12"
                  className={`${inputClass} h-11 text-sm font-mono tracking-wider`}
                  autoComplete="off"
                  spellCheck={false}
                  required
                />
              </div>
              <Button type="submit" size="md" className="h-11 sm:w-auto">
                <Search className="size-4" aria-hidden="true" />
                Lacak status
              </Button>
            </div>
          </form>

          <div className="mt-8">
            {errorMessage ? (
              <div
                role="alert"
                className="rounded-xl border border-danger/25 bg-danger/5 p-4 text-xs leading-relaxed text-danger shadow-2xs"
              >
                {errorMessage}
              </div>
            ) : null}

            {feedback ? (
              <div className="space-y-6">
                {/* Visual Step Timeline Rail */}
                <div className="card-hover overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft">
                  <div className="flex items-center justify-between border-b border-border/80 pb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Progres penanganan</p>
                      <p className="font-display text-base font-bold text-text">Status Tiket #{feedback.tracking_code}</p>
                    </div>
                    {feedback.status === "resolved" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                        <CheckCircle2 className="size-3.5" /> Selesai
                      </span>
                    ) : feedback.status === "rejected" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                        Ditolak
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-interactive/10 px-3 py-1 text-xs font-semibold text-interactive">
                        <Clock3 className="size-3.5 animate-spin" /> Dalam proses
                      </span>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-2">
                    {stages.map((stage) => {
                      const isComplete = currentStage >= stage.step;
                      const isCurrent = currentStage === stage.step;
                      return (
                        <div key={stage.key} className="flex flex-col items-center text-center">
                          <div
                            className={`flex size-8 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                              isComplete
                                ? "border-interactive bg-interactive text-white shadow-xs"
                                : "border-border bg-surface-2 text-muted"
                            } ${isCurrent ? "ring-4 ring-interactive/20 animate-pulse" : ""}`}
                          >
                            {isComplete ? "✓" : stage.step}
                          </div>
                          <span
                            className={`mt-2 text-[10px] font-semibold sm:text-[11px] ${
                              isComplete ? "text-text" : "text-muted"
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <FeedbackCard feedback={feedback} />
              </div>
            ) : !code && !errorMessage ? (
              <EmptyState
                icon={Ticket}
                title="Masukkan kode pelacakan"
                description="Kode pelacakan unik diberikan setelah Anda mengirim aduan warga. Salin dan tempel di formulir di atas."
                action={
                  <Link href="/aduan/buat" className="text-xs font-semibold text-interactive hover:underline">
                    Buat aduan baru →
                  </Link>
                }
              />
            ) : null}

            <p className="mt-8 text-center text-xs text-muted">
              Punya akun warga TeraPublic?{" "}
              <Link href="/aduan/saya" className="font-semibold text-interactive hover:underline">
                Lihat daftar semua aduan Anda di dasbor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
