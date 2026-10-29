import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Database,
  Eye,
  FileCheck2,
  FilePlus2,
  Globe2,
  GraduationCap,
  Layers,
  Lock,
  MapPin,
  MapPinned,
  MessageSquare,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Wallet,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { DATA_SOURCES, SITE_TAGLINE, TEAM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tentang & Metodologi",
  description:
    "Metodologi keterbukaan, sumber data resmi, keterbatasan analitik, dan komitmen privasi TeraPublic oleh Telemetry-CR.",
};

const principles = [
  {
    number: "01",
    icon: Eye,
    title: "Terbaca, bukan sekadar tersedia",
    body: "Data publik disusun sebagai ruang baca terstruktur: ada konteks, satuan, pembanding, dan jejak sumber langsung. Bukan sekadar tabel mentah tanpa arah.",
    highlight: "Konteks & Makna",
  },
  {
    number: "02",
    icon: Scale,
    title: "Angka punya batas dan konteks",
    body: "Setiap metrik memuat batasan metodologisnya. Skor analitik tidak pernah digunakan untuk menghakimi individu, melainkan mengidentifikasi prioritas layanan.",
    highlight: "Integritas Metodologi",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Privasi dan keamanan warga dijaga",
    body: "Identitas personal pelapor dilindungi penuh dan tidak pernah dipublikasikan. Halaman publik hanya menampilkan statistik agregat temuan.",
    highlight: "Perlindungan Pelapor",
  },
];

const sources = [
  {
    layer: "Fasilitas Pendidikan",
    icon: GraduationCap,
    source: "Dapodik / Kemendikbudristek",
    period: "Data Pokok Pendidikan 2024",
    use: "Nama sekolah, titik koordinat, kapasitas daya tampung, status kepemilikan, dan indikator aksesibilitas fisik.",
    tag: "Pendidikan",
  },
  {
    layer: "Pasar Tradisional",
    icon: Store,
    source: "Perumda Pasar Jaya",
    period: "Direktori Pasar Rakyat 2024",
    use: "Sebaran pasar daerah, kapasitas kios/pedagang, profil fasilitas umum, dan status operasional.",
    tag: "Ekonomi Rakyat",
  },
  {
    layer: "Wilayah & Kependudukan",
    icon: Users,
    source: "BPS Provinsi DKI Jakarta",
    period: "DKI Jakarta Dalam Angka 2024",
    use: "Batas poligon kecamatan, kepadatan penduduk, proyeksi populasi, dan perhitungan rasio per 10.000 jiwa.",
    tag: "Demografi",
  },
  {
    layer: "Anggaran & Proyek Fisik",
    icon: Wallet,
    source: "APBD DKI Jakarta",
    period: "Tahun Anggaran 2024–2026",
    use: "Pagu alokasi per kegiatan, realisasi belanja, progres fisik proyek lapangan, SKPD pengampu, dan kontraktor pelaksana.",
    tag: "Keuangan Daerah",
  },
  {
    layer: "Partisipasi & Suara Warga",
    icon: MessageSquare,
    source: "Aduan Warga TeraPublic",
    period: "Real-time Verification",
    use: "Laporan kerusakan fasilitas di lapangan, hambatan akses disabilitas, kebersihan lingkungan, dan keterlambatan proyek.",
    tag: "Validasi Warga",
  },
];

