"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Compass,
  Eye,
  FileCheck,
  Landmark,
  Layers,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

import { FacilityMapClient } from "@/components/map/facility-map-dynamic";
import { ButtonLink } from "@/components/ui/button";
import { formatCompactRupiah, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardOverview, PublicFacility, RegionFeatureCollection } from "@/types/public";

interface CivicJourneyStepperProps {
  overview: DashboardOverview | null;
  facilities: PublicFacility[];
  regions: RegionFeatureCollection | null;
}

const STEPS = [
  {
    id: "pemetaan",
    number: "01",
    tabLabel: "Peta Fasilitas",
    stepBadge: "LANGKAH 01 · PEMETAAN & SEBARAN",
    title: "Fasilitas Publik Terdata, Akses Terbuka.",
    description:
      "Telusuri 214 sekolah negeri dan pasar tradisional di seluruh 44 kecamatan DKI Jakarta. Setiap titik diverifikasi dengan koordinat presisi dan status operasional resmi.",
    actionLabel: "Buka Direktori Peta Lengkap",
    actionHref: "/data",
    icon: MapPinned,
  },
  {
    id: "aksesibilitas",
    number: "02",
    tabLabel: "Audit Aksesibilitas",
    stepBadge: "LANGKAH 02 · STANDAR RAMAH WARGA",
    title: "Periksa Fasilitas Ramah Disabilitas & Lansia.",
    description:
      "Transparansi bukan sekadar ada atau tidaknya gedung, tetapi memastikan fasilitas publik dapat dimasuki dan digunakan oleh semua warga tanpa hambatan.",
    actionLabel: "Analisis Indeks Pemerataan",
    actionHref: "/insight",
    icon: ShieldCheck,
  },
  {
    id: "anggaran",
    number: "03",
    tabLabel: "Anggaran APBD",
    stepBadge: "LANGKAH 03 · ALOKASI & REALISASI",
    title: "Pantau Penyerapan Rp 35,47 T Anggaran Daerah.",
    description:
      "Lacak distribusi anggaran pembangunan fisik dan operasional per kota administrasi. Bandingkan antara rencana anggaran dan realisasi nyata di lapangan.",
    actionLabel: "Telusuri 1.731 Proyek APBD",
    actionHref: "/data?tab=anggaran",
    icon: Wallet,
  },
  {
    id: "aduan",
    number: "04",
    tabLabel: "Aduan Warga",
    stepBadge: "LANGKAH 04 · PARTISIPASI & PELACAKAN",
    title: "Suara Warga Menjadi Titik Data Terbuka.",
    description:
      "Temuan trotoar rusak atau fasilitas tidak ramah diubah menjadi tiket publik bernomor unik yang dapat dilacak progresnya hingga penanganan dinas terkait.",
    actionLabel: "Kirim Laporan Lapangan",
    actionHref: "/aduan/buat",
    icon: MessageSquare,
  },
] as const;

