import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { DATA_SOURCES, NAV_LINKS, SITE_TAGLINE } from "@/lib/constants";

const exploreLinks = [...NAV_LINKS, { href: "/data/fasilitas", label: "Direktori fasilitas" }];
const participationLinks = [
  { href: "/aduan/buat", label: "Buat aduan warga" },
  { href: "/aduan/saya", label: "Pantau aduan saya" },
  { href: "/lacak", label: "Lacak dengan kode" },
  { href: "/chatbot", label: "Tanya asisten data" },
  { href: "/login", label: "Masuk ke akun" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-wide">
        <div className="grid gap-10 py-12 md:grid-cols-[1.35fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-xs leading-relaxed text-muted">
              Ruang baca terbuka untuk fasilitas publik, anggaran, dan suara warga Jakarta. Setiap angka
              ditautkan ke sumber data yang dapat diperiksa.
            </p>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {SITE_TAGLINE}
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-text">Jelajahi</h2>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-text">Partisipasi</h2>
            <ul className="mt-4 space-y-2.5">
              {participationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Sumber data</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">{DATA_SOURCES.join(" · ")}</p>
            </div>
            <p className="max-w-md text-[11px] leading-relaxed text-muted">
              Data ditampilkan apa adanya dari layanan TeraPublic. Verifikasi dokumen resmi sebelum
              mengambil keputusan.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} TeraPublic. Data publik untuk Jakarta.</p>
            <p>
              Dibangun untuk keterbukaan informasi.{" "}
              <Link href="/tentang" className="font-semibold text-interactive hover:underline">
                Metodologi & sumber
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
