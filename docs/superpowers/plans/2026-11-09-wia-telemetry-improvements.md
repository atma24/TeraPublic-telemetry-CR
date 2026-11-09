# TeraPublic WIA 2026 Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghadirkan visualisasi telemetri interaktif di `/analitik`, modul partisipasi publik dua arah di `/lacak?tab=publik`, dan optimalisasi UX navigasi 1-klik di Landing Page untuk menindaklanjuti rekomendasi evaluasi FDS WIA 2026.

**Architecture:** Pendekatan End-to-End Reactive Integration: penambahan kolom konfirmasi warga di tabel PostgreSQL via Laravel 13 migration, endpoint publik tersanitasi di Laravel API, suite Recharts terpadu di Next.js App Router, serta interaktivitas *frictionless* client-side token di frontend.

**Tech Stack:** Laravel 13 (PHP 8.5), PostgreSQL 18, Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Recharts, Lucide React, Pest/PHPUnit.

**Spec:** [`docs/superpowers/specs/2026-11-09-wia-telemetry-improvements-design.md`](file:///C:/Users/miles/OneDrive/Documents/GitHub/TeraPublic-telemetry-CR/docs/superpowers/specs/2026-11-09-wia-telemetry-improvements-design.md)

## Global Constraints
- **DILARANG MERUBAH TEMA/DESAIN UI**: Seluruh komponen baru wajib 100% menggunakan design tokens yang sudah ada di `frontend/src/app/globals.css` (`--surface`, `--border`, `--interactive`, `--chart-1..5`, dll.).
- **TIDAK MENGGUNAKAN JARGON MEDIA SOSIAL**: Gunakan istilah akuntabilitas sipil: *"Konfirmasi Lapangan"* atau *"Saya Mengalami Kendala Serupa"*, bukan *"upvote"*.
- **PRIVASI DATA**: Jangan pernah mengekspos `citizen_email` atau `user_id` pada feed publik.
- **INTEGRITAS DATA RIIL**: Menggunakan data riil PostgreSQL yang sudah ada (214 fasilitas, 1.731 proyek APBD, 44 kecamatan).
- **LARANGAN EDIT**: Jangan mengedit atau menghapus isi `vendor/`, `node_modules/`, `.next/`, atau `build/`.

## Review Focus
1. `GET /api/feedbacks/public` dengan status selain `verified`/`in_review`/`resolved` (misal `submitted` atau `rejected`) — tidak boleh bocor ke feed publik.
2. `POST /api/feedbacks/{id}/confirm` dengan ID yang tidak ada — harus return `404 Not Found` terstruktur.
3. Multiple click pada tombol konfirmasi lapangan di frontend — harus dicegah dan disabled jika ID laporan sudah ada di `localStorage`.
4. Render Recharts pada layar mobile sempit (< 380px) — container chart tidak boleh overflow horizontal atau merusak layout grid.
5. Parameter `?tab=publik` pada `/lacak` saat network backend offline/lambat — harus menampilkan error/empty state yang anggun sesuai komponen `ErrorState` yang ada.

---

### Task 1: Backend Database Migration & Model Update

**Files:**
- Create: `backend/database/migrations/2026_11_09_000001_add_confirmations_count_to_citizen_feedbacks_table.php`
- Modify: `backend/app/Models/CitizenFeedback.php`
- Test: `backend/tests/Feature/CitizenFeedbackMigrationTest.php`

**Interfaces:**
- Consumes: Database table `citizen_feedbacks`
- Produces: Column `confirmations_count` (unsigned integer default 0) pada model `CitizenFeedback`

- [ ] **Step 1: Write the failing test**

```php
// backend/tests/Feature/CitizenFeedbackMigrationTest.php
namespace Tests\Feature;

use App\Models\CitizenFeedback;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CitizenFeedbackMigrationTest extends TestCase
{
    public function test_citizen_feedbacks_table_has_confirmations_count_column(): void
    {
        $this->assertTrue(Schema::hasColumn('citizen_feedbacks', 'confirmations_count'));
    }

    public function test_citizen_feedback_model_casts_confirmations_count_to_integer(): void
    {
        $feedback = new CitizenFeedback(['confirmations_count' => '5']);
        $this->assertSame(5, $feedback->confirmations_count);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && php artisan test --filter=CitizenFeedbackMigrationTest`  
Expected: FAIL with column `confirmations_count` not found.

- [ ] **Step 3: Implement migration and update model**

Buat file migration `2026_11_09_000001_add_confirmations_count_to_citizen_feedbacks_table.php`:
```php
Schema::table('citizen_feedbacks', function (Blueprint $table) {
    $table->unsignedInteger('confirmations_count')->default(0)->after('status');
});
```
Update `backend/app/Models/CitizenFeedback.php`:
- Tambahkan `'confirmations_count'` ke `$fillable`.
- Tambahkan `'confirmations_count' => 'integer'` ke `$casts`.

Jalankan: `cd backend && php artisan migrate`

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && php artisan test --filter=CitizenFeedbackMigrationTest`  
Expected: PASS (2 passed)

- [ ] **Step 5: Commit**

```bash
git add backend/database/migrations/*confirmations_count* backend/app/Models/CitizenFeedback.php backend/tests/Feature/CitizenFeedbackMigrationTest.php
git commit -m "feat(backend): add confirmations_count column and cast to CitizenFeedback"
```

---

### Task 2: Backend Overview Enhancement & Public Feedback APIs

**Files:**
- Modify: `backend/app/Http/Controllers/Api/DashboardController.php:28-40`
- Modify: `backend/app/Http/Controllers/Api/CitizenFeedbackController.php`
- Modify: `backend/routes/api.php:50-60`
- Create: `backend/tests/Feature/CitizenFeedbackPublicTest.php`

**Interfaces:**
- Consumes: `PublicFacility`, `CitizenFeedback`, `Region`
- Produces:
  - `GET /api/dashboard/overview`: `kpis` memuat `ramp_count`, `tactile_count`, `toilet_count` (integer)
  - `GET /api/feedbacks/public`: JSON collection laporan terverifikasi dengan data PII tersanitasi
  - `POST /api/feedbacks/{id}/confirm`: JSON status sukses dan `confirmations_count` terbaru

- [ ] **Step 1: Write the failing tests**

```php
// backend/tests/Feature/CitizenFeedbackPublicTest.php
namespace Tests\Feature;

use App\Models\CitizenFeedback;
use App\Models\PublicFacility;
use Tests\TestCase;

class CitizenFeedbackPublicTest extends TestCase
{
    public function test_dashboard_overview_returns_disability_breakdown_counts(): void
    {
        $response = $this->getJson('/api/dashboard/overview');
        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'kpis' => ['ramp_count', 'tactile_count', 'toilet_count'],
            ],
        ]);
    }

    public function test_can_fetch_public_feedbacks_with_sanitized_pii(): void
    {
        $response = $this->getJson('/api/feedbacks/public');
        $response->assertOk();
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => ['id', 'tracking_code', 'title', 'category', 'status', 'confirmations_count', 'facility'],
            ],
        ]);
        // Pastikan PII tidak diekspos
        $content = $response->getContent();
        $this->assertStringNotContainsString('"citizen_email"', $content);
        $this->assertStringNotContainsString('"user_id"', $content);
    }

    public function test_can_confirm_citizen_feedback_urgency(): void
    {
        $feedback = CitizenFeedback::firstOrCreate(
            ['tracking_code' => 'TP-TEST-001'],
            ['title' => 'Test', 'description' => 'Test desc', 'category' => 'damage', 'status' => 'verified']
        );
        $initial = $feedback->confirmations_count;

        $response = $this->postJson("/api/feedbacks/{$feedback->id}/confirm");
        $response->assertOk();
        $response->assertJson([
            'status' => 'success',
            'confirmations_count' => $initial + 1,
        ]);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && php artisan test --filter=CitizenFeedbackPublicTest`  
Expected: FAIL with 404 on `/api/feedbacks/public` and missing JSON structure.

- [ ] **Step 3: Implement endpoints and controller logic**

1. Update `backend/app/Http/Controllers/Api/DashboardController.php`:
   - Di method `overview()`, tambahkan ke array `$kpis`:
     ```php
     'ramp_count' => PublicFacility::where('has_wheelchair_ramp', true)->count(),
     'tactile_count' => PublicFacility::where('has_tactile_paving', true)->count(),
     'toilet_count' => PublicFacility::where('has_disabled_toilet', true)->count(),
     ```
2. Update `backend/app/Http/Controllers/Api/CitizenFeedbackController.php`:
   - Tambahkan method `publicFeedbacks(Request $request)`:
     ```php
     public function publicFeedbacks(Request $request): JsonResponse
     {
         $query = CitizenFeedback::with('facility.region')
             ->whereIn('status', ['verified', 'in_review', 'resolved']);

         if ($request->filled('category')) {
             $query->where('category', $request->query('category'));
         }

         $sort = $request->query('sort', 'latest');
         if ($sort === 'most_confirmed') {
             $query->orderBy('confirmations_count', 'desc')->orderBy('created_at', 'desc');
         } else {
             $query->orderBy('created_at', 'desc');
         }

         $feedbacks = $query->paginate((int) $request->query('per_page', 10));

         // Mask / sanitize PII
         $feedbacks->getCollection()->transform(function ($item) {
             $item->makeHidden(['citizen_email', 'user_id']);
             $item->citizen_name = $item->citizen_name ? mb_substr($item->citizen_name, 0, 3) . '***' : 'Warga Jakarta';
             return $item;
         });

         return response()->json([
             'status' => 'success',
             'data' => $feedbacks->items(),
             'meta' => [
                 'current_page' => $feedbacks->currentPage(),
                 'last_page' => $feedbacks->lastPage(),
                 'total' => $feedbacks->total(),
             ],
         ]);
     }

     public function confirm(int $id): JsonResponse
     {
         $feedback = CitizenFeedback::findOrFail($id);
         $feedback->increment('confirmations_count');

         return response()->json([
             'status' => 'success',
             'message' => 'Konfirmasi kondisi lapangan berhasil dicatat.',
             'confirmations_count' => (int) $feedback->fresh()->confirmations_count,
         ]);
     }
     ```
3. Daftarkan di `backend/routes/api.php`:
   ```php
   Route::get('/feedbacks/public', [CitizenFeedbackController::class, 'publicFeedbacks']);
   Route::post('/feedbacks/{id}/confirm', [CitizenFeedbackController::class, 'confirm']);
   ```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && php artisan test --filter=CitizenFeedbackPublicTest`  
Expected: PASS (3 passed)

- [ ] **Step 5: Commit**

```bash
git add backend/app/Http/Controllers/Api/DashboardController.php backend/app/Http/Controllers/Api/CitizenFeedbackController.php backend/routes/api.php backend/tests/Feature/CitizenFeedbackPublicTest.php
git commit -m "feat(backend): add public feedbacks feed, confirm action, and disability breakdown KPIs"
```

---

### Task 3: Frontend Telemetry Visual Components for `/analitik`

**Files:**
- Modify: `frontend/src/types/public.ts` (tambahkan `ramp_count`, `tactile_count`, `toilet_count` pada `DashboardOverview`)
- Create: `frontend/src/components/insight/district-budget-bar-chart.tsx`
- Create: `frontend/src/components/insight/disability-access-chart.tsx`
- Create: `frontend/src/components/insight/risk-districts-table.tsx`
- Modify: `frontend/src/app/(public)/analitik/page.tsx`

**Interfaces:**
- Consumes: `DashboardOverview` (city_breakdown, kpis), `MLClusteringResponse` (clusters, anomalies)
- Produces: Tampilan visual interaktif Recharts + filterable table yang selaras dengan theme CSS tokens

- [ ] **Step 1: Update TypeScript types in `frontend/src/types/public.ts`**

Tambahkan field opsional/wajib ke `DashboardOverview['kpis']`:
```typescript
ramp_count?: number;
tactile_count?: number;
toilet_count?: number;
```

- [ ] **Step 2: Create `DistrictBudgetBarChart` in `frontend/src/components/insight/district-budget-bar-chart.tsx`**

Komponen Client Recharts (`"use client"`):
- Menerima `cityBreakdown: CityBreakdown[]`.
- Merender `ResponsiveContainer`, `BarChart`, `XAxis`, `YAxis`, `Tooltip`, `Legend`.
- Menggunakan CSS variable colors: `--chart-3` (#15324b / navy) untuk Alokasi, `--chart-1` (#0f766e / teal) untuk Realisasi.
- Tooltip memformat angka menggunakan `formatCompactRupiah`.

- [ ] **Step 3: Create `DisabilityAccessChart` in `frontend/src/components/insight/disability-access-chart.tsx`**

Komponen Client Recharts (`"use client"`):
- Menerima `ramp: number`, `tactile: number`, `toilet: number`.
- Merender `PieChart` / Donut chart interaktif dengan legend dan tooltip interaktif.
- Warna slice: `--chart-1` (Ramp), `--chart-2` (Ubin Pemandu), `--chart-4` (Toilet Difabel).

- [ ] **Step 4: Create `RiskDistrictsTable` in `frontend/src/components/insight/risk-districts-table.tsx`**

Komponen Client (`"use client"`):
- Menerima data klaster/wilayah dari clustering dan prediksi serapan.
- Memiliki input search instan (nama kecamatan).
- Memiliki filter pill: Semua, Prioritas Tinggi (Kritis), Perlu Perhatian (Moderat), Relatif Stabil.
- Menampilkan indikator persentase serapan, jumlah fasilitas disabilitas, dan tombol link cepat menuju direktori data `/data?search={kecamatan}`.

- [ ] **Step 5: Integrate charts & table into `frontend/src/app/(public)/analitik/page.tsx`**

Panggil `getDashboardOverview()` di `AnalyticsPage`, lalu integrasikan ketiga komponen baru tersebut ke dalam grid section yang rapi, mempertahankan `PageHeader`, `SectionHeading`, dan cards yang ada tanpa mengubah layout dasar.

- [ ] **Step 6: Verify TypeScript and Lint**

Run: `cd frontend && npm run typecheck && npm run lint`  
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/types/public.ts frontend/src/components/insight/district-budget-bar-chart.tsx frontend/src/components/insight/disability-access-chart.tsx frontend/src/components/insight/risk-districts-table.tsx frontend/src/app/\(public\)/analitik/page.tsx
git commit -m "feat(frontend): add interactive budget bar chart, disability donut chart, and risk districts table"
```

---

### Task 4: Frontend Civic Feed & Field Confirmation on `/lacak`

**Files:**
- Modify: `frontend/src/lib/api/public.ts` (tambahkan `getPublicFeedbacks`, `confirmFeedback`)
- Modify: `frontend/src/types/public.ts` (tambahkan type `PublicFeedbackResponse`)
- Create: `frontend/src/components/feedback/public-feed-list.tsx`
- Create: `frontend/src/components/feedback/public-feedback-card.tsx`
- Modify: `frontend/src/app/(public)/lacak/page.tsx`

**Interfaces:**
- Consumes: `GET /api/feedbacks/public`, `POST /api/feedbacks/{id}/confirm`
- Produces: Halaman `/lacak` dengan tab switcher `?tab=lacak` dan `?tab=publik`

- [ ] **Step 1: Add API client functions in `frontend/src/lib/api/public.ts`**

```typescript
export async function getPublicFeedbacks(params?: { category?: string; sort?: string; page?: number }) {
  return publicFetch<PaginatedResponse<CitizenFeedback>>("/feedbacks/public", {
    query: params as Record<string, string | number | boolean | undefined>,
    revalidate: 60,
  });
}

export async function confirmFeedback(id: number): Promise<{ status: string; confirmations_count: number }> {
  // Client fetch ke API endpoint
  const res = await fetch(`/api/feedbacks/${id}/confirm`, { method: "POST" });
  return res.json();
}
```

- [ ] **Step 2: Create `PublicFeedbackCard` & `PublicFeedList`**

- `PublicFeedbackCard`: Menampilkan judul, fasilitas terkait, kategori, foto, status badge (Terverifikasi / Ditindaklanjuti / Selesai), tanggapan pemda jika ada, dan tombol **"Konfirmasi Kondisi Lapangan"**.
- Tombol konfirmasi membaca `localStorage.getItem("tp_confirmed_feedbacks")`. Jika ID sudah ada, tombol berstatus "Telah Dikonfirmasi" (disabled). Jika ditekan, lakukan optimistik update `confirmations_count + 1` dan panggil endpoint backend.

- [ ] **Step 3: Update `frontend/src/app/(public)/lacak/page.tsx`**

- Baca `searchParams.tab`. Jika `params.tab === "publik"`, render `PublicFeedList`. Jika tidak, render form pelacakan tiket mandiri seperti semula.
- Tambahkan tab bar navigasi di bawah header:
  - Tab 1: **Lacak Tiket Mandiri** (`/lacak?tab=lacak`)
  - Tab 2: **Feed Laporan Terbuka** (`/lacak?tab=publik`)

- [ ] **Step 4: Verify TypeScript and Lint**

Run: `cd frontend && npm run typecheck && npm run lint`  
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/api/public.ts frontend/src/types/public.ts frontend/src/components/feedback/public-feed-list.tsx frontend/src/components/feedback/public-feedback-card.tsx frontend/src/app/\(public\)/lacak/page.tsx
git commit -m "feat(frontend): add public civic feedback feed and frictionless confirmation in /lacak"
```

---

### Task 5: Frontend Homepage UX Optimization (`LiveTelemetryRadar`)

**Files:**
- Create: `frontend/src/components/home/live-telemetry-radar.tsx`
- Modify: `frontend/src/app/(public)/page.tsx:197-260`

**Interfaces:**
- Consumes: `DashboardOverview`, `PublicFacility[]`
- Produces: Interactive hero card with live tabs (APBD, Aksesibilitas, Suara Warga) and 1-click CTA buttons

- [ ] **Step 1: Create `LiveTelemetryRadar` in `frontend/src/components/home/live-telemetry-radar.tsx`**

Komponen Client (`"use client"`):
- Menggunakan styling card yang persis dengan Hero Right Widget sebelumnya (`rounded-2xl border border-border/80 bg-surface/95 p-1 shadow-lift`).
- Header menampilkan status live indicator (hijau berkedip: `SYS // LIVE TELEMETRY`).
- Memiliki 3 tab mini di header widget:
  1. **APBD**: Menampilkan Rp 10.64T realisasi / Rp 81.7T alokasi + visual progress bar ringkas.
  2. **Disabilitas**: Menampilkan persentase 58.4% + rincian ramp, ubin, toilet.
  3. **Warga**: Menampilkan jumlah aduan + laporan terverifikasi terkini.
- Memiliki tombol CTA langsung:
  - Tombol primer: **"Buka Telemetri Lengkap →"** mengarah ke `/analitik`.
  - Tombol sekunder: **"Pantau Laporan Warga →"** mengarah ke `/lacak?tab=publik`.

- [ ] **Step 2: Replace hero static widget in `frontend/src/app/(public)/page.tsx`**

Gantikan konten inner kartu statis pada kolom kanan Hero dengan `<LiveTelemetryRadar overview={overview} isOnline={isOnline} />`.

- [ ] **Step 3: Verify TypeScript, Lint, and Mobile Build**

Run: `cd frontend && npm run typecheck && npm run lint`  
Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/home/live-telemetry-radar.tsx frontend/src/app/\(public\)/page.tsx
git commit -m "feat(frontend): upgrade hero ledger into LiveTelemetryRadar with 1-click quick access"
```

---

### Task 6: End-to-End Verification & Quality Checks

**Files:**
- Inspection: Backend tests, frontend build, database integrity

- [ ] **Step 1: Run complete backend test suite**

Run: `cd backend && php artisan test`  
Expected: All tests pass (min. 21 passed).

- [ ] **Step 2: Run frontend production build**

Run: `cd frontend && npm run build`  
Expected: Next.js build succeeds with 0 errors.

- [ ] **Step 3: Review git status and git diff**

Run: `git status && git diff --stat`  
Expected: Only relevant files created/modified, no stray files.

- [ ] **Step 4: Final verification commit if needed**

```bash
git commit -m "chore: complete WIA 2026 telemetry and civic participation improvements"
```
