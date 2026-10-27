# TeraPublic — Panduan Integrasi REST API (Frontend Developer Guide)

Dokumen ini adalah panduan lengkap kontrak API backend TeraPublic (Laravel 13) untuk mempermudah integrasi dengan antarmuka frontend (Next.js / React).

---

## 🚀 Cara Menjalankan Backend Lokal

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Jalankan server Laravel:
   ```bash
   php artisan serve
   ```
3. API aktif di: **`http://127.0.0.1:8000/api`**
4. CORS sudah diaktifkan secara otomatis (`allowed_origins: ['*']`), sehingga frontend di `http://localhost:3000` tidak akan mengalami kendala *CORS policy*.

---

## 📌 Daftar Endpoint Lengkap

### 1. Health Check
* **Endpoint**: `GET /api/ping`
* **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "app": "TeraPublic API",
    "version": "1.0.0"
  }
  ```

---

### 2. Fasilitas Publik (Sekolah & Pasar)
* **Endpoint**: `GET /api/facilities`
* **Query Parameters (Opsional)**:
  * `category`: `'sekolah'` atau `'pasar-tradisional'`
  * `sub_category`: `'SD'`, `'SMP'`, `'SMA'`, `'SMK'`, `'Pasar Rakyat'`
  * `region_id`: filter ID kecamatan (1 s/d 44)
  * `has_wheelchair_ramp`: `1` (Hanya yang memiliki ramp kursi roda)
  * `has_tactile_paving`: `1` (Hanya yang memiliki guiding block disabilitas netra)
  * `has_disabled_toilet`: `1` (Hanya yang memiliki toilet disabilitas)
  * `search`: kata kunci pencarian nama fasilitas atau alamat jalan
  * `per_page`: jumlah data per halaman (default: `50`, max: `100`)
* **Contoh Request**: `GET /api/facilities?category=sekolah&has_wheelchair_ramp=1&per_page=10`
* **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "category_id": 1,
        "region_id": 1,
        "name": "SMAN 4 JAKARTA",
        "sub_category": "SMA",
        "npsn": "20100211",
        "address": "JL. BATU NO. 3 GAMBIR",
        "latitude": -6.1788,
        "longitude": 106.8356,
        "status": "operational",
        "is_state_owned": true,
        "capacity": 1080,
        "has_wheelchair_ramp": true,
        "has_tactile_paving": true,
        "has_disabled_toilet": true,
        "public_transport_nearby": "Transjakarta / JakLingko",
        "category": {
          "id": 1,
          "name": "Sekolah",
          "slug": "sekolah"
        },
        "region": {
          "id": 1,
          "name": "GAMBIR",
          "city": "Kota Jakarta Pusat"
        }
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 22,
      "per_page": 10,
      "total": 214
    }
  }
  ```

* **Detail Fasilitas**: `GET /api/facilities/{id}`
  * Mengembalikan data lengkap fasilitas beserta riwayat proyek pembangunan anggaran (`budgetProjects`) dan laporan warga terkait (`feedbacks`).

---

### 3. Wilayah & Batas Spasial GIS (GeoJSON)
* **Daftar Kecamatan**: `GET /api/regions`
  * Mengembalikan 44 kecamatan di DKI Jakarta lengkap dengan jumlah penduduk BPS 2024, luas wilayah ($km^2$), dan metrik pemerataan.
* **Batas Spasial Leaflet/Mapbox**: `GET /api/regions/geojson`
  * Mengembalikan GeoJSON standar bertipe `FeatureCollection`. Sangat praktis untuk langsung dirender di Leaflet via `L.geoJSON(data)`.
  * **Contoh Isi Properties Tiap Poligon**:
    ```json
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "code": "31.71.01",
        "name": "GAMBIR",
        "city": "Kota Jakarta Pusat",
        "population": 96420,
        "area_km2": 7.59,
        "facility_count": 8,
        "ratio_per_10k": 0.83,
        "accessibility_score": 62.5,
        "is_underserved": false
      },
      "geometry": { ... }
    }
    ```

---

### 4. Monitoring Anggaran & Proyek (APBN / APBD)
* **Endpoint**: `GET /api/budget-projects`
* **Query Parameters (Opsional)**:
  * `fiscal_year`: `2025` atau `2026`
  * `funding_source`: `'APBD_DKI'` atau `'APBN'`
  * `status`: `'planning'`, `'procurement'`, `'in_progress'`, `'completed'`
