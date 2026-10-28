"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";

import { formatNumber } from "@/lib/format";
import { cn, escapeHtml } from "@/lib/utils";
import type { PublicFacility, RegionFeatureCollection } from "@/types/public";

export interface FacilityMapProps {
  facilities?: PublicFacility[];
  regions?: RegionFeatureCollection | null;
  selectedFacilityId?: number | null;
  onSelectFacility?: (id: number) => void;
  height?: number | string;
  className?: string;
  ariaLabel?: string;
  showLegend?: boolean;
}

const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>';

function tileUrl(): string {
  return document.documentElement.classList.contains("dark") ? DARK_TILES : LIGHT_TILES;
}

function facilityColor(facility: PublicFacility): string {
  return facility.category?.slug === "pasar-tradisional" ? "#f4b740" : "#0f766e";
}

function equityColor(isUnderserved: boolean, equityIndex: number): string {
  if (isUnderserved || equityIndex < 50) return "#b42318";
  if (equityIndex < 75) return "#b54708";
  return "#0f766e";
}

function facilityPopup(facility: PublicFacility): string {
  const category = escapeHtml(facility.category?.name ?? "Fasilitas publik");
  const region = escapeHtml(facility.region?.name ?? "");
  const name = escapeHtml(facility.name);
  const address = facility.address ? escapeHtml(facility.address) : "";

  return `
    <div class="tp-popup">
      <div class="tp-popup__title">${name}</div>
      <div class="tp-popup__meta">${category}${region ? ` · ${region}` : ""}</div>
      <div class="tp-popup__tags">
        <span class="tp-popup__tag">${formatNumber(facility.capacity)} kapasitas</span>
        <span class="tp-popup__tag ${facility.has_wheelchair_ramp ? "tp-popup__tag--on" : ""}">Ramp</span>
        <span class="tp-popup__tag ${facility.has_tactile_paving ? "tp-popup__tag--on" : ""}">Tactile</span>
        <span class="tp-popup__tag ${facility.has_disabled_toilet ? "tp-popup__tag--on" : ""}">Toilet</span>
      </div>
      ${address ? `<div class="tp-popup__meta">${address}</div>` : ""}
      <a class="tp-popup__link" href="/data/fasilitas/${facility.id}">Buka detail →</a>
    </div>
  `;
}

