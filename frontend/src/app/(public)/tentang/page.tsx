import type { Metadata } from "next";
import {
  AlertTriangle,
  Calculator,
  Database,
  Eye,
  Layers,
  MapPinned,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { DATA_SOURCES, SITE_TAGLINE, TEAM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Metodologi, sumber data, keterbatasan, dan komitmen privasi TeraPublic.",
};

const principles = [
  {
    icon: Eye,
    title: "Terbaca, bukan sekadar tersedia",
    body: "Data publik disusun sebagai ruang baca: ada konteks, satuan, dan tautan ke detail. Bukan tabel mentah tanpa arah.",
  },
  {
    icon: Scale,
    title: "Angka punya batas",
    body: "Setiap metrik menjelaskan asal dan keterbatasannya. Tidak ada skor yang dipakai untuk menilai orang atau instansi secara personal.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi warga dijaga",
    body: "Identitas pelapor tidak ditampilkan di halaman publik. Halaman fasilitas hanya menampilkan agregat laporan.",
  },
];

const sources = [
  {
    layer: "Fasilitas pendidikan",
    source: "Dapodik / Kemendikbudristek",
    use: "Nama, lokasi, kapasitas, status, dan atribut akses sekolah.",
  },
  {
    layer: "Pasar tradisional",
    source: "Perumda Pasar Jaya",
    use: "Lokasi dan profil pasar rakyat.",
  },
  {
    layer: "Wilayah & penduduk",
    source: "BPS Provinsi DKI Jakarta 2024",
    use: "Batas kecamatan, jumlah penduduk, dan luas wilayah.",
  },
  {
    layer: "Anggaran & proyek",
    source: "APBD DKI Jakarta 2024–2026",
    use: "Alokasi, realisasi, progres fisik, status, dan kontraktor.",
  },
  {
    layer: "Laporan warga",
    source: "Aduan pengguna TeraPublic",
    use: "Temuan kerusakan, hambatan akses, keterlambatan proyek, dan kebersihan.",
  },
];

const glossary = [
  ["Rasio per 10.000", "Jumlah fasilitas dibagi populasi kecamatan, dikali 10.000. Semakin tinggi, semakin banyak fasilitas per penduduk."],
  ["Indeks pemerataan", "Gabungan rasio fasilitas dan skor akses, diskalakan 0–100. Nilai lebih tinggi menunjukkan kondisi relatif lebih baik."],
  ["Skor aksesibilitas", "Persentase fasilitas yang memiliki setidaknya satu atribut dukungan akses pada data sumber."],
  ["Realisasi", "Nilai anggaran yang tercatat sudah dibelanjakan atau dicairkan, dibandingkan dengan alokasi."],
  ["SiLPA", "Sisa lebih pembiayaan anggaran; pada halaman insight merupakan estimasi model, bukan angka final."],
  ["Klaster", "Kelompok kecamatan dengan kemiripan fitur populasi, fasilitas, akses, dan anggaran."],
];

const faqs = [
  {
    question: "Apakah TeraPublic situs resmi pemerintah?",
    answer:
      "Tidak. TeraPublic adalah antarmuka data publik. Selalu verifikasi dokumen resmi pada instansi berwenang sebelum mengambil keputusan formal.",
  },
  {
    question: "Mengapa satu fasilitas terlihat tidak dapat diakses padahal ada ramp?",
    answer:
      "Atribut akses hanya mencatat keberadaan komponen pada data sumber. Kondisi, kemiringan, lebar, dan hambatan di lapangan tidak selalu tercatat. Gunakan aduan untuk menandai kondisi aktual.",
  },
  {
    question: "Bagaimana cara melaporkan data yang keliru?",
    answer:
      "Kirim aduan melalui portal warga dengan menyebut nama fasilitas atau proyek, lokasi, dan bagian data yang perlu diperiksa. Sertakan tautan foto jika tersedia.",
  },
  {
    question: "Apakah laporan saya dapat dilihat publik?",
    answer:
      "Halaman publik hanya menampilkan agregat jumlah laporan pada fasilitas. Identitas dan isi laporan tidak ditampilkan. Kode pelacakan dapat dipakai untuk melihat status laporan terkait.",
  },
  {
    question: "Mengapa proyeksi berbeda dari realisasi akhir?",
    answer:
      "Proyeksi berasal dari model statistik dengan galat. Perubahan kebijakan, keterlambatan pengadaan, dan kualitas data dapat membuat realisasi berbeda.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tentang TeraPublic"
        title="Data publik yang bisa dibaca, bukan hanya disimpan"
        description="TeraPublic menyatukan fasilitas, anggaran, dan suara warga Jakarta dalam satu ruang baca. Tujuannya sederhana: membuat pertanyaan publik lebih mudah dimulai."
        breadcrumbs={[{ label: "Tentang" }]}
        actions={
          <ButtonLink href="/data" size="sm">
            Mulai dari data
          </ButtonLink>
        }
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{SITE_TAGLINE}</p>
      </PageHeader>

      <div className="container-page py-8 md:py-12">
        <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow">Prinsip</p>
            <h2 className="display-3 mt-3 text-text">Tiga aturan main</h2>
            <p className="lede mt-3 text-sm">
              TeraPublic tidak menilai individu. Ia membantu membaca pola, menemukan celah, dan merumuskan
              pertanyaan yang lebih baik.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article key={principle.title} className="rounded-lg border border-border bg-surface p-5">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-interactive/8 text-interactive">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-semibold text-text">{principle.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">{principle.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Sumber data</p>
              <h2 className="display-3 mt-3 text-text">Dari mana angkanya</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-muted">
              <Database className="size-3.5" aria-hidden="true" />
              {DATA_SOURCES.length} kelompok sumber
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-[10px] uppercase tracking-[0.08em] text-muted">
                    <th scope="col" className="px-4 py-2.5 font-semibold">Lapisan</th>
                    <th scope="col" className="px-4 py-2.5 font-semibold">Sumber</th>
                    <th scope="col" className="px-4 py-2.5 font-semibold">Dipakai untuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sources.map((source) => (
                    <tr key={source.layer} className="text-xs">
                      <td className="px-4 py-3 font-semibold text-text">{source.layer}</td>
                      <td className="px-4 py-3 text-muted">{source.source}</td>
                      <td className="px-4 py-3 text-[11px] leading-relaxed text-muted">{source.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">
            Referensi sumber: {DATA_SOURCES.join(" · ")}.
          </p>
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              <Calculator className="size-3.5" aria-hidden="true" />
              Metodologi ringkas
            </p>
            <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.03em] text-text">
              Bagaimana skor dibentuk
            </h2>
            <ol className="mt-4 space-y-3">
              {[
                "Fasilitas dihitung per kecamatan, lalu dibagi jumlah penduduk dan dikali 10.000.",
                "Skor akses dihitung dari proporsi fasilitas yang memiliki minimal satu atribut dukungan akses.",
                "Indeks pemerataan menggabungkan rasio fasilitas dan skor akses, lalu diskalakan 0–100.",
                "K-Means mengelompokkan kecamatan berdasarkan populasi, fasilitas, rasio, akses, dan anggaran.",
                "Model time-series memproyeksikan realisasi bulanan dari riwayat penyerapan yang tersedia.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="tabular mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[9px] font-bold text-muted">
                    {index + 1}
                  </span>
                  <span className="text-[11px] leading-relaxed text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-highlight/30 bg-highlight/8 p-6">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              Keterbatasan
            </p>
            <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.03em] text-text">
              Yang belum bisa dijawab data
            </h2>
            <ul className="mt-4 space-y-2.5 text-[11px] leading-relaxed text-muted">
              <li>Kualitas fisik bangunan, kebersihan aktual, dan kenyamanan pengguna tidak tercatat penuh.</li>
              <li>Atribut akses belum menggambarkan seluruh standar inklusivitas dan kondisi lapangan.</li>
              <li>Data anggaran dapat tertinggal dari perubahan dokumen dan pencairan terbaru.</li>
              <li>Model statistik memiliki galat; proyeksi bukan keputusan anggaran.</li>
              <li>Laporan warga perlu verifikasi admin sebelum dianggap selesai.</li>
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <p className="eyebrow">Glosarium</p>
          <h2 className="display-3 mt-3 text-text">Istilah yang dipakai</h2>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {glossary.map(([term, definition]) => (
              <div key={term} className="bg-surface p-5">
                <dt className="text-xs font-semibold text-text">{term}</dt>
                <dd className="mt-1.5 text-[11px] leading-relaxed text-muted">{definition}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Privasi & partisipasi
            </p>
            <h2 className="mt-3 font-display text-xl font-bold tracking-[-0.03em] text-text">
              Warga tetap memegang kendali
            </h2>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Akun warga dipakai untuk mengirim dan memantau aduan. Halaman publik tidak menampilkan nama,
              email, atau isi laporan individual. Kode pelacakan dapat dipakai untuk melihat status, tanpa
              membuka identitas pelapor.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href="/aduan/buat" size="sm">
                Kirim aduan
              </ButtonLink>
              <ButtonLink href="/lacak" variant="secondary" size="sm">
                Lacak aduan
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-text">
                <Layers className="size-3.5 text-muted" aria-hidden="true" />
                Pertanyaan yang sering muncul
              </h2>
            </div>
            <div className="divide-y divide-border">
              {faqs.map((faq) => (
                <details key={faq.question} className="group px-5 py-3.5">
                  <summary className="flex items-start justify-between gap-3 text-xs font-semibold text-text">
                    {faq.question}
                    <span className="mt-0.5 text-[10px] font-normal text-muted group-open:hidden">Buka</span>
                    <span className="mt-0.5 hidden text-[10px] font-normal text-muted group-open:inline">Tutup</span>
                  </summary>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-2/60 px-5 py-4">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <MapPinned className="size-3.5" aria-hidden="true" />
            Fokus wilayah: DKI Jakarta · Inisiatif oleh {TEAM_NAME} · {SITE_TAGLINE}
          </p>
          <ButtonLink href="/data" variant="secondary" size="sm">
            Buka data publik
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
