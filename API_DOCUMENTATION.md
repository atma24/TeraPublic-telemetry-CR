# TeraPublic — Panduan Integrasi REST API (Frontend Developer Guide)

Dokumen ini adalah referensi lengkap kontrak API backend TeraPublic (Laravel 13) untuk pengembangan antarmuka Next.js / React (Web In Action MIA 2026).

---

## 🚀 Cara Menjalankan Backend Lokal

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Jalankan server Laravel:
   ```bash
   php artisan serve
   ```
3. API aktif di: **`http://127.0.0.1:8000/api`**
4. **CORS**: Sudah dibuka penuh untuk `localhost:3000` via `config/cors.php`.

---

## 🔐 Arsitektur Autentikasi & Role (Sanctum Bearer Token)

### 1. Unified Login (Satu Form Login untuk Semua Role)
* **URL Form Frontend**: `/login`
* **Endpoint Backend**: `POST /api/auth/login`
* **Logika Redirection Frontend**:
  1. Frontend mengirim email & password ke `POST /api/auth/login`.
  2. Backend mengembalikan `access_token` dan objek `user` dengan atribut `role: "admin"` atau `"citizen"`.
  3. Frontend menyimpan token di `localStorage` / cookie, lalu:
     - Jika `user.role === 'admin'`: Redirect ke panel dashboard admin (`/admin/dashboard`).
     - Jika `user.role === 'citizen'`: Redirect ke portal utama warga (`/dashboard` atau `/feedback`).

### 2. Kredensial Default (Seeder)
* **Admin**: `admin@terapublic.jakarta.go.id` | Password: `password123`
* **Warga**: `warga@terapublic.jakarta.go.id` | Password: `password123`

### 3. Registrasi Akun Warga Baru
* **Endpoint**: `POST /api/auth/register`
* Setiap registrasi mandiri dari publik **otomatis mendapatkan role `citizen`**.

---

## 📌 Rangkuman Matriks Hak Akses Endpoint

| Kategori | Endpoint | Method | Akses | Keterangan |
| :--- | :--- | :---: | :---: | :--- |
| **Kesehatan API** | `/api/ping` | GET | Publik | Status server |
| **Fasilitas Publik** | `/api/facilities` | GET | Publik | Daftar 214 sekolah & pasar (filter ramah disabilitas) |
| **Detail Fasilitas** | `/api/facilities/{id}` | GET | Publik | Detail fasilitas & proyek APBD terkait |
| **Wilayah & GIS** | `/api/regions` | GET | Publik | Daftar 44 kecamatan DKI Jakarta |
| **Batas GIS** | `/api/regions/geojson` | GET | Publik | FeatureCollection GeoJSON batas wilayah kecamatan |
| **Anggaran APBD** | `/api/budget-projects` | GET | Publik | Rekap proyek fisik APBD & persentase serapan |
| **Metrik Equity** | `/api/equity` | GET | Publik | Rasio fasilitas per 10k jiwa & status underserved |
| **ML Clustering** | `/api/analytics/ml-clustering` | GET | Publik | **K-Means Clustering** urgensi wilayah & deteksi anomali |
| **Full Dashboard** | `/api/dashboard` | GET | Publik | **One-stop payload**: Ringkasan KPI + ML Forecast + Clustering |
| **Dashboard KPIs** | `/api/dashboard/overview` | GET | Publik | Rekap KPI fasilitas, APBD per kota, & wilayah tertinggal |
| **ML Prediksi APBD**| `/api/dashboard/budget-predictions` | GET | Publik | **Time-Series Forecast OLS**, Risiko Stagnasi & Rekomendasi 2027 |
| **Lacak Aduan** | `/api/feedback/track/{code}` | GET | Publik | Lacak status tiket aduan (`TP-2026-XXXX`) |
| **Auth** | `/api/auth/login` | POST | Publik | Login Admin & Warga |
| **Auth** | `/api/auth/register` | POST | Publik | Registrasi Warga Baru |
| **Auth Profile** | `/api/auth/me` | GET | Token Warga / Admin | Ambil info akun user login |
| **Auth Logout** | `/api/auth/logout` | POST | Token Warga / Admin | Cabut Bearer token |
| **Aduan Warga** | `/api/feedback` | POST | **Token Warga / Admin** | Kirim laporan fasilitas/disabilitas (wajib login) |
| **Riwayat Aduan** | `/api/citizen/feedbacks` | GET | **Token Warga / Admin** | Lihat semua aduan yang pernah dikirim akun ini |
| **AI Assistant** | `/api/assistant/chat` | POST | **Token Warga / Admin** | Tanya jawab asisten data publik (RAG Gemini) |
| **Admin Fasilitas** | `/api/admin/facilities` | GET, POST | **Token Admin** | Kelola master data fasilitas |
| **Admin Fasilitas** | `/api/admin/facilities/{id}` | PUT, DELETE | **Token Admin** | Edit / Hapus fasilitas publik |
| **Admin Proyek** | `/api/admin/budget-projects` | GET, POST | **Token Admin** | Kelola master data proyek anggaran APBD |
| **Admin Proyek** | `/api/admin/budget-projects/{id}` | PUT, DELETE | **Token Admin** | Edit / Hapus proyek APBD |
| **Admin Aduan** | `/api/admin/feedbacks` | GET | **Token Admin** | Pantau seluruh aduan warga masyarakat |
| **Admin Aduan** | `/api/admin/feedbacks/{id}/respond`| PATCH | **Token Admin** | Verifikasi & tindak lanjut aduan warga |
| **Admin Wilayah** | `/api/admin/regions/{id}` | PUT | **Token Admin** | Update demografi populasi BPS wilayah |