export function CivicJourneyStepper({
  overview,
  facilities,
  regions,
}: CivicJourneyStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "sekolah" | "pasar-tradisional">("all");
  const [isPaused, setIsPaused] = useState(false);
  const componentId = useId();

  // Invalidate Leaflet map size when returning to step 0
  useEffect(() => {
    if (activeStep === 0) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("resize"));
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  // Optional subtle auto-advance if user isn't hovering/interacting
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 11000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Filter facilities on the live map according to active category pill
  const filteredFacilities = facilities.filter((f) => {
    if (selectedCategory === "all") return true;
    return f.category?.slug === selectedCategory;
  });

  const currentStep = STEPS[activeStep];

  return (
    <section
      aria-label="Alur Keterbukaan Data TeraPublic"
      className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface to-surface-2/40 py-14 md:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="paper-grid absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="container-page relative">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-interactive/25 bg-interactive/8 px-3.5 py-1 text-xs font-semibold text-interactive backdrop-blur-sm">
            <Sparkles className="size-3.5 text-interactive" aria-hidden="true" />
            <span>ALUR KETERBUKAAN DATA · TERAPUBLIC × TELEMETRY-CR</span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.035em] text-text sm:text-3xl lg:text-4xl">
            Perjalanan Data: Dari Temuan Lapangan ke Transparansi Publik.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Ikuti bagaimana data fasilitas, standar aksesibilitas, alokasi APBD, dan partisipasi warga
            terhubung dalam ekosistem digital terbuka yang bisa diperiksa semua orang.
          </p>
        </div>

        {/* Two-Column Interactive Stage (Story Narrative Left + Visual Stage Right) */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch lg:gap-10">
          {/* LEFT: Contextual Narrative & Action Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all md:p-8">
            <div>
              {/* Step Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-interactive/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-interactive uppercase">
                  {currentStep.stepBadge}
                </span>
                <span className="tabular text-xs font-bold text-muted">
                  {activeStep + 1} / {STEPS.length}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-5 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-text md:text-3xl">
                {currentStep.title}
              </h3>
              <p className="mt-3.5 text-xs leading-relaxed text-muted sm:text-sm">
                {currentStep.description}
              </p>

              {/* Step-specific Interactive Context Widget */}
              <div className="mt-6 border-t border-border/80 pt-5">
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Filter Titik Peta Secara Langsung:
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("all")}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold transition-all",
                            selectedCategory === "all"
                              ? "bg-interactive text-white shadow-sm"
                              : "border border-border bg-surface-2 text-text hover:border-interactive/40",
                          )}
                        >
                          Semua ({facilities.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("sekolah")}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                            selectedCategory === "sekolah"
                              ? "bg-interactive text-white shadow-sm"
                              : "border border-border bg-surface-2 text-text hover:border-interactive/40",
                          )}
                        >
                          <Building2 className="size-3" />
                          Sekolah (196)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("pasar-tradisional")}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                            selectedCategory === "pasar-tradisional"
                              ? "bg-brand-amber text-brand-navy shadow-sm"
                              : "border border-border bg-surface-2 text-text hover:border-interactive/40",
                          )}
                        >
                          <Landmark className="size-3" />
                          Pasar (18)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-surface-2/40 p-3 text-xs">
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-semibold">Aktif di Peta</span>
                        <span className="font-display font-bold text-sm text-text">
                          {filteredFacilities.length} Fasilitas
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-semibold">Cakupan Wilayah</span>
                        <span className="font-display font-bold text-sm text-text">44 Kecamatan</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/40 p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-interactive/10 text-interactive">
                          <CheckCircle2 className="size-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-xs text-text">Ramp Kursi Roda</p>
                          <p className="text-[11px] text-muted">Kemiringan standar & pegangan pengaman</p>
                        </div>
                      </div>
                      <span className="tabular text-xs font-bold text-interactive">143 Fasilitas</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/40 p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-interactive/10 text-interactive">
                          <CheckCircle2 className="size-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-xs text-text">Jalur Pemandu (Guiding Block)</p>
                          <p className="text-[11px] text-muted">Ubin bertekstur bagi tunanetra</p>
                        </div>
                      </div>
                      <span className="tabular text-xs font-bold text-interactive">Tersedia</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/40 p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-interactive/10 text-interactive">
                          <CheckCircle2 className="size-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-xs text-text">Toilet Khusus Disabilitas</p>
                          <p className="text-[11px] text-muted">Lebar pintu min 90cm & handrail L</p>
                        </div>
                      </div>
                      <span className="tabular text-xs font-bold text-interactive">Tersedia</span>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/70 bg-surface-2/40 p-3.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted">Total Alokasi APBD</span>
                        <p className="mt-1 font-display text-lg font-bold text-text">
                          {overview ? formatCompactRupiah(overview.kpis.total_budget_allocated) : "Rp 35,47 T"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted">Tingkat Penyerapan</span>
                        <p className="mt-1 font-display text-lg font-bold text-interactive">
                          {overview ? formatPercent(overview.kpis.realization_percentage) : "4.58%"}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Tersebar di <strong>{overview?.kpis.total_projects ?? 1731} proyek pembangunan</strong>{" "}
                      sektor pendidikan, pasar rakyat, tata ruang, dan fasilitas transportasi.
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-interactive/30 bg-interactive/5 p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-interactive">#ADU-JKT-8492</span>
                        <span className="inline-flex items-center gap-1 rounded bg-interactive/20 px-2 py-0.5 text-[10px] font-bold text-interactive">
                          ● DITINDAKLANJUTI
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-text">
                        Kerusakan ubin taktil di trotoar depan sekolah
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        Respon dinas: <span className="font-semibold text-text">&lt; 24 jam kerja</span>
                      </p>
                    </div>
                    <p className="text-[11px] text-muted">
                      Setiap aduan warga langsung diverifikasi dan diteruskan ke sistem penanganan resmi.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-5 border-t border-border">
              <ButtonLink href={currentStep.actionHref} size="lg" className="w-full justify-between group">
                <span>{currentStep.actionLabel}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          {/* RIGHT: Visual Interactive Stage (Real Map on Step 0, High-End Visual Cards on others) */}
          <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
            {/* STAGE 0: THE REAL LEAFLET MAP */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                activeStep === 0 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              {/* Floating Real-Time Map Bar */}
              <div className="absolute top-3 inset-x-3 z-[400] flex items-center justify-between rounded-lg border border-border/80 bg-surface/90 px-3.5 py-2 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-interactive opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-interactive" />
                  </span>
                  <span className="font-display text-xs font-bold text-text">
                    Peta Interaktif DKI Jakarta
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-medium text-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 rounded-full bg-interactive" />
                    Sekolah
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 rounded-full bg-brand-amber" />
                    Pasar
                  </span>
                </div>
              </div>

              {/* The Real Leaflet Map */}
              <FacilityMapClient
                facilities={filteredFacilities}
                regions={regions}
                height="100%"
                ariaLabel="Peta interaktif fasilitas publik DKI Jakarta"
                showLegend={false}
              />
            </div>

            {/* STAGE 1: ACCESSIBILITY INSPECTOR */}
            <div
              className={cn(
                "absolute inset-0 p-6 sm:p-8 flex flex-col justify-between transition-opacity duration-500 overflow-y-auto",
                activeStep === 1 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      INSPEKTOR STANDAR AKSES
                    </span>
                    <h4 className="font-display text-lg font-bold text-text">
                      Hasil Evaluasi Aksesibilitas DKI Jakarta
                    </h4>
                  </div>
                  <span className="rounded-full bg-interactive/10 px-3 py-1 text-xs font-bold text-interactive">
                    66,8% Lolos Standar
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-surface-2/40 p-4 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-interactive/10 text-interactive">
                      <Building2 className="size-5" />
                    </div>
                    <p className="mt-3 font-display text-xl font-bold text-text">143</p>
                    <p className="mt-0.5 text-xs font-semibold text-text">Fasilitas Ramah</p>
                    <p className="mt-1 text-[10px] text-muted">Memiliki ramp & akses mandiri</p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-2/40 p-4 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-amber/15 text-brand-amber">
                      <ShieldCheck className="size-5" />
                    </div>
                    <p className="mt-3 font-display text-xl font-bold text-text">71</p>
                    <p className="mt-0.5 text-xs font-semibold text-text">Perlu Peningkatan</p>
                    <p className="mt-1 text-[10px] text-muted">Jalur pemandu belum lengkap</p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-2/40 p-4 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-interactive/10 text-interactive">
                      <Compass className="size-5" />
                    </div>
                    <p className="mt-3 font-display text-xl font-bold text-text">44</p>
                    <p className="mt-0.5 text-xs font-semibold text-text">Kecamatan Diaudit</p>
                    <p className="mt-1 text-[10px] text-muted">Tersebar di 6 wilayah kota</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-surface-2/30 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-text">
                    <span>Indeks Kesetaraan Akses DKI</span>
                    <span className="text-interactive font-bold">66.8 / 100</span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint w-[66.8%]" />
                  </div>
                  <p className="mt-2 text-[11px] text-muted leading-relaxed">
                    Data diolah dari observasi lapangan fasilitas pendidikan negeri dan pasar tradisional.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                <span>Standar: Permen PUPR No. 14/PRT/M/2017</span>
                <Link href="/insight" className="font-semibold text-interactive hover:underline inline-flex items-center gap-1">
                  Buka data lengkap <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* STAGE 2: APBD BUDGET LEDGER */}
            <div
              className={cn(
                "absolute inset-0 p-6 sm:p-8 flex flex-col justify-between transition-opacity duration-500 overflow-y-auto",
                activeStep === 2 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      LEMBAR DATA APBD 2024–2026
                    </span>
                    <h4 className="font-display text-lg font-bold text-text">
                      Distribusi Alokasi & Realisasi per Kota
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-interactive">
                    Total: Rp 35,47 Triliun
                  </span>
                </div>

                {/* 6 City Bars */}
                <div className="mt-5 space-y-3.5">
                  {overview?.city_breakdown ? (
                    overview.city_breakdown.slice(0, 5).map((city) => (
                      <div key={city.city} className="rounded-lg border border-border/70 bg-surface-2/40 p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-text">{city.city}</span>
                          <span className="font-mono font-bold text-text">
                            {formatCompactRupiah(city.budget_allocated)}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint"
                            style={{ width: `${Math.min(100, Math.max(5, city.realization_rate * 4))}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted">
                          <span>Realisasi: {formatCompactRupiah(city.budget_realized)}</span>
                          <span className="font-semibold text-interactive">
                            {formatPercent(city.realization_rate)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted">Memuat data alokasi kota...</p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                <span>Sumber: Dokumen Resmi APBD DKI Jakarta</span>
                <Link href="/data?tab=anggaran" className="font-semibold text-interactive hover:underline inline-flex items-center gap-1">
                  Semua proyek APBD <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* STAGE 3: CITIZEN REPORTING TICKET */}
            <div
              className={cn(
                "absolute inset-0 p-6 sm:p-8 flex flex-col justify-between transition-opacity duration-500 overflow-y-auto",
                activeStep === 3 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      SIMULASI TIKET LAPANGAN
                    </span>
                    <h4 className="font-display text-lg font-bold text-text">
                      Alur Pelaporan & Verifikasi Publik
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-interactive/30 bg-interactive/10 px-2.5 py-0.5 text-[10px] font-semibold text-interactive">
                    <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
                    Transparan
                  </span>
                </div>

                <div className="mt-5 rounded-xl border border-border bg-surface-2/30 p-5">
                  <div className="flex items-center justify-between border-b border-border/70 pb-3">
                    <span className="font-mono text-sm font-bold text-text">KODE: #ADU-JKT-8492</span>
                    <span className="rounded bg-interactive/15 px-2 py-0.5 text-[10px] font-bold text-interactive">
                      STATUS: DITINDAKLANJUTI
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <p className="text-sm font-semibold text-text">Jalur Pemandu Tunanetra Rusak di Trotoar</p>
                    <p className="text-xs text-muted">Jl. Salemba Raya, Jakarta Pusat · Fasilitas Pejalan Kaki</p>
                  </div>

                  {/* 4 Steps timeline */}
                  <div className="mt-6 space-y-3 border-t border-border/70 pt-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-text">Laporan Terkirim oleh Warga</p>
                        <p className="text-[10px] text-muted">Disertai foto bukti lapangan & koordinat GPS otomatis</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-text">Terverifikasi oleh Administrator</p>
                        <p className="text-[10px] text-muted">Divalidasi ke dalam kategori kerusakan fasilitas</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-interactive text-white text-[10px] font-bold mt-0.5 animate-pulse">
                        ●
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-interactive">Diteruskan ke Dinas Terkait (Proses)</p>
                        <p className="text-[10px] text-muted">Instruksi perbaikan ke Suku Dinas Bina Marga setempat</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                <span>Semua laporan terbuka di dashboard</span>
                <Link href="/lacak" className="font-semibold text-interactive hover:underline inline-flex items-center gap-1">
                  Uji kode pelacakan <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STEPPER TRACK (Matching the reference video's timeline navigation) */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-4 shadow-soft md:p-6">
          <div className="relative">
            {/* Connecting Track Line */}
            <div
              className="absolute left-6 right-6 top-5 hidden h-0.5 bg-border md:block"
              aria-hidden="true"
            >
              <div
                className="h-full bg-interactive transition-all duration-500 ease-out"
                style={{
                  width: `${(activeStep / (STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stepper Buttons */}
            <div
              role="tablist"
              aria-label="Pilihan langkah keterbukaan data"
              className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
            >
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const isPast = activeStep >= idx;
                const Icon = step.icon;

                return (
                  <button
                    key={step.id}
                    id={`${componentId}-tab-${step.id}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${componentId}-panel-${step.id}`}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "group relative flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all",
                      isActive
                        ? "bg-interactive/10 border-2 border-interactive shadow-sm md:bg-surface md:border-transparent"
                        : "border border-border/70 bg-surface-2/40 hover:bg-surface-2 hover:border-interactive/30 md:border-transparent md:bg-transparent",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "relative z-10 flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm",
                          isActive
                            ? "bg-interactive text-white ring-4 ring-interactive/20"
                            : isPast
                              ? "bg-interactive text-white"
                              : "border border-border bg-surface text-muted group-hover:border-interactive/40",
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <span className="tabular text-xs font-bold text-muted group-hover:text-text">
                        {step.number}
                      </span>
                    </div>

                    <div className="mt-1">
                      <p
                        className={cn(
                          "font-display text-xs font-bold transition-colors md:text-sm",
                          isActive ? "text-interactive" : "text-text group-hover:text-interactive",
                        )}
                      >
                        {step.tabLabel}
                      </p>
                      <p className="hidden text-[10px] text-muted md:block mt-0.5">
                        {idx === 0 && "214 titik peta nyata"}
                        {idx === 1 && "Standar ramah disabilitas"}
                        {idx === 2 && "APBD Rp 35,47 Triliun"}
                        {idx === 3 && "Tiket pelacakan warga"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
