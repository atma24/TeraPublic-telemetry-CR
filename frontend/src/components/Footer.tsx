import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                TP
              </div>
              <span className="font-bold text-slate-900 text-base">TeraPublic</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Platform layanan publik cerdas untuk transparansi ketersediaan fasilitas publik,
              pemantauan anggaran APBN/APBD, dan analitik pemerataan wilayah di DKI Jakarta.
              Dikembangkan untuk kompetisi <strong>Multimedia In Action (MIA) 2026</strong> — Web In Action.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Modul Utama</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/map" className="hover:text-blue-600 transition-colors">Peta Fasilitas Interaktif</Link></li>
              <li><Link href="/monitoring" className="hover:text-blue-600 transition-colors">Monitoring Anggaran & Proyek</Link></li>
              <li><Link href="/equity" className="hover:text-blue-600 transition-colors">Analitik Indeks Pemerataan</Link></li>
              <li><Link href="/feedback" className="hover:text-blue-600 transition-colors">Pelaporan Kondisi Warga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Sumber Data Resmi</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Portal Satu Data DKI Jakarta</li>
              <li>Dapodik Kemendikbudristek</li>
              <li>Perumda Pasar Jaya</li>
              <li>BPS Provinsi DKI Jakarta 2024</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TeraPublic. All rights reserved. Powered by Next.js 15 & Laravel 13.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Sistem Data Pilot DKI Jakarta Aktif
          </p>
        </div>
      </div>
    </footer>
  );
}
