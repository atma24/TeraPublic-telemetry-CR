# Design Document: TeraPublic WIA 2026 Improvements
**Topik**: Telemetri Interaktif, Partisipasi Publik Dua Arah, dan Optimalisasi UX  
**Tanggal**: 2026-11-09  
**Status**: Ready for Implementation (Reviewed & Builder-Checked)  

---

## 1. Intent & Context
Dokumen desain ini disusun untuk menindaklanjuti secara komprehensif catatan dan rekomendasi dari **Mentor Penilai Adi Prabowo** pada kompetisi **Multimedia In Action (MIA) 2026 — Cabang Web In Action (WIA)** untuk tim **Telemetry-CR (TeraPublic)**.

Hasil evaluasi FDS mencatat:
1. **Penyajian Data Interaktif (Dashboard & Telemetri)**: Halaman lanjutan selain landing page harus dilengkapi visualisasi interaktif (charts, tren, dan tabel yang bisa difilter), bukan sekadar teks atau kartu statis.
2. **Penguatan Fitur Critical Thinking / Partisipasi Publik**: Menambahkan modul interaktif dua arah (pelaporan transparan, konfirmasi lapangan, atau ruang umpan balik publik) agar platform tidak bersifat *top-down*.
3. **Optimalisasi Pengalaman Pengguna (UX)**: Alur navigasi dari landing page menuju detail telemetri atau laporan utama harus dapat diakses dalam sesedikit mungkin klik.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **Telemetri Interaktif & Visualisasi Data (`/analitik`)**:
   - Menghadirkan *Suite Visual Lengkap* berbasis data riil PostgreSQL:
     - **Line Chart**: Tren historis dan proyeksi serapan APBD bulanan (Ridge Regression).
     - **Bar Chart**: Komparasi Alokasi vs Realisasi Belanja Modal APBD per 5 Kota Administrasi & Kabupaten Kepulauan Seribu.
     - **Donut Chart**: Rasio pemenuhan fasilitas ramah disabilitas (*ramp*, ubin pemandu, toilet difabel) yang dihitung dinamis dari database.
     - **Tabel Interaktif**: Daftar 44 kecamatan dengan filter instan berbasis tingkat risiko (*Kritis*, *Moderat*, *Stabil*) dan pencarian nama wilayah.
2. **Partisipasi Publik Dua Arah (Civic Accountability & Confirmation)**:
   - Sediakan feed pelaporan warga transparan di halaman Lacak Aduan (`/lacak?tab=publik`), menampilkan laporan terverifikasi/selesai, foto kondisi lapangan, dan respons dinas.
   - Warga umum dapat melakukan konfirmasi kendala lapangan (**"Saya Mengalami Masalah Serupa / Konfirmasi Lapangan"**) secara *frictionless* (berbasis client-token/localStorage) untuk meningkatkan skor urgensi penanganan.
3. **Optimalisasi UX & 1-Click Access di Homepage (`/`)**:
   - Tingkatkan Hero Right Card menjadi `LiveTelemetryRadar` di Landing Page untuk menampilkan ringkasan metrik interaktif dan tombol langsung 1-klik menuju Telemetri Lengkap `/analitik` dan Feed Aduan `/lacak?tab=publik`.

### Non-Goals
- Tidak merombak arsitektur autentikasi Sanctum atau skema role (`admin`, `citizen`).
- Tidak mengubah pipeline training Machine Learning Python di `ml/` yang sudah stabil.
- Tidak menghapus atau mengubah struktur URL endpoint publik yang sudah aktif.

### Anti-Goals
- **DILARANG MERUBAH DESAIN / TEMA UI**: Desain antarmuka, token warna (`--surface`, `--interactive`, `--brand-navy`, dll.), tipografi (`font-sans`, `font-display`, `font-mono`), serta gaya kartu/badge yang sudah dibangun tidak boleh dirombak. Seluruh elemen baru wajib mengikuti sistem desain yang sudah ada secara presisi.
- **TIDAK MENGGUNAKAN JARGON MEDIA SOSIAL**: Hindari istilah seperti "upvote" atau "like"; gunakan istilah akuntabilitas sipil: *"Konfirmasi Lapangan"* atau *"Saya Mengalami Hal Serupa"*.

