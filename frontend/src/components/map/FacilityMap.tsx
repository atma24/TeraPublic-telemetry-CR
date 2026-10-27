'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PublicFacility } from '@/types';
import { Search, Filter, Accessibility, Check, X, MapPin, Building, GraduationCap, Store, MessageSquare } from 'lucide-react';

interface FacilityMapProps {
  initialFacilities?: PublicFacility[];
}

export default function FacilityMap({ initialFacilities = [] }: FacilityMapProps) {
  const [facilities, setFacilities] = useState<PublicFacility[]>(initialFacilities);
  const [selectedFacility, setSelectedFacility] = useState<PublicFacility | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Sekolah' | 'Pasar Tradisional'>('all');
  const [rampOnly, setRampOnly] = useState(false);
  const [tactileOnly, setTactileOnly] = useState(false);
  const [toiletOnly, setToiletOnly] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Fetch from API or fallback
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/facilities?per_page=100');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setFacilities(json.data);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend API not responding, using static seeder fallback');
      }

      // If initialFacilities was passed, use it
      if (initialFacilities.length > 0) {
        setFacilities(initialFacilities);
      }
    }
    loadData();
  }, [initialFacilities]);

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      // Category filter
      if (categoryFilter === 'Sekolah' && f.category?.slug !== 'sekolah' && !f.sub_category?.match(/SD|SMP|SMA|SMK/i)) {
        return false;
      }
      if (categoryFilter === 'Pasar Tradisional' && f.category?.slug !== 'pasar-tradisional' && !f.name.toLowerCase().includes('pasar')) {
        return false;
      }

      // Accessibility filters
      if (rampOnly && !f.has_wheelchair_ramp) return false;
      if (tactileOnly && !f.has_tactile_paving) return false;
      if (toiletOnly && !f.has_disabled_toilet) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchAddress = f.address?.toLowerCase().includes(q) ?? false;
        const matchKec = f.region?.name.toLowerCase().includes(q) ?? false;
        if (!matchName && !matchAddress && !matchKec) return false;
      }

      return true;
    });
  }, [facilities, categoryFilter, rampOnly, tactileOnly, toiletOnly, search]);

  // Initialize Leaflet Map safely in client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let map: any = null;
    let markersLayer: any = null;

    import('leaflet').then((L) => {
      const container = document.getElementById('leaflet-map-container');
      if (!container || (container as any)._leaflet_id) return;

      map = L.map('leaflet-map-container').setView([-6.2088, 106.8456], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayer = L.layerGroup().addTo(map);
      setMapInstance(map);

      // Render markers
      renderMarkers(L, markersLayer, filteredFacilities);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Update markers when filtered facilities change
  useEffect(() => {
    if (!mapInstance || typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      // Clear existing markers
      mapInstance.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstance.removeLayer(layer);
        }
      });

      renderMarkers(L, mapInstance, filteredFacilities);
    });
  }, [filteredFacilities, mapInstance]);

  function renderMarkers(L: any, targetLayer: any, items: PublicFacility[]) {
    items.forEach((f) => {
      if (!f.latitude || !f.longitude) return;

      const isMarket = f.category?.slug === 'pasar-tradisional' || f.name.toLowerCase().includes('pasar');
      const markerColor = isMarket ? '#059669' : '#2563eb';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([f.latitude, f.longitude], { icon: customIcon });

      const popupContent = `
        <div style="min-width: 200px; font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px; font-size: 13px;">${f.name}</div>
          <div style="color: #64748b; margin-bottom: 6px;">${f.address || 'DKI Jakarta'}</div>
          
          <div style="display: flex; gap: 4px; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="background: ${f.has_wheelchair_ramp ? '#d1fae5' : '#f1f5f9'}; color: ${f.has_wheelchair_ramp ? '#065f46' : '#94a3b8'}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
              ${f.has_wheelchair_ramp ? '✓ Ramp Kursi Roda' : '✕ Ramp'}
            </span>
            <span style="background: ${f.has_tactile_paving ? '#d1fae5' : '#f1f5f9'}; color: ${f.has_tactile_paving ? '#065f46' : '#94a3b8'}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
              ${f.has_tactile_paving ? '✓ Guiding Block' : '✕ Guiding'}
            </span>
          </div>

          <a href="/feedback?facility_id=${f.id}" style="display: inline-block; background: #2563eb; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 11px;">
            Laporkan Kondisi
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => setSelectedFacility(f));
      marker.addTo(targetLayer);
    });
  }

  function focusFacility(f: PublicFacility) {
    setSelectedFacility(f);
    if (mapInstance && f.latitude && f.longitude) {
      mapInstance.setView([f.latitude, f.longitude], 15, { animate: true });
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar Controls & List */}
      <div className="w-full lg:w-96 border-r border-slate-200 bg-white flex flex-col shrink-0">
        {/* Filter Header */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Peta Fasilitas Publik
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredFacilities.length} Titik
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari sekolah, pasar, jalan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                categoryFilter === 'all' ? 'bg-white shadow-sm font-semibold text-slate-900' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setCategoryFilter('Sekolah')}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1 ${
                categoryFilter === 'Sekolah' ? 'bg-white shadow-sm font-semibold text-blue-600' : 'text-slate-600'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Sekolah
            </button>
            <button
              onClick={() => setCategoryFilter('Pasar Tradisional')}
              className={`flex-1 py-1.5 rounded-md transition-colors flex items-center justify-center gap-1 ${
                categoryFilter === 'Pasar Tradisional' ? 'bg-white shadow-sm font-semibold text-emerald-600' : 'text-slate-600'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Pasar
            </button>
          </div>

          {/* Accessibility Toggles */}
          <div className="pt-1 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Filter Aksesibilitas Disabilitas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setRampOnly(!rampOnly)}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                  rampOnly
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {rampOnly ? <Check className="w-3 h-3 text-blue-600" /> : <Accessibility className="w-3 h-3 text-slate-400" />}
                Ramp Kursi Roda
              </button>

              <button
                onClick={() => setTactileOnly(!tactileOnly)}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                  tactileOnly
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tactileOnly ? <Check className="w-3 h-3 text-blue-600" /> : null}
                Guiding Block
              </button>

              <button
                onClick={() => setToiletOnly(!toiletOnly)}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-medium flex items-center gap-1 transition-colors ${
                  toiletOnly
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {toiletOnly ? <Check className="w-3 h-3 text-blue-600" /> : null}
                Toilet Disabilitas
              </button>
            </div>
          </div>
        </div>

        {/* Facility List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredFacilities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada fasilitas yang cocok dengan filter.
            </div>
          ) : (
            filteredFacilities.slice(0, 50).map((f) => (
              <div
                key={f.id}
                onClick={() => focusFacility(f)}
                className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                  selectedFacility?.id === f.id ? 'bg-blue-50/60 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-slate-900 text-xs">{f.name}</div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    f.category?.slug === 'pasar-tradisional' || f.name.includes('Pasar')
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {f.sub_category || 'Fasilitas'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{f.address || 'DKI Jakarta'}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px]">
                  {f.has_wheelchair_ramp && (
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      ✓ Ramp Kursi Roda
                    </span>
                  )}
                  {f.has_tactile_paving && (
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      ✓ Guiding Block
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map View Canvas */}
      <div className="flex-1 relative bg-slate-100">
        <div id="leaflet-map-container" className="w-full h-full" />
      </div>
    </div>
  );
}