---

## 💡 Detail Request & Response Payload

### 1. Login (`POST /api/auth/login`)
**Request Body**:
```json
{
  "email": "warga@terapublic.jakarta.go.id",
  "password": "password123",
  "device_name": "NextJS-App"
}
```
**Response `200 OK`**:
```json
{
  "status": "success",
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": 2,
      "name": "Warga Jakarta Peduli",
      "email": "warga@terapublic.jakarta.go.id",
      "role": "citizen"
    },
    "token_type": "Bearer",
    "access_token": "2|h9f8d..."
  }
}
```

---

### 2. Machine Learning Analitik (`GET /api/analytics/ml-clustering`)
*Menghasilkan kluster wilayah prioritas intervensi fasilitas berbasis model algoritma K-Means ($k=3$) dan deteksi anomali anggaran.*
**Response `200 OK`**:
```json
{
  "status": "success",
  "algorithm": "K-Means Multi-Dimensional Clustering",
  "model_metadata": {
    "k": 3,
    "features": [
      "population (BPS 2024)",
      "facility_count",
      "ratio_per_10k",
      "disability_compliance_rate",
      "apbd_budget_allocated"
    ],
    "total_districts_analyzed": 44
  },
  "summary": {
    "critical_count": 12,
    "moderate_count": 20,
    "stable_count": 12,
    "anomalies_detected": 4
  },
  "clusters": [
    {
      "label": "Prioritas Intervensi Kritis",
      "urgency": "high",
      "color": "#EF4444",
      "districts": [
        {
          "region_id": 15,
          "name": "Cakung",
          "city": "Kota Jakarta Timur",
          "population": 568390,
          "facility_count": 6,
          "ratio_per_10k": 0.11,
          "disability_rate": 16.67,
          "budget_allocated": 3500000000,
          "cluster_id": 0,
          "cluster_label": "Prioritas Intervensi Kritis",
          "urgency": "high"
        }
      ]
    }
  ],
  "anomalies": [
    {
      "region_id": 15,
      "name": "Cakung",
      "population": 568390,
      "ratio_per_10k": 0.11,
      "reason": "Populasi tinggi namun rasio fasilitas sangat rendah di bawah ambang batas (Defisit Akses)."
    }
  ],
  "policy_recommendations": {
    "critical": "Alokasikan paket revitalisasi fisik APBD prioritas tinggi untuk jalur disabilitas...",
    "moderate": "Percepat serapan anggaran pemeliharaan rutin...",
    "stable": "Pertahankan standar fasilitas inklusif..."
  }
}
```

---