* **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "summary": {
      "total_projects": 4,
      "total_budget_allocated": 91700000000,
      "total_budget_realized": 70900000000,
      "realization_percentage": 77.32
    },
    "data": [
      {
        "id": 1,
        "project_name": "Rehabilitasi Total Gedung SMAN 1 Jakarta",
        "fiscal_year": 2025,
        "funding_source": "APBD_DKI",
        "budget_allocated": 18500000000,
        "budget_realized": 18200000000,
        "status": "completed",
        "contractor_name": "PT Jaya Konstruksi Manggala Pratama Tbk",
        "progress_percentage": 100
      }
    ]
  }
  ```

---

### 5. Analitik Pemerataan Wilayah (Equity Index)
* **Endpoint**: `GET /api/equity`
* **Kegunaan**: Menampilkan ranking kecamatan dari yang paling tertinggal (*underserved*) hingga yang paling memadai ketersediaan fasilitas publiknya.
* **Response `200 OK`**:
  ```json
  {
    "status": "success",
    "summary": {
      "total_districts": 44,
      "underserved_count": 18,
      "adequate_count": 26,
      "average_ratio": 0.52,
      "average_accessibility": 54.2
    },
    "rankings": [
      {
        "region_id": 9,
        "region": {
          "name": "PENJARINGAN",
          "city": "Kota Jakarta Utara",
          "population": 312500
        },
        "facility_count": 4,
        "ratio_per_10k_population": 0.13,
        "accessibility_score": 50,
        "is_underserved": true
      }
    ]
  }
  ```

---

### 6. Pelaporan Masyarakat (Civic Reporting)
* **Kirim Laporan**: `POST /api/feedback`
  * **Headers**: `Content-Type: application/json`
  * **Request Body**:
    ```json
    {
      "facility_id": 1,
      "citizen_name": "Dewi Lestari",
      "citizen_email": "dewi@example.com",
      "title": "Akses ramp kursi roda tertutup pedagang",
      "description": "Ramp kursi roda di pintu timur terhalang lapak.",
      "category": "disability_access",
      "latitude": -6.1751,
      "longitude": 106.8441
    }
    ```
    *Kategori yang valid: `damage`, `disability_access`, `project_delay`, `cleanliness`.*
  * **Response `201 Created`**:
    ```json
    {
      "status": "success",
      "message": "Laporan warga berhasil dikirim dan diverifikasi.",
      "data": {
        "id": 1,
        "tracking_code": "TP-2026-X8B2Y",
        "title": "Akses ramp kursi roda tertutup pedagang",
        "status": "submitted"
      }
    }
    ```

* **Lacak Status Laporan**: `GET /api/feedback/track/{tracking_code}`
  * Contoh: `GET /api/feedback/track/TP-2026-X8B2Y`
  * Mengembalikan detail laporan warga dan tanggapan resmi dari dinas terkait (`admin_response`).

---

## 💻 Tipe Data TypeScript (Copy-Paste Ready)

Jika pacar Anda membutuhkan tipe data TypeScript di Next.js, ini tipe yang sudah disesuaikan persis dengan response JSON di atas:

```typescript
export interface PublicFacility {
  id: number;
  category_id: number;
  region_id: number;
  name: string;
  sub_category?: string;
  npsn?: string | null;
  address?: string;
  latitude: number;
  longitude: number;
  status: 'operational' | 'renovation' | 'closed';
  is_state_owned: boolean;
  capacity: number;
  has_wheelchair_ramp: boolean;
  has_tactile_paving: boolean;
  has_disabled_toilet: boolean;
  public_transport_nearby?: string;
  category?: { id: number; name: string; slug: string };
  region?: { id: number; name: string; city: string };
}

export interface BudgetProject {
  id: number;
  project_name: string;
  fiscal_year: number;
  funding_source: string;
  budget_allocated: number;
  budget_realized: number;
  status: 'planning' | 'procurement' | 'in_progress' | 'completed';
  contractor_name?: string;
  progress_percentage: number;
}

export interface EquityMetric {
  region_id: number;
  facility_count: number;
  ratio_per_10k_population: number;
  accessibility_score: number;
  equity_index: number;
  is_underserved: boolean;
  region?: { id: number; name: string; city: string; population: number };
}

export interface CitizenFeedback {
  id: number;
  tracking_code: string;
  citizen_name: string;
  citizen_email?: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'verified' | 'in_review' | 'resolved' | 'rejected';
  admin_response?: string;
}
```
