import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Search, Send, ShieldCheck } from "lucide-react";

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { PageHeader } from "@/components/ui/page-header";
import { getAllFacilities } from "@/lib/api/public";
import { requireSession } from "@/lib/auth/session";
import { firstParam } from "@/lib/utils";
import type { SearchParams } from "@/types/api";
import type { PublicFacility } from "@/types/public";

export const metadata: Metadata = {
  title: "Buat Aduan",
  description: "Laporkan kerusakan fasilitas atau hambatan akses di Jakarta melalui TeraPublic.",
};

const tips = [
  {
    icon: Search,
    title: "Sebut lokasi dengan jelas",
    body: "Nama fasilitas, patokan terdekat, atau koordinat membantu verifikasi lebih cepat.",
  },
  {
    icon: ClipboardCheck,
    title: "Jelaskan kondisi apa adanya",
    body: "Tuliskan apa yang rusak, sejak kapan, dan siapa yang paling terdampak.",
  },
  {
    icon: ShieldCheck,
    title: "Simpan kode pelacakan",
    body: "Kode unik diberikan setelah aduan terkirim dan dipakai untuk memantau status.",
  },
];

export default async function CreateFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireSession("/aduan/buat");
  const params = await searchParams;
  const requestedFacility = Number(firstParam(params.fasilitas) ?? 0);

  let facilities: PublicFacility[] = [];
  let facilitiesUnavailable = false;
  try {
    facilities = await getAllFacilities();
  } catch {
    facilitiesUnavailable = true;
  }

  return (
    <>
      <PageHeader
        eyebrow="Portal warga"
        title="Buat aduan"
        description="Sampaikan temuan di fasilitas publik. Laporan yang jelas membantu admin memverifikasi dan menindaklanjuti."
        breadcrumbs={[{ label: "Aduan saya", href: "/aduan/saya" }, { label: "Buat aduan" }]}
        widget={
          <div className="rounded-xl border border-border/80 bg-surface/90 p-4 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <ShieldCheck className="size-3.5 text-interactive" />
                Jaminan Transparansi
              </span>
              <span className="rounded-full bg-interactive/10 px-2 py-0.5 text-[10px] font-bold text-interactive">
                100% Terlindungi
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Identitas Anda dilindungi penuh. Deskripsi kerusakan diverifikasi dalam 1x24 jam untuk tindak lanjut dinas terkait.
            </p>
          </div>
        }
      />

      <div className="container-page py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <FeedbackForm
            facilities={facilities}
            defaultName={session.user.name}
            defaultEmail={session.user.email}
            defaultFacilityId={Number.isFinite(requestedFacility) ? requestedFacility : undefined}
            facilitiesUnavailable={facilitiesUnavailable}
          />

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-display text-sm font-semibold text-text">Agar laporan cepat ditindaklanjuti</h2>
              <ul className="mt-4 space-y-4">
                {tips.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <li key={tip.title} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-2 text-muted">
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-text">{tip.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{tip.body}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-display text-sm font-semibold text-text">Alur aduan</h2>
              <ol className="mt-4 space-y-3">
                {[
                  ["Diajukan", "Aduan masuk dan mendapat kode pelacakan."],
                  ["Diverifikasi", "Admin memeriksa kelengkapan dan lokasi."],
                  ["Ditindaklanjuti", "Laporan diteruskan ke pihak terkait."],
                  ["Selesai", "Tanggapan dan status akhir dicatat."],
                ].map(([title, body], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="tabular mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[9px] font-bold text-muted">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-xs font-semibold text-text">{title}</span>
                      <span className="block text-[11px] leading-relaxed text-muted">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-surface-2/60 p-5">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                <Send className="size-3.5" aria-hidden="true" />
                Lacak tanpa masuk
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Punya kode pelacakan? Buka halaman lacak untuk melihat status aduan.
              </p>
              <Link href="/lacak" className="mt-3 inline-flex text-[11px] font-semibold text-interactive hover:underline">
                Lacak aduan →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
