# TeraPublic — Project State & Handover Context

Dokumen ini berisi rangkuman status pengerjaan, arsitektur teknis, dan konfigurasi platform **TeraPublic** untuk memudahkan agent / developer melanjutkan sesi kerja di IDE manapun (Antigravity CLI / AGY IDE).

---

## 📌 Informasi Proyek
* **Nama Proyek**: TeraPublic (Platform Transparansi Fasilitas Publik, Aksesibilitas Disabilitas & Anggaran APBD DKI Jakarta)
* **Ajang**: Multimedia In Action (MIA) 2026 — Cabang Web In Action (WIA)
* **Tema**: *Designing Digital Futures – Powering Public Transparency*
* **Lokasi Repo**: `C:\Users\miles\OneDrive\Documents\GitHub\TeraPublic-telemetry-CR`
* **Stack**:
  * **Backend**: Laravel 13 (PHP 8.5) di `backend/`
  * **Database**: PostgreSQL 18.6 (Port: `5433`, DB: `terapublic-test`, User: `postgres`)
  * **Machine Learning**: Python Scientific Engine (NumPy 2.5 + Scikit-Learn) di `ml/`
  * **AI Assistant / RAG**: Google Gemini 2.5 Flash (Free Tier)
  * **Frontend**: Next.js 15 (App Router, TypeScript, Tailwind) di `frontend/` *(dikerjakan oleh pacar user)*

---

## 🔐 Autentikasi & Role (Sanctum)
* **Unified Login**: Menggunakan form login tunggal di `POST /api/auth/login`. Response mengembalikan objek user beserta `role: "admin"` atau `"citizen"`.
* **2 Role**:
  1. `admin`: Pengelola master data (CRUD fasilitas, proyek anggaran, tanggapi aduan warga).
     * Akun Seeder: `admin@terapublic.jakarta.go.id` | Password: `password123`
  2. `citizen`: Warga masyarakat. Default role saat registrasi mandiri via `POST /api/auth/register`.
     * Akun Seeder: `warga@terapublic.jakarta.go.id` | Password: `password123`
* **Aturan Hak Akses**:
  * Publik (tanpa login): Peta GIS (`/api/facilities`, `/api/regions/geojson`), monitoring APBD (`/api/budget-projects`), dashboard KPI & ML (`/api/dashboard`), lacak tiket aduan publik (`/api/feedback/track/{code}`).
  * Warga Login: Kirim aduan (`POST /api/feedback`), lihat riwayat aduannya (`GET /api/citizen/feedbacks`), dan chatbot AI (`POST /api/assistant/chat`).
  * Admin Login: Semua rute di bawah `/api/admin/*` (diproteksi `EnsureAdminRole` middleware).

---

## 📊 Status Data Riil di PostgreSQL (`terapublic-test`)
Semua data telah ter-sinkronisasi 100% (*zero orphan, zero broken foreign keys*):
1. **Wilayah (`regions`)**: 44 Kecamatan DKI Jakarta lengkap dengan batas GeoJSON poligon (termasuk Kepulauan Seribu).
2. **Fasilitas (`public_facilities`)**: 214 unit (200 sekolah Kemendikbud + 14 pasar tradisional Pasar Jaya) lengkap dengan tag disabilitas (*ramp*, *tactile paving*, toilet difabel).
3. **Proyek Anggaran (`budget_projects`)**: **1.731 paket proyek belanja modal fisik riil** (ekstraksi dari dataset resmi APBD DKI 255k baris periode 2024–2026).
4. **Indeks Pemerataan (`equity_metrics`)**: Rasio fasilitas per 10k jiwa & status *underserved* untuk 44 kecamatan.
5. **Aduan Warga (`citizen_feedbacks`)**: Sampel aduan terverifikasi tiket `TP-2026-0001`.

---

## 🤖 Machine Learning & AI Pipeline
1. **Python ML Pipeline (`ml/train_models.py`)**:
   * **Model 1**: Ridge L2 Regression untuk proyeksi laju serapan APBD bulanan sisa 2026 & prediksi SiLPA akhir tahun.
   * **Model 2**: Vectorized K-Means ($k=3$) dengan StandardScaler (Silhouette Score: `0.4735`) mengelompokkan 44 kecamatan ke dalam 3 tier urgensi (*Kritis*, *Moderat*, *Stabil*) & deteksi anomali.
   * **Model 3**: Multi-Variate 2027 Budget Allocation Optimizer berbasis populasi & defisit fasilitas disabilitas.
   * **Perintah Training**: `php artisan ml:train` (atau `python ml/train_models.py`).
2. **AI Public Assistant (RAG Pipeline)**:
   * Menggunakan model **Google Gemini 2.5 Flash** via `GEMINI_API_KEY` di `backend/.env`.
   * Mengambil konteks data riil database PostgreSQL (< 300 token) sehingga sangat hemat kuota dan tidak gampang terkena rate limit.
   * Dilengkapi in-memory caching 30 menit & fallback lokal deterministik jika offline.

---

## 🚀 Cara Menjalankan Server Lokal
* **Backend**:
  ```bash
  cd backend
  php artisan serve
  # API aktif di http://127.0.0.1:8000/api
  ```
* **Frontend**:
  ```bash
  cd frontend
  npm run dev
  # Web aktif di http://localhost:3000
  ```
* **Training ML**: `php artisan ml:train`
* **Test Suite**: `php artisan test` (18 passed, 602 assertions — 100% Green).

---

## 📖 Dokumentasi Lengkap
* Panduan Integrasi Frontend & TypeScript: [`API_DOCUMENTATION.md`](file:///C:/Users/miles/OneDrive/Documents/GitHub/TeraPublic-telemetry-CR/API_DOCUMENTATION.md)
* Blueprint Arsitektur Teknis: [`ARCHITECTURE.md`](file:///C:/Users/miles/OneDrive/Documents/GitHub/TeraPublic-telemetry-CR/ARCHITECTURE.md)
