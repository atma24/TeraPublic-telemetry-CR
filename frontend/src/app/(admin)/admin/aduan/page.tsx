import Link from "next/link";
import { MessageSquare, RefreshCw } from "lucide-react";

import { FeedbackRespondButton } from "@/components/admin/feedback-respond-button";
import { FeedbackCard } from "@/components/feedback/feedback-card";
import { Button } from "@/components/ui/button";
import { selectClass } from "@/components/ui/form";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { getAdminFeedbacks } from "@/lib/api/admin";
import { requireAdmin } from "@/lib/auth/session";
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from "@/lib/constants";

export const metadata = { title: "Aduan Warga" };

const PER_PAGE = 10;

export default async function AdminFeedbacksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; category?: string }>;
}) {
  const session = await requireAdmin("/admin/aduan");
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || 1) || 1);
  const status = params.status?.trim() ?? "";
  const category = params.category?.trim() ?? "";

  let response;
  try {
    response = await getAdminFeedbacks(session.token, {
      page,
      per_page: PER_PAGE,
      status: status || undefined,
      category: category || undefined,
    });
  } catch {
    return (
      <div className="mx-auto max-w-[1100px] space-y-5">
        <div>
          <p className="eyebrow">Partisipasi warga</p>
          <h1 className="display-3 mt-2 text-text">Aduan Warga</h1>
        </div>
        <ErrorState
          title="Daftar aduan belum dapat dimuat"
          description="Backend menolak atau tidak merespons permintaan daftar aduan admin."
          action={
            <a
              href="/admin/aduan"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-text hover:bg-surface-2"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Muat ulang
            </a>
          }
        />
      </div>
    );
  }

  const feedbacks = response.data;
  const total = response.meta.total;
  const lastPage = response.meta.last_page ?? Math.max(1, Math.ceil(total / PER_PAGE));
  const hasFilter = Boolean(status || category);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <p className="eyebrow">Partisipasi warga</p>
        <h1 className="display-3 mt-2 text-text">Aduan Warga</h1>
        <p className="mt-1.5 text-sm text-muted">
          {total.toLocaleString("id-ID")} aduan pada sistem. Verifikasi laporan dan tuliskan tanggapan yang dapat
          dibaca pelapor.
        </p>
      </div>

      <form
        action="/admin/aduan"
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3"
      >
        <select
          name="status"
          defaultValue={status}
          aria-label="Filter status aduan"
          className={`${selectClass} h-9 w-auto min-w-44 text-xs`}
        >
          <option value="">Semua status</option>
          {Object.entries(FEEDBACK_STATUS).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={category}
          aria-label="Filter kategori aduan"
          className={`${selectClass} h-9 w-auto min-w-48 text-xs`}
        >
          <option value="">Semua kategori</option>
          {Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" size="sm">
          Terapkan
        </Button>
        {hasFilter ? (
          <Link href="/admin/aduan" className="text-[11px] font-semibold text-muted hover:text-text hover:underline">
            Reset
          </Link>
        ) : null}
      </form>

      {feedbacks.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={hasFilter ? "Tidak ada aduan pada filter ini" : "Belum ada aduan warga"}
          description={
            hasFilter
              ? "Coba status atau kategori lain, atau kembali ke seluruh aduan."
              : "Aduan yang dikirim melalui portal warga akan muncul di sini."
          }
          action={
            hasFilter ? (
              <Link href="/admin/aduan" className="text-xs font-semibold text-interactive hover:underline">
                Hapus filter
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              showCitizen
              actions={<FeedbackRespondButton feedback={feedback} />}
            />
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/aduan"
        currentPage={page}
        lastPage={lastPage}
        query={{ status: status || undefined, category: category || undefined }}
      />
    </div>
  );
}
