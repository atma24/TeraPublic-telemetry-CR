"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Compass,
  Landmark,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { FacilityMapClient } from "@/components/map/facility-map-dynamic";
import { ButtonLink } from "@/components/ui/button";
import { useLanguage } from "@/components/i18n/language-provider";
import { formatCompactRupiah, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DashboardOverview, PublicFacility, RegionFeatureCollection } from "@/types/public";

interface CivicJourneyStepperProps {
  overview: DashboardOverview | null;
  facilities: PublicFacility[];
  regions: RegionFeatureCollection | null;
}

export function CivicJourneyStepper({
  overview,
  facilities,
  regions,
}: CivicJourneyStepperProps) {
  const { language } = useLanguage();
  const isEn = language === "en";

  const steps = [
    {
      id: "pemetaan",
      number: "01",
      tabLabel: isEn ? "Facility Map" : "Peta Fasilitas",
      stepBadge: isEn ? "STEP 01 · MAPPING & COVERAGE" : "LANGKAH 01 · PEMETAAN & SEBARAN",
      title: isEn ? "Public Facilities Mapped, Transparent Access." : "Fasilitas Publik Terdata, Akses Terbuka.",
      description: isEn
        ? "Explore 214 public schools and traditional markets across all 44 districts in DKI Jakarta. Each location is verified with precise coordinates and official operational status."
        : "Telusuri 214 sekolah negeri dan pasar tradisional di seluruh 44 kecamatan DKI Jakarta. Setiap titik diverifikasi dengan koordinat presisi dan status operasional resmi.",
      actionLabel: isEn ? "Open Full Interactive Map" : "Buka Direktori Peta Lengkap",
      actionHref: "/data",
      icon: MapPinned,
      sublabel: isEn ? "214 real map points" : "214 titik peta nyata",
    },
    {
      id: "aksesibilitas",
      number: "02",
      tabLabel: isEn ? "Accessibility Audit" : "Audit Aksesibilitas",
      stepBadge: isEn ? "STEP 02 · CITIZEN INCLUSION STANDARDS" : "LANGKAH 02 · STANDAR RAMAH WARGA",
      title: isEn ? "Check Disability & Senior-Friendly Facilities." : "Periksa Fasilitas Ramah Disabilitas & Lansia.",
      description: isEn
        ? "Transparency isn't just about buildings existing, but ensuring public facilities can be safely accessed and used by all citizens without barriers."
        : "Transparansi bukan sekadar ada atau tidaknya gedung, tetapi memastikan fasilitas publik dapat dimasuki dan digunakan oleh semua warga tanpa hambatan.",
      actionLabel: isEn ? "Analyze Regional Equity Index" : "Analisis Indeks Pemerataan",
      actionHref: "/analitik",
      icon: ShieldCheck,
      sublabel: isEn ? "Disability inclusion standards" : "Standar ramah disabilitas",
    },
    {
      id: "anggaran",
      number: "03",
      tabLabel: isEn ? "APBD Budget" : "Anggaran APBD",
      stepBadge: isEn ? "STEP 03 · ALLOCATION & EXECUTION" : "LANGKAH 03 · ALOKASI & REALISASI",
      title: isEn ? "Monitor Trillions in Regional Infrastructure Budgets." : "Pantau Penyerapan Rp 35,47 T Anggaran Daerah.",
      description: isEn
        ? "Track the distribution of physical and operational budgets per administrative city. Compare planned allocations against actual field execution."
        : "Lacak distribusi anggaran pembangunan fisik dan operasional per kota administrasi. Bandingkan antara rencana anggaran dan realisasi nyata di lapangan.",
      actionLabel: isEn ? "Explore 1,731 APBD Projects" : "Telusuri 1.731 Proyek APBD",
      actionHref: "/data?tab=anggaran",
      icon: Wallet,
      sublabel: isEn ? "Rp 35.47 T APBD Budget" : "APBD Rp 35,47 Triliun",
    },
    {
      id: "aduan",
      number: "04",
      tabLabel: isEn ? "Citizen Feedback" : "Aduan Warga",
      stepBadge: isEn ? "STEP 04 · PARTICIPATION & TRACKING" : "LANGKAH 04 · PARTISIPASI & PELACAKAN",
      title: isEn ? "Citizen Voices Become Open Data Points." : "Suara Warga Menjadi Titik Data Terbuka.",
      description: isEn
        ? "Damaged sidewalks or inaccessible facilities are converted into unique public tracking tickets, monitored until resolved by relevant municipal agencies."
        : "Temuan trotoar rusak atau fasilitas tidak ramah diubah menjadi tiket publik bernomor unik yang dapat dilacak progresnya hingga penanganan dinas terkait.",
      actionLabel: isEn ? "Submit Field Report" : "Kirim Laporan Lapangan",
      actionHref: "/aduan/buat",
      icon: MessageSquare,
      sublabel: isEn ? "Citizen tracking tickets" : "Tiket pelacakan warga",
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "sekolah" | "pasar-tradisional">("all");
  const [isPaused, setIsPaused] = useState(false);
  const componentId = useId();

  useEffect(() => {
    if (activeStep === 0) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("resize"));
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isPaused, steps.length]);

  const filteredFacilities = facilities.filter((f) => {
    if (selectedCategory === "all") return true;
    return f.category?.slug === selectedCategory;
  });

  const currentStep = steps[activeStep];

  return (
    <section
      aria-label={isEn ? "TeraPublic Data Transparency Pipeline" : "Alur Keterbukaan Data TeraPublic"}
      className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface to-surface-2/40 py-10 md:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="paper-grid absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="container-page relative">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-interactive/25 bg-interactive/8 px-3 py-1 text-[11px] font-semibold text-interactive backdrop-blur-sm sm:px-3.5 sm:text-xs">
            <Sparkles className="size-3.5 text-interactive" aria-hidden="true" />
            <span>{isEn ? "DATA TRANSPARENCY PIPELINE · TERAPUBLIC" : "ALUR KETERBUKAAN DATA · TERAPUBLIC"}</span>
          </div>
          <h2 className="mt-3.5 font-display text-xl font-bold tracking-[-0.03em] text-text sm:text-3xl lg:text-4xl">
            {isEn
              ? "Data Journey: From Ground Findings to Public Transparency."
              : "Perjalanan Data: Dari Temuan Lapangan ke Transparansi Publik."}
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed text-muted sm:text-sm sm:leading-relaxed">
            {isEn
              ? "Follow how facility data, accessibility standards, APBD budgets, and citizen participation connect into an open digital ecosystem anyone can inspect."
              : "Ikuti bagaimana data fasilitas, standar aksesibilitas, alokasi APBD, dan partisipasi warga terhubung dalam ekosistem digital terbuka yang bisa diperiksa semua orang."}
          </p>
        </div>

        {/* Two-Column Interactive Stage */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch lg:gap-10 sm:mt-10">
          {/* LEFT: Contextual Narrative & Action Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all sm:p-6 md:p-8">
            <div>
              {/* Step Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-interactive/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-interactive uppercase sm:px-2.5 sm:py-1 sm:text-[11px]">
                  {currentStep.stepBadge}
                </span>
                <span className="tabular text-xs font-bold text-muted">
                  {activeStep + 1} / {steps.length}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-[-0.025em] text-text sm:text-2xl sm:leading-tight md:text-3xl">
                {currentStep.title}
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-muted sm:mt-3.5 sm:text-sm">
                {currentStep.description}
              </p>

              {/* Step-specific Interactive Context Widget */}
              <div className="mt-5 border-t border-border/80 pt-4 sm:mt-6 sm:pt-5">
                {activeStep === 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted sm:text-[11px]">
                        {isEn ? "Filter Live Map Markers:" : "Filter Titik Peta Secara Langsung:"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-2.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("all")}
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs",
                            selectedCategory === "all"
                              ? "bg-interactive text-white shadow-sm"
                              : "border border-border bg-surface-2 text-text hover:border-interactive/40",
                          )}
                        >
                          {isEn ? `All (${facilities.length})` : `Semua (${facilities.length})`}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("sekolah")}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs",
                            selectedCategory === "sekolah"
                              ? "bg-interactive text-white shadow-sm"
                              : "border border-border bg-surface-2 text-text hover:border-interactive/40",
                          )}
                        >
                          <Building2 className="size-3" />
                          {isEn ? "Schools (196)" : "Sekolah (196)"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory("pasar-tradisional")}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs",
                            selectedCategory === "pasar-tradisional"
                              ? "bg-brand-amber text-brand-navy shadow-sm"
                              : "border border-border bg-surface-2 text-text hover:border-interactive/40",
                          )}
                        >
                          <Landmark className="size-3" />
                          {isEn ? "Markets (18)" : "Pasar (18)"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 rounded-lg border border-border/60 bg-surface-2/40 p-2.5 text-xs sm:gap-3 sm:p-3">
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-semibold">
                          {isEn ? "Active on Map" : "Aktif di Peta"}
                        </span>
                        <span className="font-display font-bold text-xs sm:text-sm text-text">
                          {filteredFacilities.length} {isEn ? "Facilities" : "Fasilitas"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-semibold">
                          {isEn ? "Regional Coverage" : "Cakupan Wilayah"}
                        </span>
                        <span className="font-display font-bold text-xs sm:text-sm text-text">
                          44 {isEn ? "Districts" : "Kecamatan"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/40 p-2.5 sm:p-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-md bg-interactive/10 text-interactive">
                          <CheckCircle2 className="size-3.5 sm:size-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-xs text-text">{isEn ? "Wheelchair Ramp" : "Ramp Kursi Roda"}</p>
                          <p className="text-[10px] sm:text-[11px] text-muted">
                            {isEn ? "Standard slope & safe handrails" : "Kemiringan standar & pegangan aman"}
                          </p>
                        </div>
                      </div>
                      <span className="tabular text-[11px] sm:text-xs font-bold text-interactive shrink-0">
                        143 {isEn ? "Sites" : "Titik"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-2/40 p-2.5 sm:p-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-md bg-interactive/10 text-interactive">
                          <CheckCircle2 className="size-3.5 sm:size-4" />
                        </span>
                        <div>
                          <p className="font-semibold text-xs text-text">{isEn ? "Accessible Restrooms" : "Toilet Disabilitas"}</p>
                          <p className="text-[10px] sm:text-[11px] text-muted">
                            {isEn ? "Wide doors & self-support grab bars" : "Pintu lebar & tuas pegangan mandiri"}
                          </p>
                        </div>
                      </div>
                      <span className="tabular text-[11px] sm:text-xs font-bold text-interactive shrink-0">
                        86 {isEn ? "Sites" : "Titik"}
                      </span>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="rounded-lg border border-border/70 bg-surface-2/40 p-2.5 sm:p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text">
                          {isEn ? "DKI APBD Budget Realization Ratio" : "Rasio Penyerapan APBD DKI"}
                        </span>
                        <span className="font-bold text-interactive">
                          66,8% {isEn ? "Executed" : "Realisasi"}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint w-[66.8%]" />
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted leading-relaxed">
                      {isEn
                        ? "Compare budget allocations and physical progress per procurement package to prevent stalled civic projects."
                        : "Lacak komparasi alokasi dana dan progres fisik per paket tender untuk mencegah proyek mangkrak."}
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="rounded-lg border border-interactive/30 bg-interactive/5 p-2.5 sm:p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-interactive text-[11px] sm:text-xs">#ADU-JKT-8492</span>
                        <span className="inline-flex items-center gap-1 rounded bg-interactive/20 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-interactive">
                          ● {isEn ? "IN PROGRESS" : "DITINDAKLANJUTI"}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-text">
                        {isEn
                          ? "Damaged tactile paving on sidewalk in front of public school"
                          : "Kerusakan ubin taktil di trotoar depan sekolah"}
                      </p>
                      <p className="mt-1 text-[10px] sm:text-[11px] text-muted">
                        {isEn ? "Agency response:" : "Respon dinas:"}{" "}
                        <span className="font-semibold text-text">{isEn ? "< 24 business hours" : "< 24 jam kerja"}</span>
                      </p>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted">
                      {isEn
                        ? "Every citizen report is verified and routed directly to official municipal maintenance systems."
                        : "Setiap aduan warga langsung diverifikasi dan diteruskan ke sistem penanganan resmi."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-border sm:mt-8 sm:pt-5">
              <ButtonLink href={currentStep.actionHref} size="lg" className="w-full justify-between group">
                <span className="truncate">{currentStep.actionLabel}</span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          {/* RIGHT: Visual Interactive Stage */}
          <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
            {/* STAGE 0: THE REAL LEAFLET MAP */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                activeStep === 0 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              {/* Floating Real-Time Map Bar */}
              <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-3 z-[400] flex items-center justify-between rounded-lg border border-border/80 bg-surface/90 px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-interactive opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-interactive" />
                  </span>
                  <span className="font-display text-[11px] sm:text-xs font-bold text-text">
                    {isEn ? "DKI Interactive Map" : "Peta Interaktif DKI"}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-medium text-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 rounded-full bg-interactive" />
                    {isEn ? "Schools" : "Sekolah"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="size-2 rounded-full bg-brand-amber" />
                    {isEn ? "Markets" : "Pasar"}
                  </span>
                </div>
              </div>

              {/* The Real Leaflet Map */}
              <div className="h-full w-full">
                <FacilityMapClient
                  facilities={filteredFacilities}
                  regions={regions}
                  height="100%"
                  ariaLabel={isEn ? "Interactive map of DKI Jakarta public facilities" : "Peta interaktif fasilitas publik DKI Jakarta"}
                  showLegend={false}
                />
              </div>
            </div>

            {/* STAGE 1: ACCESSIBILITY INSPECTOR */}
            <div
              className={cn(
                "absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-opacity duration-500 overflow-y-auto",
                activeStep === 1 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 sm:pb-4">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted">
                      {isEn ? "ACCESS STANDARDS INSPECTOR" : "INSPEKTOR STANDAR AKSES"}
                    </span>
                    <h4 className="font-display text-sm sm:text-lg font-bold text-text">
                      {isEn ? "DKI Accessibility Evaluation Results" : "Hasil Evaluasi Aksesibilitas DKI"}
                    </h4>
                  </div>
                  <span className="rounded-full bg-interactive/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold text-interactive">
                    {isEn ? "66.8% Met Standards" : "66,8% Lolos Standar"}
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="rounded-xl border border-border bg-surface-2/40 p-2 sm:p-4 text-center">
                    <div className="mx-auto flex size-7 sm:size-10 items-center justify-center rounded-full bg-interactive/10 text-interactive">
                      <Building2 className="size-3.5 sm:size-5" />
                    </div>
                    <p className="mt-1.5 sm:mt-3 font-display text-sm sm:text-xl font-bold text-text">143</p>
                    <p className="text-[10px] sm:text-xs font-semibold text-text">
                      {isEn ? "Accessible Sites" : "Fasilitas Ramah"}
                    </p>
                    <p className="hidden sm:block mt-1 text-[10px] text-muted">
                      {isEn ? "Ramp & independent access" : "Ramp & akses mandiri"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-2/40 p-2 sm:p-4 text-center">
                    <div className="mx-auto flex size-7 sm:size-10 items-center justify-center rounded-full bg-brand-amber/15 text-brand-amber">
                      <ShieldCheck className="size-3.5 sm:size-5" />
                    </div>
                    <p className="mt-1.5 sm:mt-3 font-display text-sm sm:text-xl font-bold text-text">71</p>
                    <p className="text-[10px] sm:text-xs font-semibold text-text">
                      {isEn ? "Needs Repair" : "Perlu Perbaikan"}
                    </p>
                    <p className="hidden sm:block mt-1 text-[10px] text-muted">
                      {isEn ? "Missing guiding paths" : "Jalur pemandu belum ada"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-2/40 p-2 sm:p-4 text-center">
                    <div className="mx-auto flex size-7 sm:size-10 items-center justify-center rounded-full bg-interactive/10 text-interactive">
                      <Compass className="size-3.5 sm:size-5" />
                    </div>
                    <p className="mt-1.5 sm:mt-3 font-display text-sm sm:text-xl font-bold text-text">44</p>
                    <p className="text-[10px] sm:text-xs font-semibold text-text">
                      {isEn ? "Districts" : "Kecamatan"}
                    </p>
                    <p className="hidden sm:block mt-1 text-[10px] text-muted">
                      {isEn ? "Across 6 administrative areas" : "Di 6 wilayah kota"}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 sm:mt-6 rounded-xl border border-border bg-surface-2/30 p-3 sm:p-4">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-text">
                    <span>{isEn ? "DKI Access Equality Index" : "Indeks Kesetaraan Akses DKI"}</span>
                    <span className="text-interactive font-bold">66.8 / 100</span>
                  </div>
                  <div className="mt-2 h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint w-[66.8%]" />
                  </div>
                  <p className="mt-2 text-[10px] sm:text-[11px] text-muted leading-relaxed">
                    {isEn
                      ? "Data processed from verified field observations of public schools and markets."
                      : "Data diolah dari observasi lapangan fasilitas pendidikan negeri dan pasar tradisional."}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-border pt-3 sm:pt-4 text-[11px] sm:text-xs text-muted">
                <span>{isEn ? "Standard: PUPR Ministerial Decree 14/2017" : "Standar: Permen PUPR No. 14/2017"}</span>
                <Link href="/analitik" className="font-semibold text-interactive hover:underline inline-flex items-center gap-1">
                  {isEn ? "Open full data" : "Buka data lengkap"} <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* STAGE 2: APBD BUDGET LEDGER */}
            <div
              className={cn(
                "absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-opacity duration-500 overflow-y-auto",
                activeStep === 2 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 sm:pb-4">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted">
                      {isEn ? "APBD BUDGET LEDGER 2024–2026" : "LEMBAR DATA APBD 2024–2026"}
                    </span>
                    <h4 className="font-display text-sm sm:text-lg font-bold text-text">
                      {isEn ? "City Allocation & Execution Distribution" : "Distribusi Alokasi & Realisasi Kota"}
                    </h4>
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-interactive">
                    Total: Rp 35,47 Triliun
                  </span>
                </div>

                {/* City Bars */}
                <div className="mt-3.5 sm:mt-5 space-y-2 sm:space-y-3">
                  {overview?.city_breakdown ? (
                    overview.city_breakdown.slice(0, 5).map((city, cIdx) => (
                      <div
                        key={city.city}
                        className={cn(
                          "rounded-lg border border-border/70 bg-surface-2/40 p-2 sm:p-3",
                          cIdx >= 3 && "hidden sm:block",
                        )}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-text truncate pr-2">{city.city}</span>
                          <span className="font-mono font-bold text-text shrink-0">
                            {formatCompactRupiah(city.budget_allocated)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-mint"
                            style={{ width: `${Math.min(100, Math.max(5, city.realization_rate * 4))}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-muted">
                          <span>{isEn ? "Executed:" : "Realisasi:"} {formatCompactRupiah(city.budget_realized)}</span>
                          <span className="font-semibold text-interactive">
                            {formatPercent(city.realization_rate)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted">
                      {isEn ? "Loading regional budget allocations..." : "Memuat data alokasi kota..."}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-border pt-3 text-[11px] sm:text-xs text-muted">
                <span>{isEn ? "Official DKI APBD Documents" : "Dokumen Resmi APBD DKI"}</span>
                <Link href="/data?tab=anggaran" className="font-semibold text-interactive hover:underline inline-flex items-center gap-1">
                  {isEn ? "All APBD projects" : "Semua proyek APBD"} <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* STAGE 3: CITIZEN REPORTING TICKET */}
            <div
              className={cn(
                "absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col justify-between transition-opacity duration-500 overflow-y-auto",
                activeStep === 3 ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 sm:pb-4">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted">
                      {isEn ? "FIELD TICKET SIMULATOR" : "SIMULASI TIKET LAPANGAN"}
                    </span>
                    <h4 className="font-display text-sm sm:text-lg font-bold text-text">
                      {isEn ? "Public Reporting & Verification Flow" : "Alur Pelaporan & Verifikasi Publik"}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-interactive/30 bg-interactive/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-interactive">
                    <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
                    {isEn ? "Transparent" : "Transparan"}
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-5 rounded-xl border border-border bg-surface-2/30 p-3.5 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border/70 pb-2.5 sm:pb-3">
                    <span className="font-mono text-xs font-bold text-text sm:text-sm">#ADU-JKT-8492</span>
                    <span className="rounded bg-interactive/15 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-interactive">
                      {isEn ? "IN PROGRESS" : "DITINDAKLANJUTI"}
                    </span>
                  </div>

                  <div className="mt-2.5 sm:mt-3.5 space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-text">
                      {isEn ? "Damaged Tactile Paving on Sidewalk" : "Jalur Pemandu Tunanetra Rusak di Trotoar"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted">
                      {isEn ? "Salemba Raya St, Central Jakarta · Pedestrian Facility" : "Jl. Salemba Raya, Jakarta Pusat · Fasilitas Pejalan Kaki"}
                    </p>
                  </div>

                  {/* 3 Steps timeline */}
                  <div className="mt-3.5 sm:mt-5 space-y-2 sm:space-y-3 border-t border-border/70 pt-3 sm:pt-4">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <span className="flex size-4 sm:size-5 shrink-0 items-center justify-center rounded-full bg-success text-white text-[9px] sm:text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <div>
                        <p className="text-[11px] sm:text-xs font-semibold text-text">
                          {isEn ? "Report Submitted by Citizen" : "Laporan Terkirim oleh Warga"}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-muted">
                          {isEn ? "Includes photo proof & GPS coordinates" : "Disertai foto bukti lapangan & koordinat GPS"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <span className="flex size-4 sm:size-5 shrink-0 items-center justify-center rounded-full bg-success text-white text-[9px] sm:text-[10px] font-bold mt-0.5">
                        ✓
                      </span>
                      <div>
                        <p className="text-[11px] sm:text-xs font-semibold text-text">
                          {isEn ? "Verified by Administrator" : "Terverifikasi oleh Administrator"}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-muted">
                          {isEn ? "Classified under physical infrastructure issue" : "Divalidasi ke kategori kerusakan fisik"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <span className="flex size-4 sm:size-5 shrink-0 items-center justify-center rounded-full bg-interactive text-white text-[9px] sm:text-[10px] font-bold mt-0.5 animate-pulse">
                        ●
                      </span>
                      <div>
                        <p className="text-[11px] sm:text-xs font-semibold text-interactive">
                          {isEn ? "Routed to Agency (Action in progress)" : "Diteruskan ke Suku Dinas (Proses)"}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-muted">
                          {isEn ? "Maintenance order sent to local Public Works agency" : "Instruksi perbaikan ke Bina Marga setempat"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-border pt-3 text-[11px] sm:text-xs text-muted">
                <span>{isEn ? "All reports open on public dashboard" : "Semua laporan terbuka di dashboard"}</span>
                <Link href="/lacak" className="font-semibold text-interactive hover:underline inline-flex items-center gap-1">
                  {isEn ? "Test ticket code" : "Uji kode tiket"} <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STEPPER TRACK */}
        <div className="mt-8 sm:mt-12 rounded-2xl border border-border bg-surface p-3 sm:p-4 md:p-6 shadow-soft">
          <div className="relative">
            {/* Connecting Track Line */}
            <div
              className="absolute left-6 right-6 top-5 hidden h-0.5 bg-border md:block"
              aria-hidden="true"
            >
              <div
                className="h-full bg-interactive transition-all duration-500 ease-out"
                style={{
                  width: `${(activeStep / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stepper Buttons */}
            <div
              role="tablist"
              aria-label={isEn ? "Data transparency steps" : "Pilihan langkah keterbukaan data"}
              className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4"
            >
              {steps.map((step, idx) => {
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
                      "group relative flex flex-col items-start gap-1.5 sm:gap-2 rounded-xl p-2.5 sm:p-3 text-left transition-all",
                      isActive
                        ? "bg-interactive/10 border-2 border-interactive shadow-sm md:bg-surface md:border-transparent"
                        : "border border-border/70 bg-surface-2/40 hover:bg-surface-2 hover:border-interactive/30 md:border-transparent md:bg-transparent",
                    )}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span
                        className={cn(
                          "relative z-10 flex size-7 sm:size-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm",
                          isActive
                            ? "bg-interactive text-white ring-2 sm:ring-4 ring-interactive/20"
                            : isPast
                              ? "bg-interactive text-white"
                              : "border border-border bg-surface text-muted group-hover:border-interactive/40",
                        )}
                      >
                        <Icon className="size-3 sm:size-3.5" />
                      </span>
                      <span className="tabular text-[11px] sm:text-xs font-bold text-muted group-hover:text-text">
                        {step.number}
                      </span>
                    </div>

                    <div className="mt-0.5 sm:mt-1 min-w-0">
                      <p
                        className={cn(
                          "font-display text-[11px] sm:text-xs font-bold transition-colors md:text-sm leading-tight truncate sm:whitespace-normal",
                          isActive ? "text-interactive" : "text-text group-hover:text-interactive",
                        )}
                      >
                        {step.tabLabel}
                      </p>
                      <p className="hidden text-[10px] text-muted md:block mt-0.5">
                        {step.sublabel}
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
