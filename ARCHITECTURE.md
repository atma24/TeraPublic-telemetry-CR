# TeraPublic — Architecture & Implementation Guide
### Cabang: Web In Action (WIA) — Multimedia In Action (MIA) 2026
**Tema**: *Designing Digital Futures – Powering Public Transparency*

Aplikasi layanan publik untuk transparansi fasilitas publik (sekolah & pasar), monitoring proyek alokasi dana APBN/APBD, analisis pemerataan wilayah (*equity analysis*), dan pelaporan masyarakat berbasis data di DKI Jakarta (Pilot Project).

---

## 1. Kesesuaian 4 Subtema WIA MIA 2026
1. **Open Government Data**: Pemetaan fasilitas publik (200 sekolah Dapodik + 14 pasar tradisional Pasar Jaya) & alokasi anggaran APBN/APBD DKI Jakarta.
2. **Public Service Tracking**: Pelacakan progres proyek pembangunan fisik, status operasional, lelang/tender LPSE, dan kontraktor pelaksana.
3. **Civic Reporting & Accountability**: Formulir pelaporan warga untuk fasilitas rusak/terhalang dengan nomor tiket publik transparan (`TP-2026-XXXX`).
4. **Data-Driven Decision Support**: *Equity Gap Index* (rasio fasilitas per 10.000 jiwa BPS 2024 & deteksi kecamatan *underserved*).

---

## 2. Tech Stack & Konvensi Monorepo
* **Backend**: Laravel 12 / 11 (PHP 8.5) di folder `backend/`
  - RESTful API, Eloquent ORM, Database SQLite/PostgreSQL
  - Seeders data riil Jakarta di `backend/database/seeders/`
  - Automated Tests: Pest PHP
* **Frontend**: Next.js 15 (App Router, TypeScript) di folder `frontend/`
  - Styling: Tailwind CSS, Shadcn/UI, Lucide React
  - GIS Mapping: Leaflet & React-Leaflet (`/map`)
  - Data Visualization: Recharts (`/equity`, `/monitoring`)
* **AI Engine**: Google Gemini API (RAG / Function Calling) untuk asisten informasi publik warga.

---

## 3. Skema Relasi Database (ERD)
* `regions`: id, code, name, city, level, population, area_km2, geometry (GeoJSON polygon).
* `facility_categories`: id, name ('Sekolah', 'Pasar Tradisional'), slug.
* `public_facilities`: id, category_id, region_id, name, npsn, address, latitude, longitude, status, capacity, has_wheelchair_ramp, has_tactile_paving, has_disabled_toilet, public_transport_nearby.
* `budget_projects`: id, facility_id, region_id, project_name, fiscal_year, funding_source, budget_allocated, budget_realized, status, contractor_name, start_date, target_completion_date, progress_percentage.
* `equity_metrics`: id, region_id, category_id, facility_count, ratio_per_10k_population, accessibility_score, equity_index, is_underserved.
* `citizen_feedbacks`: id, facility_id, tracking_code, citizen_name, citizen_email, title, description, category, photo_url, latitude, longitude, status, admin_response.

---

## 4. Lokasi Dataset Riil
Dataset riil DKI Jakarta yang siap dipakai untuk seeder berada di folder:
`data/seeders/`
* `regions_jakarta.json` (44 Kecamatan DKI Jakarta lengkap dengan GeoJSON batas wilayah & populasi BPS 2024)
* `facilities_jakarta.json` (214 Fasilitas publik riil: 200 Sekolah Kemendikbud + 14 Pasar Tradisional Pasar Jaya)
* `budget_projects_jakarta.json` (Paket proyek APBD/LPSE DKI Jakarta)

---

## 5. Roadmap Deliverables First Draft Submission (01 Nov 2026)
1. Monorepo scaffold (`backend/` Laravel & `frontend/` Next.js).
2. Database seeder terisi 214 fasilitas & 44 kecamatan Jakarta.
3. Landing Page responsif (Tailwind, modern UI).
4. Interactive GIS Map (`/map`) dengan filter disabilitas & detail popup.
5. README.md rapi berstandar WIA FSD.