### 3. Machine Learning Prediksi & Forecasting APBD (`GET /api/dashboard/budget-predictions`)
*Menghasilkan proyeksi serapan bulanan (OLS Trend + Seasonality Q4), analisis risiko stagnasi per kecamatan, dan rekomendasi alokasi APBD 2027.*
**Response `200 OK`**:
```json
{
  "status": "success",
  "model": "TeraPublic APBD Fiscal ML Forecaster",
  "models_applied": [
    "Time-Series OLS Trend with Q4 Seasonality Surge",
    "District Capital Absorption Lag & Risk Classifier",
    "Multi-Variate Equity-Driven Budget Allocation Regressor"
  ],
  "time_series_forecast": {
    "historical_months": [
      {
        "periode": "202608",
        "year": 2026,
        "month": 8,
        "total_allocated": 1832361858053460,
        "total_realized": 9653164809915,
        "absorption_rate": 0.53
      }
    ],
    "forecasted_months": [
      {
        "periode": "202609",
        "label": "September 2026",
        "is_prediction": true,
        "predicted_monthly_realized": 11520000000000,
        "predicted_cumulative_realized": 91520000000000,
        "estimated_monthly_rate": 0.63
      },
      {
        "periode": "202612",
        "label": "Desember 2026",
        "is_prediction": true,
        "predicted_monthly_realized": 28400000000000,
        "predicted_cumulative_realized": 154800000000000,
        "estimated_monthly_rate": 1.55
      }
    ],
    "year_end_summary": {
      "fiscal_year": 2026,
      "total_allocated": 1832361858053460,
      "predicted_total_realized": 165000000000000,
      "predicted_absorption_percentage": 92.4,
      "estimated_silpa": 182361858053460,
      "confidence_interval_95": {
        "lower_bound_rate": 88.5,
        "upper_bound_rate": 96.2
      }
    }
  },
  "district_absorption_risks": {
    "summary": {
      "total_districts": 44,
      "high_risk_count": 8,
      "medium_risk_count": 22,
      "low_risk_count": 14
    },
    "rankings": [
      {
        "region_id": 1,
        "name": "Gambir",
        "city": "Kota Jakarta Pusat",
        "project_count": 42,
        "budget_allocated": 85000000000,
        "budget_realized": 62000000000,
        "realization_rate": 72.94,
        "avg_physical_progress": 78.5,
        "disparity_lag": 5.56,
        "risk_level": "LOW_RISK",
        "risk_color": "#10B981",
        "recommendation": "Sesuai Target: Laju penyerapan anggaran sejalan dengan progres fisik di lapangan."
      }
    ]
  },
  "budget_2027_recommendations": {
    "fiscal_year_target": 2027,
    "total_target_pool": 40000000000000,
    "top_priority_districts": [
      {
        "region_id": 36,
        "name": "Cakung",
        "city": "Kota Jakarta Timur",
        "population": 574200,
        "current_ratio_per_10k": 0.1,
        "equity_priority_index": 92.5,
        "recommended_budget_2027": 1850000000000,
        "budget_share_percentage": 4.63
      }
    ]
  },
  "policy_insights": {
    "key_takeaways": [
      "Proyeksi serapan anggaran tahun berjalan diprediksi mencapai 92.4%...",
      "Ditemukan 8 kecamatan dalam kategori High Risk yang memerlukan percepatan..."
    ],
    "strategic_action": "Fokuskan monitoring mingguan pada proyek belanja modal yang memiliki selisih progres fisik di atas 20%..."
  }
}
```

---

### 4. Kirim Laporan Aduan Warga (`POST /api/feedback`)
*Wajib menyertakan Header: `Authorization: Bearer <token_warga>`*
**Request Body**:
```json
{
  "facility_id": 1,
  "title": "Jalur pemandu tuna netra rusak dan terhalang",
  "description": "Tactile paving di pintu gerbang utama mengelupas dan licin saat hujan.",
  "category": "disability_access",
  "photo_url": "https://example.com/photo.jpg",
  "latitude": -6.1751,
  "longitude": 106.8441
}
```
**Response `201 Created`**:
```json
{
  "status": "success",
  "message": "Laporan warga berhasil dikirim dan terdaftar dengan nomor tiket.",
  "data": {
    "id": 3,
    "tracking_code": "TP-2026-X8K1L",
    "citizen_name": "Warga Jakarta Peduli",
    "citizen_email": "warga@terapublic.jakarta.go.id",
    "title": "Jalur pemandu tuna netra rusak dan terhalang",
    "category": "disability_access",
    "status": "submitted"
  }
}
```

---