const methodologySteps = [
  {
    step: "01",
    title: "Agregasi & Normalisasi Fasilitas",
    desc: "Jumlah fasilitas per kecamatan dihitung dan dinormalisasi terhadap populasi penduduk menjadi rasio per 10.000 jiwa.",
    formula: "Rasio = (Jumlah Fasilitas / Populasi Kecamatan) × 10.000",
  },
  {
    step: "02",
    title: "Audit Skor Aksesibilitas",
    desc: "Persentase ketersediaan atribut pendukung inklusi (ramp kursi roda, ubin pemandu tactile, toilet ramah disabilitas) pada seluruh fasilitas terdata.",
    formula: "Akses = (Fasilitas Berakses / Total Fasilitas) × 100%",
  },
  {
    step: "03",
    title: "Indeks Pemerataan Gabungan (Equity Index)",
    desc: "Kombinasi terbobot antara rasio ketersediaan fasilitas dan skor aksesibilitas, diskalakan 0–100 untuk memetakan urgensi penanganan.",
    formula: "Skor 0–100 (Semakin tinggi skor, semakin merata layanan)",
  },
  {
    step: "04",
    title: "Klasterisasi K-Means Wilayah",
    desc: "Algoritma machine learning mengelompokkan 44 kecamatan Jakarta ke dalam 3 tier intervensi berdasarkan kepadatan penduduk, rasio fasilitas, dan serapan anggaran.",
    formula: "K = 3 Cluster (Prioritas Kritis, Perlu Perhatian, Relatif Stabil)",
  },
  {
    step: "05",
    title: "Proyeksi Serapan Time-Series",
    desc: "Model time-series menganalisis riwayat penyerapan bulanan untuk memperkirakan serapan akhir tahun fiskal dan estimasi SiLPA.",
    formula: "Proyeksi Statistik Bulanan & Estimasi SiLPA Akhir Tahun",
  },
];

const limitations = [
  "Atribut aksesibilitas bersumber dari pencatatan administratif; kondisi kemiringan ramp atau kerusakan fisik di lapangan memerlukan verifikasi aduan warga.",
  "Data anggaran APBD dapat mengalami keterlambatan sinkronisasi dengan penerbitan Surat Perintah Pencairan Dana (SP2D) terbaru.",
  "Model proyeksi serapan anggaran adalah estimasi analitik statistik dengan margin galat, bukan keputusan anggaran resmi pemerintah.",
  "Kualitas kenyamanan, kebersihan harian, dan keramahan petugas fasilitas tidak sepenuhnya terukur dalam angka metrik kuantitatif.",
  "Aduan warga wajib melewati tahap peninjauan admin sebelum status penanganan diselesaikan secara resmi.",
];

const glossary = [
  {
    term: "Rasio per 10.000",
    badge: "Metrik Sebaran",
    desc: "Perbandingan jumlah fasilitas terhadap 10.000 penduduk kecamatan. Metrik ini menghilangkan bias populasi antara kecamatan padat dan lengang.",
  },
  {
    term: "Indeks Pemerataan",
    badge: "Skor Komposit",
    desc: "Nilai sintetis 0–100 yang menggabungkan kuantitas fasilitas dan kualitas inklusivitasnya. Wilayah di bawah ambang batas menjadi prioritas anggaran.",
  },
  {
    term: "Aksesibilitas Fisik",
    badge: "Inklusivitas",
    desc: "Tercatatnya setidaknya satu fasilitas ramah ragam disabilitas: ramp kursi roda, jalur pemandu kuning (tactile paving), atau toilet disabilitas.",
  },
  {
    term: "Realisasi APBD",
    badge: "Fiskal",
    desc: "Persentase dana yang telah dibelanjakan dan dicairkan secara akuntansi dibandingkan alokasi total yang direncanakan dalam DPA.",
  },
  {
    term: "Estimasi SiLPA",
    badge: "Analitik",
    desc: "Sisa Lebih Pembiayaan Anggaran yang diproyeksikan model machine learning jika tren serapan bulanan berjalan tanpa intervensi percepatan.",
  },
  {
    term: "Klaster K-Means",
    badge: "Machine Learning",
    desc: "Pengelompokan kecamatan dengan karakteristik multidimensi serupa untuk membantu perencana kebijakan menentukan formula intervensi spesifik.",
  },
];

