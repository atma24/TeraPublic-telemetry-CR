"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { useLanguage } from "@/components/i18n/language-provider";
import { DATA_SOURCES, SITE_TAGLINE, TEAM_NAME } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { language } = useLanguage();
  const isEn = language === "en";

  const exploreLinks = [
    { href: "/data", label: isEn ? "Public Data" : "Data Publik" },
    { href: "/layanan-publik", label: isEn ? "Services & Facilities" : "Layanan & Fasilitas" },
    { href: "/analitik", label: isEn ? "Analytics" : "Analitik" },
    { href: "/tentang", label: isEn ? "About" : "Tentang" },
    { href: "/data/fasilitas", label: isEn ? "Facility Directory" : "Direktori Fasilitas" },
  ];

  const participationLinks = [
    { href: "/aduan/buat", label: isEn ? "Submit Citizen Report" : "Buat aduan warga" },
    { href: "/aduan/saya", label: isEn ? "Track My Reports" : "Pantau aduan saya" },
    { href: "/lacak", label: isEn ? "Track with Code" : "Lacak dengan kode" },
    { href: "/chatbot", label: isEn ? "Ask Data Assistant" : "Tanya asisten data" },
    { href: "/login", label: isEn ? "Sign In" : "Masuk ke akun" },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-wide">
        <div className="grid gap-10 py-12 md:grid-cols-[1.35fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-xs leading-relaxed text-muted">
              {isEn
                ? "An open reading room for Jakarta's public facilities, budgets, and citizen voices. Every figure is linked to verifiable data sources."
                : "Ruang baca terbuka untuk fasilitas publik, anggaran, dan suara warga Jakarta. Setiap angka ditautkan ke sumber data yang dapat diperiksa."}
            </p>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[10px] font-medium text-muted">
                <span className="size-1.5 rounded-full bg-brand-teal" aria-hidden="true" />
                <strong className="font-semibold text-text">{TEAM_NAME}</strong>
              </span>
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {SITE_TAGLINE}
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-text">
              {isEn ? "Explore" : "Jelajahi"}
            </h2>
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
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-text">
              {isEn ? "Participation" : "Partisipasi"}
            </h2>
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {isEn ? "Data Sources" : "Sumber data"}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">{DATA_SOURCES.join(" · ")}</p>
            </div>
            <p className="max-w-md text-[11px] leading-relaxed text-muted">
              {isEn
                ? "Data is presented as-is from TeraPublic services. Verify official documents before making decisions."
                : "Data ditampilkan apa adanya dari layanan TeraPublic. Verifikasi dokumen resmi sebelum mengambil keputusan."}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} TeraPublic · {TEAM_NAME}. {isEn ? "Public data for Jakarta." : "Data publik untuk Jakarta."}
            </p>
            <p>
              {isEn ? "Developed by team " : "Dikembangkan oleh tim "}
              <strong className="font-semibold text-text">{TEAM_NAME}</strong>{" "}
              {isEn ? "for information transparency. " : "untuk keterbukaan informasi. "}
              <Link href="/tentang" className="font-semibold text-interactive hover:underline">
                {isEn ? "Methodology & sources" : "Metodologi & sumber"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
