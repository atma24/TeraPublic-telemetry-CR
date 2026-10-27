'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, BarChart3, Building2, MessageSquarePlus, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/map', label: 'Peta Fasilitas', icon: MapPin },
    { href: '/monitoring', label: 'Monitoring Anggaran', icon: BarChart3 },
    { href: '/equity', label: 'Analitik Pemerataan', icon: Building2 },
    { href: '/feedback', label: 'Lapor Warga', icon: MessageSquarePlus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            TP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">TeraPublic</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                Jakarta Pilot
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Transparansi Layanan & Anggaran Publik</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg shadow-sm shadow-blue-600/30 transition-all hover:shadow"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Lapor Fasilitas</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
