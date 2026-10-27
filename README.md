# TeraPublic

> Platform layanan publik cerdas untuk transparansi persebaran fasilitas publik, monitoring alokasi APBN/APBD, dan analitik pemerataan wilayah di DKI Jakarta.

Aplikasi ini dikembangkan untuk kompetisi **Multimedia In Action (MIA) 2026** — Cabang **Web In Action (WIA)** dengan tema *"Designing Digital Futures – Powering Public Transparency"*.

---

## 🛠️ Tech Stack
- **Backend**: Laravel 12 / 11 (PHP 8.5) — RESTful API, SQLite/PostgreSQL, Pest PHP
- **Frontend**: Next.js 15 (App Router, TypeScript) — Tailwind CSS, Shadcn/UI, Lucide React
- **GIS & Maps**: Leaflet / React-Leaflet & GeoJSON DKI Jakarta
- **Data Viz**: Recharts
- **AI Assistant**: Retrieval-Augmented Generation (RAG) berbasis Google Gemini API

---

## 🚀 Panduan Menjalankan Project

### 1. Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Akses antarmuka di `http://localhost:3000`.

---

## 📌 Progress Saat Ini (Roadmap FSD 01 Nov 2026)
- [x] Blueprint Arsitektur Sistem, ERD, dan Penyelarasan 4 Subtema WIA MIA 2026 (`ARCHITECTURE.md`).
- [x] Dataset Riil Terverifikasi (`data/seeders/`): 200 sekolah Dapodik, 14 pasar tradisional Pasar Jaya, dan 44 kecamatan DKI Jakarta.
- [ ] Scaffolding Monorepo `backend/` dan `frontend/`.
- [ ] Database Migration & Seeders.
- [ ] Landing Page & Peta GIS Interaktif (`/map`).