### 4. Tanya AI Public Assistant RAG (`POST /api/assistant/chat`)
*Wajib menyertakan Header: `Authorization: Bearer <token_warga>`*
**Request Body**:
```json
{
  "message": "Bagaimana kondisi akses disabilitas fasilitas publik di Kecamatan Menteng?"
}
```
**Response `200 OK` (Live Powered by Gemini 2.5 Flash)**:
```json
{
  "status": "success",
  "engine": "gemini-2.5-flash-rag",
  "model": "gemini-2.5-flash",
  "answer": "Halo Bapak/Ibu Warga Jakarta Peduli, terima kasih atas pertanyaan Anda mengenai kondisi aksesibilitas disabilitas di sekolah-sekolah Kecamatan Menteng.\n\nBerdasarkan data resmi TeraPublic DKI Jakarta:\n* Indeks Aksesibilitas Disabilitas Kecamatan Menteng: 63.16% (Memadai / Stabil).\n* Contoh Fasilitas Sekolah:\n  - SMAS PSKD MANDIRI: Dilengkapi Ramp Kursi Roda, Ubin Pemandu (Tactile Paving), dan Toilet Disabilitas.\n  - SMAS YAPERMAS: Dilengkapi Ramp Kursi Roda dan Toilet Disabilitas.\n  - SMAS SANTA THERESIA: Dilengkapi Toilet Disabilitas.\n\nSilakan kirimkan laporan Anda jika menemukan fasilitas yang belum ramah disabilitas di lapangan.",
  "citations": [
    "Fasilitas: SMAS PSKD MANDIRI",
    "Fasilitas: SMAS YAPERMAS JAKARTA",
    "Fasilitas: SMAS SANTA THERESIA JAKARTA",
    "Proyek APBD: Pengadaan & Optimalisasi Aset Publik"
  ],
  "matched_region": "MENTENG"
}
```

---

### 5. Riwayat Laporan Aduan Saya (`GET /api/citizen/feedbacks`)
*Wajib Header: `Authorization: Bearer <token_warga>`*
**Response `200 OK`**:
```json
{
  "status": "success",
  "total": 1,
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "facility_id": 15,
      "tracking_code": "TP-2026-0001",
      "citizen_name": "Warga Jakarta Peduli",
      "citizen_email": "warga@terapublic.jakarta.go.id",
      "title": "Ramp kursi roda licin dan terhalang pedagang",
      "description": "Akses jalur difabel di pintu masuk tertutup gerobak semi-permanen.",
      "category": "disability_access",
      "status": "verified",
      "admin_response": "Laporan telah diverifikasi oleh Satpol PP & Dinas Bina Marga. Penertiban dijadwalkan minggu depan.",
      "created_at": "2026-10-27T15:20:00.000000Z",
      "facility": {
        "id": 15,
        "name": "SDN Menteng 01 Pagi",
        "region": {
          "id": 6,
          "name": "Menteng",
          "city": "Kota Jakarta Pusat"
        }
      }
    }
  ]
}
```

---

### 6. Admin: Tanggapi Laporan Warga (`PATCH /api/admin/feedbacks/{id}/respond`)
*Wajib Header: `Authorization: Bearer <token_admin>`*
**Request Body**:
```json
{
  "status": "resolved",
  "admin_response": "Perbaikan ramp kursi roda telah selesai dilakukan oleh Suku Dinas Bina Marga Jakarta Pusat."
}
```

---

## 🗺️ Panduan Mapping Halaman Frontend ke API (Page-to-Endpoint Guide)

Agar pacar Anda mudah menata rute halaman Next.js, berikut panduan pemetaannya:

