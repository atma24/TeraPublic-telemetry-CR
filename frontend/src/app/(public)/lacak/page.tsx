import type { Metadata } from "next";
import Link from "next/link";
import { Search, Ticket } from "lucide-react";

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

  return (
    <>
      <PageHeader
        eyebrow="Lacak aduan"
        title="Cek status laporan"
        description="Masukkan kode pelacakan yang Anda terima setelah mengirim aduan. Tidak perlu masuk ke akun."
        breadcrumbs={[{ label: "Lacak aduan" }]}
      />

      <div className="container-page py-8 md:py-10">
        <div className="mx-auto max-w-3xl">
          <form
            method="get"
            action="/lacak"
            className="rounded-lg border border-border bg-surface p-5 sm:p-6"
          >
            <label htmlFor="kode" className="text-xs font-semibold text-text">
              Kode pelacakan
            </label>
            <p className="mt-1 text-[11px] text-muted">Format contoh: TP-2026-ABC12</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="kode"
                name="kode"
                type="text"
                defaultValue={code}
                placeholder="TP-2026-ABC12"
                className={inputClass}
                autoComplete="off"
                spellCheck={false}
                required
              />
              <Button type="submit" className="sm:w-auto">
                <Search className="size-4" aria-hidden="true" />
                Lacak
              </Button>
            </div>
          </form>

          <div className="mt-6">
            {errorMessage ? (
              <div
                role="alert"
                className="rounded-md border border-danger/25 bg-danger/5 px-4 py-3 text-xs leading-relaxed text-danger"
              >
                {errorMessage}
              </div>
            ) : null}

            {feedback ? (
              <FeedbackCard feedback={feedback} />
            ) : !code && !errorMessage ? (
              <EmptyState
                icon={Ticket}
                title="Masukkan kode pelacakan"
                description="Kode diberikan setelah aduan berhasil dikirim. Simpan kode tersebut untuk memantau status."
                action={
                  <Link href="/aduan/buat" className="text-xs font-semibold text-interactive hover:underline">
                    Buat aduan baru
                  </Link>
                }
              />
            ) : null}

            <p className="mt-6 text-center text-[11px] text-muted">
              Punya akun?{" "}
              <Link href="/aduan/saya" className="font-semibold text-interactive hover:underline">
                Lihat seluruh aduan Anda
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
