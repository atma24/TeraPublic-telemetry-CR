import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardList, Clock3, MessageSquare, Plus } from "lucide-react";

import { FeedbackCard } from "@/components/feedback/feedback-card";
import { ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { StatCard } from "@/components/ui/stat-card";
import { getMyFeedbacks } from "@/lib/api/public";
import { isApiError } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { FEEDBACK_STATUS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { firstParam } from "@/lib/utils";
import type { SearchParams } from "@/types/api";
import type { CitizenFeedback } from "@/types/public";

export const metadata: Metadata = {
  title: "Aduan Saya",
  description: "Pantau status dan tindak lanjut aduan fasilitas publik yang Anda kirim.",
};

const filterOptions = [
  { value: "", label: "Semua" },
  { value: "submitted", label: FEEDBACK_STATUS.submitted.label },
  { value: "verified", label: FEEDBACK_STATUS.verified.label },
  { value: "in_review", label: FEEDBACK_STATUS.in_review.label },
  { value: "resolved", label: FEEDBACK_STATUS.resolved.label },
  { value: "rejected", label: FEEDBACK_STATUS.rejected.label },
] as const;

export default async function MyFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireSession("/aduan/saya");
  const params = await searchParams;
  const statusFilter = firstParam(params.status) ?? "";
  const createdCode = firstParam(params.baru);

  let feedbacks: CitizenFeedback[] = [];
  let loadError: string | null = null;

  try {
    const response = await getMyFeedbacks(session.token);
    feedbacks = response.data;
  } catch (error) {
    loadError = isApiError(error)
      ? error.status === 401
        ? "Sesi Anda sudah berakhir. Silakan masuk kembali."
        : error.message
      : "Aduan belum dapat dimuat.";
  }

  const resolved = feedbacks.filter((item) => item.status === "resolved").length;
  const active = feedbacks.filter((item) =>
    ["submitted", "verified", "in_review"].includes(item.status),
  ).length;
  const filtered =
    statusFilter && statusFilter in FEEDBACK_STATUS
      ? feedbacks.filter((item) => item.status === statusFilter)
      : feedbacks;

  return (
    <>
      <PageHeader
        eyebrow="Portal warga"
        title="Aduan saya"
        description="Pantau status laporan yang Anda kirim, baca tanggapan admin, dan simpan kode pelacakan."
        breadcrumbs={[{ label: "Aduan saya" }]}
        actions={
          <ButtonLink href="/aduan/buat" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            Buat aduan
          </ButtonLink>
        }
      />

      <div className="container-page py-8 md:py-10">
        {createdCode ? (
          <div className="mb-6 flex flex-col gap-4 rounded-lg border border-success/25 bg-success/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text">Aduan berhasil dikirim</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Simpan kode ini untuk melacak aduan:{" "}
                  <code className="rounded-sm bg-surface px-1.5 py-0.5 font-mono text-[11px] font-semibold text-text">
                    {createdCode}
                  </code>
                </p>
              </div>
            </div>
            <CopyButton value={createdCode} label="Salin kode" />
          </div>
        ) : null}

        {loadError ? (
          <ErrorState
            title="Aduan belum dapat dimuat"
            description={loadError}
            action={
              <ButtonLink href="/login?next=/aduan/saya" variant="secondary" size="sm">
                Masuk ulang
              </ButtonLink>
            }
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Total aduan" value={formatNumber(feedbacks.length)} icon={ClipboardList} />
              <StatCard label="Sedang diproses" value={formatNumber(active)} icon={Clock3} tone="warning" />
              <StatCard label="Selesai" value={formatNumber(resolved)} icon={CheckCircle2} tone="accent" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-1.5">
              {filterOptions.map((option) => {
                const href = option.value ? `/aduan/saya?status=${option.value}` : "/aduan/saya";
                const activeFilter = statusFilter === option.value;
                return (
                  <Link
                    key={option.value || "all"}
                    href={href}
                    className={`inline-flex h-8 items-center rounded-md border px-2.5 text-[11px] font-semibold transition-colors ${
                      activeFilter
                        ? "border-interactive bg-interactive text-bg"
                        : "border-border bg-surface text-muted hover:text-text"
                    }`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 space-y-3">
              {filtered.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                className="mt-4"
                title={statusFilter ? "Tidak ada aduan pada status ini" : "Belum ada aduan"}
                description={
                  statusFilter
                    ? "Coba pilih status lain atau lihat seluruh aduan Anda."
                    : "Mulai dengan melaporkan kerusakan fasilitas atau hambatan akses di sekitar Anda."
                }
                action={
                  <ButtonLink href={statusFilter ? "/aduan/saya" : "/aduan/buat"} size="sm">
                    {statusFilter ? "Lihat semua aduan" : "Buat aduan pertama"}
                  </ButtonLink>
                }
              />
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