| Rute Halaman Next.js | Komponen UI yang Disarankan | Endpoint Backend yang Dipanggil |
| :--- | :--- | :--- |
| **`/` (Beranda / Dashboard)** | Ringkasan KPI, Grafik Proyeksi APBD, Peta Sebaran Kluster | `GET /api/dashboard` *(One-stop fetch)* |
| **`/map` (Peta Interaktif)** | Leaflet GIS Map + Filter Fasilitas Disabilitas | `GET /api/facilities` & `GET /api/regions/geojson` |
| **`/budget` (Monitoring APBD)** | Tabel Proyek Fisik, Serapan Anggaran, Risk Gauge | `GET /api/budget-projects` & `GET /api/dashboard/budget-predictions` |
| **`/equity` (Analisis Ketimpangan)**| Bar Chart Rasio Fasilitas per 10k & 3 Kluster ML | `GET /api/equity` & `GET /api/analytics/ml-clustering` |
| **`/login`** | Formulir Email & Password (Unified Login) | `POST /api/auth/login` |
| **`/register`** | Formulir Pendaftaran Akun Warga Baru | `POST /api/auth/register` |
| **`/feedback` (Form Lapor)** | Form Aduan Fasilitas / Disabilitas (Wajib Login) | `POST /api/feedback` *(Header: Bearer Token)* |
| **`/my-reports` (Aduan Saya)**| Daftar Status Tiket & Jawaban Admin Petugas | `GET /api/citizen/feedbacks` *(Header: Bearer Token)* |
| **`/track` (Lacak Publik)** | Input Kode Tiket (`TP-2026-XXXX`) tanpa login | `GET /api/feedback/track/{code}` |
| **Floating Chatbot Widget** | Modal Dialog Chatbox Asisten AI Publik TeraPublic | `POST /api/assistant/chat` *(Gemini 2.5 Flash RAG)* |
| **`/admin/*` (Portal Admin)** | CRUD Fasilitas, Anggaran, & Verifikasi Aduan | `GET/POST/PUT/DELETE /api/admin/*` |

---

## 🏷️ TypeScript Interfaces (Siap Pakai untuk Next.js)

Salin kode di bawah ini ke file `frontend/src/types/terapublic.ts`:

```typescript
export type UserRole = 'admin' | 'citizen';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token_type: string;
    access_token: string;
  };
}

export interface PublicFacility {
  id: number;
  name: string;
  sub_category?: string;
  npsn?: string;
  address?: string;
  latitude: number;
  longitude: number;
  status: 'operational' | 'renovation' | 'closed';
  is_state_owned: boolean;
  capacity?: number;
  has_wheelchair_ramp: boolean;
  has_tactile_paving: boolean;
  has_disabled_toilet: boolean;
  public_transport_nearby?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  region?: {
    id: number;
    name: string;
    city: string;
  };
}

export interface BudgetProject {
  id: number;
  facility_id?: number | null;
  region_id: number;
  project_name: string;
  fiscal_year: number;
  funding_source: string;
  budget_allocated: number;
  budget_realized: number;
  status: 'planning' | 'procurement' | 'in_progress' | 'completed';
  contractor_name?: string;
  start_date?: string;
  target_completion_date?: string;
  progress_percentage: number;
  region?: {
    id: number;
    name: string;
    city: string;
  };
}

export interface CitizenFeedback {
  id: number;
  user_id?: number;
  facility_id?: number | null;
  tracking_code: string;
  citizen_name: string;
  citizen_email?: string;
  title: string;
  description: string;
  category: 'damage' | 'disability_access' | 'project_delay' | 'cleanliness';
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  status: 'submitted' | 'verified' | 'in_review' | 'resolved' | 'rejected';
  admin_response?: string;
  resolved_at?: string;
  created_at: string;
  facility?: PublicFacility;
}

export interface AiChatResponse {
  status: string;
  engine: string;
  model: string;
  answer: string;
  citations: string[];
  matched_region?: string;
}

export interface MLClusterItem {
  region_id: number;
  name: string;
  city: string;
  population: number;
  facility_count: number;
  ratio_per_10k: number;
  disability_rate: number;
  budget_allocated: number;
  cluster_id: number;
  cluster_label: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface MLClusteringResponse {
  status: string;
  algorithm: string;
  silhouette_score?: number;
  summary: {
    critical_count: number;
    moderate_count: number;
    stable_count: number;
    anomalies_detected: number;
  };
  clusters: {
    label: string;
    urgency: string;
    color: string;
    districts: MLClusterItem[];
  }[];
  anomalies: {
    region_id: number;
    name: string;
    population: number;
    ratio_per_10k: number;
    reason: string;
  }[];
}

export interface DashboardOverview {
  kpis: {
    total_facilities: number;
    accessible_facilities: number;
    accessibility_percentage: number;
    total_budget_allocated: number;
    total_budget_realized: number;
    realization_percentage: number;
    total_projects: number;
    total_districts: number;
    underserved_districts: number;
    total_citizen_feedbacks: number;
    resolved_citizen_feedbacks: number;
  };
  top_underserved: any[];
  city_breakdown: {
    city: string;
    district_count: number;
    facility_count: number;
    budget_allocated: number;
    budget_realized: number;
    realization_rate: number;
  }[];
}
```