export function FacilityMap({
  facilities = [],
  regions = null,
  selectedFacilityId = null,
  onSelectFacility,
  height = 420,
  className,
  ariaLabel = "Peta interaktif fasilitas publik",
  showLegend = true,
}: FacilityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef(new Map<number, L.CircleMarker>());
  const regionLayerRef = useRef<L.GeoJSON | null>(null);
  const onSelectRef = useRef(onSelectFacility);

  useEffect(() => {
    onSelectRef.current = onSelectFacility;
  }, [onSelectFacility]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
      minZoom: 9,
      maxZoom: 18,
    }).setView([-6.2, 106.83], 11);

    const tiles = L.tileLayer(tileUrl(), {
      attribution: ATTRIBUTION,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    tileRef.current = tiles;

    const observer = new MutationObserver(() => {
      tileRef.current?.setUrl(tileUrl());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const timer = window.setTimeout(() => map.invalidateSize(), 50);
    const markerMap = markerMapRef.current;

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      markerLayerRef.current = null;
      regionLayerRef.current = null;
      markerMap.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markerMapRef.current.clear();

    for (const facility of facilities) {
      if (!Number.isFinite(facility.latitude) || !Number.isFinite(facility.longitude)) continue;

      const marker = L.circleMarker([facility.latitude, facility.longitude], {
        radius: 5,
        color: "#ffffff",
        weight: 1.4,
        fillColor: facilityColor(facility),
        fillOpacity: 0.92,
      });

      marker.bindPopup(facilityPopup(facility), {
        className: "tp-popup-wrapper",
        maxWidth: 280,
        closeButton: true,
      });

      marker.on("click", () => onSelectRef.current?.(facility.id));
      marker.on("add", () => {
        const element = marker.getElement();
        if (!element) return;
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-label", `Fasilitas: ${facility.name}`);
        element.addEventListener("keydown", (event) => {
          const keyboardEvent = event as KeyboardEvent;
          if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
            keyboardEvent.preventDefault();
            marker.openPopup();
          }
        });
      });

      marker.addTo(layer);
      markerMapRef.current.set(facility.id, marker);
    }

    if (!regions && facilities.length > 0) {
      const bounds = L.latLngBounds(facilities.map((f) => [f.latitude, f.longitude] as [number, number]));
      map.fitBounds(bounds.pad(0.08), { maxZoom: 13, animate: false });
    }
  }, [facilities, regions]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (regionLayerRef.current) {
      map.removeLayer(regionLayerRef.current);
      regionLayerRef.current = null;
    }

    if (!regions || regions.features.length === 0) return;

    const layer = L.geoJSON(regions as GeoJSON.GeoJsonObject, {
      style: (feature) => {
        const properties = feature?.properties as
          | { is_underserved?: boolean; equity_index?: number }
          | undefined;
        return {
          color: equityColor(Boolean(properties?.is_underserved), Number(properties?.equity_index ?? 0)),
          weight: 1.2,
          opacity: 0.8,
          fillColor: equityColor(
            Boolean(properties?.is_underserved),
            Number(properties?.equity_index ?? 0),
          ),
          fillOpacity: 0.16,
        };
      },
      onEachFeature: (feature, geoLayer) => {
        const properties = feature.properties as
          | {
              name?: string;
              ratio_per_10k?: number;
              accessibility_score?: number;
              facility_count?: number;
            }
          | undefined;
        if (!properties?.name) return;
        const name = escapeHtml(properties.name);
        geoLayer.bindTooltip(name, { sticky: true, direction: "top" });
        geoLayer.bindPopup(
          `<div class="tp-popup">
            <div class="tp-popup__title">${name}</div>
            <div class="tp-popup__meta">Rasio ${formatNumber(properties.ratio_per_10k)} per 10.000 penduduk</div>
            <div class="tp-popup__tags">
              <span class="tp-popup__tag">${formatNumber(properties.facility_count)} fasilitas</span>
              <span class="tp-popup__tag">Skor ${formatNumber(properties.accessibility_score)}</span>
            </div>
          </div>`,
        );
      },
    }).addTo(map);

    regionLayerRef.current = layer;
    const bounds = layer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.02), { animate: false });
  }, [regions]);

  useEffect(() => {
    if (!selectedFacilityId) return;
    const marker = markerMapRef.current.get(selectedFacilityId);
    if (!marker || !mapRef.current) return;
    mapRef.current.flyTo(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 14), {
      duration: 0.55,
    });
    marker.openPopup();
  }, [selectedFacilityId]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-border bg-surface-2", className)}
      style={{ height }}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
        role="region"
        aria-label={ariaLabel}
      />
      {showLegend ? (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-md border border-border bg-surface/95 px-3 py-2 shadow-soft backdrop-blur-sm">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Legenda</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {regions ? (
              <>
                <LegendItem color="#0f766e" label="Akses memadai" />
                <LegendItem color="#b54708" label="Perlu perhatian" />
                <LegendItem color="#b42318" label="Wilayah prioritas" />
              </>
            ) : (
              <>
                <LegendItem color="#0f766e" label="Sekolah" />
                <LegendItem color="#f4b740" label="Pasar tradisional" />
              </>
            )}
          </div>
        </div>
      ) : null}
      {facilities.length === 0 && !regions ? (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center bg-bg/70 px-6 text-center backdrop-blur-[1px]">
          <p className="max-w-xs text-xs leading-relaxed text-muted">
            Belum ada titik fasilitas yang cocok dengan filter ini.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted">
      <span
        className="size-2 rounded-full border border-white/70"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
