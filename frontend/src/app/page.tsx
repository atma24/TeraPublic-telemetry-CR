import Link from 'next/link';
import { MapPin, BarChart3, Building2, MessageSquarePlus, ShieldCheck, CheckCircle2, ArrowRight, Eye, Accessibility, Scale } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Fasilitas Terpetakan', value: '214', unit: 'Sekolah & Pasar', change: 'DKI Jakarta Pilot' },
    { label: 'Wilayah Kecamatan', value: '44', unit: 'Kecamatan', change: '100% Tercakup Spasial' },
    { label: 'Alokasi Proyek APBD', value: 'Rp 91,7 M', unit: 'Pagu Pembangunan', change: 'Transparan & Terlacak' },
    { label: 'Indeks Aksesibilitas', value: '54,2%', unit: 'Ramah Disabilitas', change: 'Verifikasi Terbuka' },
  ];

  const pillars = [
    {
      title: 'Transparansi Fasilitas Publik',
      icon: Eye,
      color: 'blue',
      desc: 'Menyajikan informasi persebaran 200 sekolah negeri/swasta (SD, SMP, SMA, SMK) dan 14 pasar tradisional Pasar Jaya secara terbuka dan presisi.',
      link: '/map',
      linkText: 'Buka Peta Fasilitas',
    },
    {
      title: 'Aksesibilitas & Inklusivitas',
      icon: Accessibility,
      color: 'emerald',
      desc: 'Membantu penyandang disabilitas dan lansia mengetahui ketersediaan jalur ramp kursi roda, guiding block tunanetra, dan toilet ramah disabilitas.',
      link: '/map?has_wheelchair_ramp=1',
      linkText: 'Lihat Fasilitas Aksesibel',
    },
    {
      title: 'Pemerataan Layanan (Equity)',
      icon: Scale,
      color: 'indigo',
      desc: 'Menganalisis rasio fasilitas per 10.000 jiwa di 44 kecamatan untuk mendeteksi wilayah yang masih tertinggal (underserved) demi perencanaan yang adil.',
      link: '/equity',
      linkText: 'Eksplorasi Analitik',
    },
  ];

  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Web In Action (WIA) — Multimedia In Action 2026
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Transparansi Fasilitas & <span className="text-blue-600">Anggaran Publik</span> Berbasis Data Nyata
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          TeraPublic menghubungkan data persebaran sekolah, pasar tradisional, dan alokasi dana APBD di 44 kecamatan DKI Jakarta untuk mewujudkan layanan publik yang adil, terbuka, dan inklusif.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105 text-sm"
          >
            <MapPin className="w-4 h-4" />
            Jelajahi Peta Jakarta
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/monitoring"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-5 py-3 rounded-xl shadow-sm transition-all text-sm"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            Pantau Proyek APBD
          </Link>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-medium text-slate-500">{s.label}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-600 font-medium">{s.unit}</div>
              <div className="pt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {s.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Tiga Pilar Utama TeraPublic</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Solusi integratif untuk menjawab tantangan transparansi data pemerintahan dan pemenuhan hak akses disabilitas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors">
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
              <Link
                href={p.link}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-2"
              >
                {p.linkText}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action for Citizen Reporting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-700/20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Temukan Fasilitas Rusak atau Tidak Aksesibel?</h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Laporkan langsung kondisi sekolah atau pasar di wilayah Anda. Setiap laporan mendapatkan nomor tiket pelacakan terbuka untuk memantau tindak lanjut dinas terkait.
            </p>
          </div>
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Kirim Laporan Warga
          </Link>
        </div>
      </section>
    </div>
  );
}