---

## 3. Constraints
- **Stack Backend**: Laravel 13 (PHP 8.5) + PostgreSQL 18.6 di `backend/`.
- **Stack Frontend**: Next.js 15 (App Router, TypeScript, Tailwind CSS v4, Recharts) di `frontend/`.
- **Integritas Data**: Menggunakan dataset riil yang sudah ada (214 fasilitas, 1.731 proyek APBD, 44 kecamatan DKI Jakarta).
- **Privasi Data**: PII pelapor (`citizen_email`, `user_id`) wajib disembunyikan pada feed publik, dan nama pelapor disamarkan demi privasi warga.
- **Zero-Dependency Bloat**: Menggunakan pustaka yang sudah terpasang (`recharts`, `lucide-react`, Tailwind utility classes).

---

## 4. Approaches Considered

| Opsi | Deskripsi | Kelebihan | Tradeoff / Alasan Dipilih atau Ditolak |
|---|---|---|---|
| **Pendekatan A (Dipilih)** | **End-to-End Reactive Integration**: Migrasi kecil kolom `confirmations_count` di Laravel, endpoint publik feed & confirm, suite Recharts di `/analitik`, dan `LiveTelemetryRadar` di homepage. | Solid, data tersinkronisasi 100% di database riil, responsif, siap demo di depan juri. | Membutuhkan penambahan migration dan endpoint controller di Laravel serta pengujian Pest. |
| **Pendekatan B** | **Frontend Client-Only Mock**: Menampilkan grafik di frontend, namun feed dan konfirmasi disimulasikan di state lokal tanpa backend. | Cepat dibuat. | **Ditolak**: Data hilang saat reload, tidak mencerminkan transparansi riil, berisiko terlihat palsu saat dinilai juri. |
| **Pendekatan C** | **Sub-Pages Modular Fragmented**: Memecah telemetri dan aspirasi ke banyak sub-halaman terpisah (`/telemetri/apbd`, `/telemetri/disabilitas`, `/aduan/feed`). | Pemisahan kode ketat. | **Ditolak**: Menambah jumlah klik navigasi, bertentangan dengan arahan juri untuk menyederhanakan alur baca. |

---

## 5. Detailed Architecture & Technical Specifications

### A. Backend Architecture (Laravel 13)
1. **Database Migration**:
   - File: `backend/database/migrations/YYYY_MM_DD_add_confirmations_count_to_citizen_feedbacks_table.php`
   - Menambahkan kolom:
     ```php
     $table->unsignedInteger('confirmations_count')->default(0)->after('status');
     ```
2. **Model `CitizenFeedback`**:
   - Daftarkan `confirmations_count` pada `$fillable` dan `$casts => ['confirmations_count' => 'integer']`.
3. **Penyempurnaan Endpoint Dashboard Overview**:
   - Di `DashboardController::overview()`, tambahkan agregasi dinamis riil ke `kpis`:
     ```php
     'ramp_count' => PublicFacility::where('has_wheelchair_ramp', true)->count(),
     'tactile_count' => PublicFacility::where('has_tactile_paving', true)->count(),
     'toilet_count' => PublicFacility::where('has_disabled_toilet', true)->count(),
     ```
