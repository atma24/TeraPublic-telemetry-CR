# TeraPublic — Public Transparency & Civic Insights

TeraPublic adalah platform transparansi publik yang mengintegrasikan informasi anggaran pemerintah, program, serta fasilitas dan layanan publik dalam satu platform digital. TeraPublic bertujuan membantu masyarakat mengakses, memahami, dan menelusuri informasi publik dengan lebih mudah, sekaligus mendorong partisipasi masyarakat dan akuntabilitas publik.

**Pilot Area:** DKI Jakarta  
**Project Category:** Public Transparency & Civic Technology  
**Development Status:** In Progress

---

## Tech Stack

Teknologi yang digunakan dalam pengembangan TeraPublic:

| Bagian | Teknologi |
|---|---|
| Frontend | Next.js, TypeScript |
| Backend | Laravel (PHP) |
| API | REST API |
| Data Source | Satu Data Jakarta|
| Machine Learning | Komponen dan model pada direktori `ml` |
| Version Control | Git & GitHub |

---

## Repository Structure

Struktur repository TeraPublic:

```text
TeraPublic-telemetry-CR/
│
├── backend/                  # Backend dan REST API Laravel
│
├── frontend/                 # Antarmuka website Next.js
│
├── data/                     # Dataset dan data pendukung project
│
├── ml/                       # Komponen Machine Learning
│
├── .gitignore
├── API_DOCUMENTATION.md      # Dokumentasi endpoint API
├── ARCHITECTURE.md           # Dokumentasi arsitektur sistem
├── PROJECT_HANDOVER.md       # Dokumentasi serah terima project
└── README.md                 # Dokumentasi utama project
```

---

## Fitur Utama

1. **Transparansi Data Publik**  
   Menyediakan akses informasi anggaran, program pemerintah, dan data publik yang dapat ditelusuri.

2. **Layanan dan Fasilitas Publik**  
   Membantu masyarakat menemukan informasi fasilitas dan layanan publik.

3. **Insight dan Visualisasi Data**  
   Menyajikan informasi publik melalui ringkasan dan visualisasi agar lebih mudah dipahami.

4. **Pengaduan Masyarakat**  
   Memfasilitasi masyarakat dalam menyampaikan pengaduan terkait layanan publik.

5. **Chatbot Informasi Publik**  
   Membantu pengguna memperoleh informasi publik melalui antarmuka percakapan berbasis data.

---

## Installation & How to Run

### Prerequisites

Pastikan perangkat telah memiliki:

- Git
- PHP dan Composer
- Database yang sesuai dengan konfigurasi Laravel
- Node.js dan npm

### 1. Clone Repository

Clone repository TeraPublic:

```bash
git clone https://github.com/atma24/TeraPublic-telemetry-CR.git
```

Masuk ke direktori project:

```bash
cd TeraPublic-telemetry-CR
```

### 2. Menjalankan Backend

Masuk ke direktori backend:

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Buat file konfigurasi environment:

```bash
cp .env.example .env
```

Selanjutnya, buka file `.env` dan sesuaikan konfigurasi database dengan database yang digunakan.

Generate application key:

```bash
php artisan key:generate
```

Jalankan migrasi database dan seeder:

```bash
php artisan migrate --seed
```

Jalankan Laravel development server:

```bash
php artisan serve
```

Backend secara default dapat diakses melalui:

```text
http://127.0.0.1:8000
```

**Catatan:** Pastikan database telah dibuat dan konfigurasi koneksinya pada file `.env` sudah benar sebelum menjalankan migrasi. Perintah `php artisan migrate --seed` menjalankan migrasi sekaligus seeder yang tersedia.

### 3. Menjalankan Frontend

Buka terminal baru dari root repository, kemudian masuk ke direktori frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Jalankan frontend development server:

```bash
npm run dev
```

Frontend secara default dapat diakses melalui:

```text
http://localhost:3000
```

Pastikan backend telah berjalan dan konfigurasi koneksi API frontend telah disesuaikan apabila diperlukan.

### 4. Data dan Machine Learning

Direktori `data` digunakan untuk menyimpan dataset dan data pendukung yang digunakan dalam project. Salah satu sumber data publik yang digunakan dalam pengembangan TeraPublic adalah **Satu Data Jakarta**.

Direktori `ml` berisi komponen Machine Learning yang mendukung kebutuhan pengolahan atau pemanfaatan data dalam sistem.

Untuk petunjuk menjalankan komponen data dan Machine Learning, ikuti dokumentasi serta konfigurasi yang tersedia pada masing-masing direktori.

---

## Development Progress

**Current Status: In Progress**

Pengembangan TeraPublic telah mencapai beberapa tahap berikut:

| Komponen | Progress |
|---|---|
| Backend | Struktur dan implementasi utama telah selesai; masih terdapat penyesuaian dan penyempurnaan data. |
| Frontend | Desain antarmuka telah ditetapkan dan beberapa halaman website telah dikembangkan, meliputi Beranda, Layanan & Fasilitas, Analitik, Tentang TeraPublic, dan Chatbot. Implementasi dan penyempurnaan fitur masih berlangsung. |
| Data | Dataset dan data pendukung telah disiapkan; penyesuaian masih dilakukan sesuai kebutuhan sistem. |
| Machine Learning | Komponen ML tersedia dalam struktur project dan pengembangannya mengikuti kebutuhan integrasi sistem. |
| Integration & Testing | Integrasi dan pengujian sistem dilakukan secara bertahap, dengan kemungkinan perbaikan berdasarkan hasil evaluasi. |

### Current Development Notes

- Struktur backend dan implementasi utamanya telah diselesaikan.
- Penyesuaian data masih dilakukan agar sesuai dengan kebutuhan sistem.
- Desain frontend telah ditetapkan sebagai acuan pengembangan dan masih dapat disempurnakan selama proses implementasi.
- Beberapa halaman utama website telah dikembangkan berdasarkan desain yang telah ditetapkan.
- Integrasi antarbagian sistem dilakukan secara bertahap.
- Pengujian mencakup fungsionalitas, integrasi API, tampilan, dan hak akses pengguna.
- Perbaikan dan penyempurnaan dilakukan berdasarkan hasil pengujian.

---

## Project Information

**Project Name:** TeraPublic  
**Full Name:** Public Transparency & Civic Insights  
**Pilot Area:** DKI Jakarta  
**Category:** Public Transparency & Civic Technology  
**Data Source:** Satu Data Jakarta 
**Status:** Development in Progress

TeraPublic dikembangkan sebagai upaya mendukung keterbukaan informasi, kemudahan akses layanan publik, serta peningkatan partisipasi dan akuntabilitas melalui pemanfaatan teknologi digital.

---

*This project is currently under development. Features, implementation details, and documentation may be updated as development progresses.*