const faqs = [
  {
    question: "Apakah TeraPublic situs resmi milik Pemprov DKI Jakarta?",
    answer:
      "TeraPublic adalah platform antarmuka data publik independen yang dibangun oleh tim Telemetry-CR. Seluruh data fasilitas dan anggaran dihubungkan ke sumber resmi pemerintah, namun dokumen hukum formal tetap merujuk pada instansi terkait.",
  },
  {
    question: "Mengapa sebuah sekolah tercatat memiliki akses padahal kondisi ramp di lapangan rusak?",
    answer:
      "Data atribut akses awal mencatat ketersediaan infrastruktur pada basis data Dapodik. Kondisi aktual seperti kerusakan struktur, kemiringan curam, atau terhalang pagar dapat dilaporkan langsung melalui formulir Aduan Warga agar dapat diperbarui.",
  },
  {
    question: "Apakah identitas saya aman saat mengirimkan aduan fasilitas?",
    answer:
      "Sangat aman. Platform TeraPublic menerapkan prinsip privasi pelapor ketat. Nama dan email Anda hanya digunakan untuk notifikasi akun pribadi dan verifikasi admin, tidak akan pernah ditampilkan pada direktori publik.",
  },
  {
    question: "Bagaimana cara membaca angka proyeksi anggaran pada halaman Insight?",
    answer:
      "Garis putus-putus pada grafik adalah hasil pemodelan deret waktu (time-series forecast) berbasis riwayat belanja bulanan tahun-tahun sebelumnya. Angka ini berfungsi sebagai peringatan dini mitigasi penyerapan anggaran, bukan angka realisasi final.",
  },
  {
    question: "Dari mana data batas poligon kecamatan peta digital berasal?",
    answer:
      "Batas administratif kecamatan DKI Jakarta menggunakan standar koordinat GeoJSON berbasis data spasial resmi Badan Pusat Statistik (BPS) dan geoportal Satu Data Indonesia.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Manifesto & Metodologi"
        title="Keterbukaan yang bisa dibaca dan ditelusuri"
        description="TeraPublic menyatukan data fasilitas publik, anggaran APBD, dan suara warga Jakarta dalam satu ruang baca terbuka yang ramah, transparan, dan dapat diuji oleh publik."
        breadcrumbs={[{ label: "Tentang" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/data" size="sm">
              Buka data publik
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/aduan/buat" variant="secondary" size="sm">
              Buat aduan warga
            </ButtonLink>
          </div>
        }
        widget={
          <div className="rounded-xl border border-border/80 bg-surface/90 p-4 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <ShieldCheck className="size-3.5 text-interactive" />
                Standar Terbuka
              </span>
              <span className="rounded-full bg-interactive/10 px-2 py-0.5 text-[10px] font-bold text-interactive">
                Open Access
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-3 text-xs text-muted">
              <span>GeoJSON WGS84</span>
              <span>·</span>
              <span>BPS & Dapodik</span>
              <span>·</span>
              <span>WIA MIA 2026</span>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted">
            <ShieldCheck className="size-3.5 text-interactive" /> Inisiatif {TEAM_NAME}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted">
            <Globe2 className="size-3.5 text-interactive" /> DKI Jakarta 2024–2026
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted">
            <Sparkles className="size-3.5 text-interactive" /> {SITE_TAGLINE}
          </span>
        </div>
      </PageHeader>

      <div className="container-page py-8 md:py-14 space-y-16">
        {/* 1. RIBBON HIGHLIGHT METRICS */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-2xs">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
              <Database className="size-4" />
            </span>
            <div className="mt-4">
              <p className="font-display text-2xl font-bold text-text">5 Sumber</p>
              <p className="mt-0.5 text-[11px] text-muted">Data Resmi Terverifikasi</p>
            </div>
          </div>

          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-2xs">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
              <FileCheck2 className="size-4" />
            </span>
            <div className="mt-4">
              <p className="font-display text-2xl font-bold text-text">100% Terbuka</p>
              <p className="mt-0.5 text-[11px] text-muted">Bisa Ditinjau & Diuji Publik</p>
            </div>
          </div>

          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-2xs">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
              <MapPin className="size-4" />
            </span>
            <div className="mt-4">
              <p className="font-display text-2xl font-bold text-text">44 Kecamatan</p>
              <p className="mt-0.5 text-[11px] text-muted">Cakupan Seluruh Wilayah DKI</p>
            </div>
          </div>

          <div className="card-hover flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-2xs">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-mint/20 text-brand-teal">
              <Lock className="size-4" />
            </span>
            <div className="mt-4">
              <p className="font-display text-2xl font-bold text-text">Privat & Aman</p>
              <p className="mt-0.5 text-[11px] text-muted">Identitas Pelapor Terlindungi</p>
            </div>
          </div>
        </section>

        {/* 2. PRINSIP UTAMA (3 ATURAN MAIN) */}
        <section>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
                <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
                Landasan Desain
              </div>
              <h2 className="display-3 mt-3 text-text">Tiga aturan main keterbukaan</h2>
              <p className="lede mt-2 max-w-2xl text-sm">
                TeraPublic tidak dibuat untuk menghakimi individu. Sistem ini dibangun untuk membaca pola,
                menemukan celah ketimpangan, dan merumuskan pertanyaan warga yang lebih bermakna.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article
                  key={principle.title}
                  className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft transition-all duration-300 hover:border-interactive/40 hover:shadow-lift"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-interactive/5 blur-2xl group-hover:bg-interactive/10 transition-colors" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-interactive/10 text-interactive transition-colors duration-200 group-hover:bg-interactive group-hover:text-white">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="tabular font-mono text-xs font-bold text-muted/80">
                        PRINSIP #{principle.number}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-lg font-bold tracking-[-0.02em] text-text">
                      {principle.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted">
                      {principle.body}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-border/70 pt-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-interactive">
                      <Sparkles className="size-3" />
                      {principle.highlight}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. MATRIKS SUMBER DATA */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
                <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
                Rantai Data
              </div>
              <h2 className="display-3 mt-3 text-text">Sumber data dan integrasi</h2>
              <p className="lede mt-2 max-w-2xl text-sm">
                Setiap angka yang ditampilkan di TeraPublic memiliki jejak dokumen rujukan dan lembaga penerbit resmi.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted">
              <Database className="size-3.5 text-interactive" />
              {DATA_SOURCES.length} Rujukan Basis Data
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.layer}
                  className="card-hover group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-2xs transition-all duration-200 hover:border-interactive/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-2 text-text transition-colors group-hover:bg-interactive/10 group-hover:text-interactive">
                        <Icon className="size-4" />
                      </span>
                      <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[10px] font-semibold text-muted">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-base font-semibold text-text">
                      {item.layer}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-interactive">
                      <CheckCircle2 className="size-3 text-success shrink-0" />
                      {item.source}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-muted">
                      {item.use}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-border/70 pt-3 text-[10px] text-muted">
                    Periode: <span className="font-semibold text-text">{item.period}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. METODOLOGI & BATASAN */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Kolom Kiri: Alur Metodologi */}
          <div className="card-hover overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-soft">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
                  Metodologi Analitik
                </p>
                <h3 className="font-display text-xl font-bold text-text">
                  Bagaimana skor dan indeks dibentuk
                </h3>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-interactive/10 text-interactive">
                <Calculator className="size-4" />
              </span>
            </div>

            <ol className="mt-6 space-y-6">
              {methodologySteps.map((step) => (
                <li key={step.step} className="flex items-start gap-4">
                  <span className="tabular inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-interactive/30 bg-interactive/10 font-mono text-xs font-bold text-interactive">
                    {step.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm font-semibold text-text">{step.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{step.desc}</p>
                    <code className="mt-2 block rounded-md bg-surface-2 px-2.5 py-1 font-mono text-[10px] font-medium text-text">
                      {step.formula}
                    </code>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Kolom Kanan: Keterbatasan & Kejujuran Ilmiah */}
          <div className="space-y-4">
            <div className="card-hover rounded-2xl border border-highlight/35 bg-highlight/[0.04] p-7 shadow-soft">
              <div className="flex items-center gap-2.5 text-highlight">
                <AlertTriangle className="size-5" />
                <h3 className="font-display text-lg font-bold text-text">
                  Keterbatasan data & catatan kritis
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Keterbukaan informasi memerlukan integritas intelektual. Angka yang disajikan TeraPublic memiliki batas lingkup yang perlu dipahami:
              </p>

              <ul className="mt-5 space-y-3">
                {limitations.map((limit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-highlight" />
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy Promise Box */}
            <div className="card-hover rounded-2xl border border-border bg-surface p-7 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-text">
                    Komitmen privasi pelapor
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Setiap aduan warga dilindungi enkripsi standar sipil dan kode pelacakan anonim.
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                  <ShieldCheck className="size-4" />
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href="/aduan/buat" size="sm">
                  Laporkan temuan fasilitas
                </ButtonLink>
                <ButtonLink href="/lacak" variant="secondary" size="sm">
                  Lacak tiket
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* 5. GLOSARIUM ISTILAH */}
        <section>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
              <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
              Kamus Data
            </div>
            <h2 className="display-3 mt-3 text-text">Glosarium istilah publik</h2>
            <p className="lede mt-2 max-w-2xl text-sm">
              Panduan memahami kosakata teknis perencanaan daerah, statistik, dan evaluasi anggaran.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((item) => (
              <div
                key={item.term}
                className="card-hover flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-2xs transition-all duration-200 hover:border-interactive/35"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-text">{item.term}</h3>
                    <span className="rounded-md bg-interactive/10 px-2 py-0.5 text-[9px] font-semibold text-interactive">
                      {item.badge}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. PERTANYAAN SERING MUNCUL (FAQ) */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-9">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface-2/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-interactive">
              <span className="size-1.5 rounded-full bg-interactive animate-pulse" />
              FAQ
            </div>
            <h2 className="display-3 mt-3 text-text">Pertanyaan yang sering diajukan</h2>
            <p className="lede mt-2 text-sm">
              Jawaban seputar independensi data, validitas laporan, dan transparansi sistem.
            </p>
          </div>

          <div className="mt-8 divide-y divide-border/80">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-text transition-colors hover:text-interactive">
                  <span>{faq.question}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 7. CTA PARTISIPASI WARGA (Identik dengan Landing Page) */}
        <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-[#10273a] via-[#15324b] to-[#0c1e2d] p-6 text-white shadow-xl md:p-10 lg:p-12">
          <div
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-mint/70 to-transparent"
            aria-hidden="true"
          />

          <div className="paper-grid absolute inset-0 opacity-[0.05]" aria-hidden="true" />

          <div
            className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-brand-teal/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 right-0 size-80 rounded-full bg-brand-mint/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-mint/30 bg-brand-mint/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-mint backdrop-blur-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-mint opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand-mint" />
                </span>
                KANAL PARTISIPASI WARGA · {TEAM_NAME}
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-[-0.035em] text-white md:text-4xl lg:text-[40px]">
                Punya temuan di sekitar Anda?{" "}
                <span className="text-brand-mint">Jadikan data.</span>
              </h2>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/75">
                Laporkan kerusakan fasilitas atau hambatan aksesibilitas di Jakarta. Setiap laporan warga
                diverifikasi menjadi data terbuka yang dapat dipantau bersama dinas terkait.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-brand-mint shrink-0" aria-hidden="true" />
                  Kode pelacakan unik
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-brand-mint shrink-0" aria-hidden="true" />
                  Diverifikasi 1x24 jam
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4 text-brand-mint shrink-0" aria-hidden="true" />
                  Terbuka untuk semua warga
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/aduan/buat"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-mint px-5 text-sm font-bold text-brand-navy shadow-sm transition-all hover:bg-[#68dac5] hover:shadow-md hover:shadow-brand-mint/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
                >
                  <FilePlus2 className="size-4" aria-hidden="true" />
                  Buat aduan sekarang
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/chatbot"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10"
                >
                  <Bot className="size-4 text-brand-mint" aria-hidden="true" />
                  Tanya asisten data
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold tracking-wider text-brand-mint">
                      #ADU-JKT-8492
                    </span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/70">
                      PUBLIK
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/40 bg-brand-teal/20 px-2.5 py-0.5 text-[10px] font-semibold text-brand-mint">
                    <span className="size-1.5 rounded-full bg-brand-mint animate-pulse" />
                    Ditindaklanjuti
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5">
                  <p className="text-sm font-semibold text-white">
                    Ubin Pemandu Tunanetra Rusak di Trotoar
                  </p>
                  <p className="text-xs text-white/60">
                    Kec. Menteng, Jakarta Pusat · Fasilitas Pejalan Kaki
                  </p>
                </div>

                <div className="mt-4 rounded-lg bg-black/20 p-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    <span className="text-brand-mint">1. Terkirim</span>
                    <span className="text-brand-mint">2. Terverifikasi</span>
                    <span className="text-white/40">3. Selesai</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-teal to-brand-mint" />
                  </div>
                  <p className="mt-2 text-[10px] text-white/50">
                    Target respon: <span className="font-semibold text-white/80">&lt; 24 jam kerja</span>
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/60">
                  <span>Lacak riwayat dengan kode tiket</span>
                  <Link
                    href="/lacak"
                    className="inline-flex items-center gap-1 font-semibold text-brand-mint hover:underline"
                  >
                    Lacak aduan
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