4. **API Endpoints Baru di `CitizenFeedbackController`**:
   - `GET /api/feedbacks/public`:
     - Menampilkan laporan terverifikasi/selesai (`whereIn('status', ['verified', 'in_review', 'resolved'])`).
     - **Sanitasi PII Wajib**: Sembunyikan `citizen_email` dan `user_id`. Tampilkan nama yang aman (misal inisial / "Warga Jakarta").
     - Query parameter: `category` (opsional), `sort` (`latest` atau `most_confirmed`), `per_page` (default: 10).
     - Relasi: `facility.region`.
   - `POST /api/feedbacks/{id}/confirm`:
     - Melakukan atomic increment: `CitizenFeedback::where('id', $id)->increment('confirmations_count');`
     - Mengembalikan response JSON sukses beserta total konfirmasi terbaru.
5. **Verifikasi Backend**:
   - Buat unit/feature test di `backend/tests/Feature/CitizenFeedbackPublicTest.php` untuk memastikan kedua endpoint berjalan 100% *green*.

---

### B. Frontend Architecture (Next.js 15)

#### 1. Telemetri Hub (`/analitik`)
Memperkaya halaman `/analitik` dengan tiga komponen visual baru yang menyatu dengan tema:
- **`DistrictBudgetBarChart` (`frontend/src/components/insight/district-budget-bar-chart.tsx`)**:
  - Mengambil data dari `city_breakdown` (Alokasi vs Realisasi APBD per Kota Administrasi).
  - Tampilan BarChart Recharts dengan warna `--chart-1` (realisasi) dan `--chart-3` (alokasi).
- **`DisabilityAccessChart` (`frontend/src/components/insight/disability-access-chart.tsx`)**:
  - Donut/PieChart proporsi fasilitas ber-Ramp, Ubin Pemandu, dan Toilet Difabel yang dibaca dinamis dari `kpis` overview.
- **`RiskDistrictsTable` (`frontend/src/components/insight/risk-districts-table.tsx`)**:
  - Tabel 44 kecamatan interaktif dengan fitur live search, filter tag status (*Kritis*, *Moderat*, *Stabil*), dan sorting serapan anggaran.

#### 2. Partisipasi Publik Dua Arah di `/lacak`
- Menambahkan tab view di `frontend/src/app/(public)/lacak/page.tsx` berbasis URL Search Params:
  - `?tab=lacak`: Form pelacakan tiket mandiri.
  - `?tab=publik`: Feed laporan warga terbuka.
- Komponen Kartu Laporan Publik (`PublicFeedbackCard`):
  - Menampilkan judul, kategori, nama fasilitas, foto (jika ada), progres tindak lanjut dari pemda, dan tombol **"Konfirmasi Kondisi di Lapangan"**.
  - Menggunakan `localStorage` (`tp_confirmed_feedbacks`) agar pengguna yang sudah mengonfirmasi tidak dapat menekan berulang kali, dengan optimistik UI counter.

#### 3. Optimalisasi UX 1-Click Access di Homepage (`/`)
- Tingkatkan Hero Right Card pada Landing Page (`frontend/src/app/(public)/page.tsx`) menjadi **`LiveTelemetryRadar`**:
  - Tetap berada *above the fold* di kolom kanan grid hero tanpa mengubah struktur layout yang ada.
  - Menambahkan switcher tab mini:
    1. *Snapshot APBD*: Realisasi vs Alokasi + mini progress bar.
    2. *Snapshot Disabilitas*: Pemenuhan aksesibilitas sekolah & pasar.
    3. *Aduan Warga*: Laporan warga terverifikasi terkini.
  - Terdapat CTA button 1-klik jelas: **"Buka Telemetri Lengkap →"** (menuju `/analitik`) dan **"Pantau Laporan Warga →"** (menuju `/lacak?tab=publik`).

---

## 6. Verification Plan
- **Backend Test**: Jalankan `php artisan test --filter=CitizenFeedbackPublicTest` untuk memverifikasi fungsionalitas dan sanitasi privasi.
- **Frontend Typecheck & Lint**: Jalankan `npm run typecheck` dan `npm run lint` di direktori `frontend/`.
- **UI Inspection**: Pastikan seluruh chart dan kartu tampil proporsional di mode terang (light) dan gelap (dark), serta responsif di layar mobile dan desktop.
