import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { firstParam, safeNextPath } from "@/lib/utils";
import type { SearchParams } from "@/types/api";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun warga TeraPublic untuk mengirim aduan dan memantau tindak lanjut.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(firstParam(params.next), "/");

  return (
    <div className="animate-fade-in-up">
      {/* Kartu Floating Beranimasi */}
      <div className="card-hover relative overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-6 shadow-lift backdrop-blur-md sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-interactive/50 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-interactive/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-44 rounded-full bg-brand-mint/10 blur-2xl" aria-hidden="true" />

        <div className="relative mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-interactive/20 bg-interactive/5 px-2.5 py-1 text-[11px] font-semibold text-interactive shadow-2xs">
            <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
            Portal Masuk Warga & Petugas
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-text sm:text-3xl">
            Masuk ke TeraPublic
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
            Gunakan akun untuk mengirim aduan, memantau tindak lanjut perbaikan, dan bertanya pada asisten data.
          </p>
        </div>

        <div className="relative">
          <LoginForm nextPath={nextPath} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted">
        <ShieldCheck className="size-3.5 text-success" />
        <span>Sistem autentikasi terenkripsi & privasi warga terlindungi</span>
      </div>
    </div>
  );
}
