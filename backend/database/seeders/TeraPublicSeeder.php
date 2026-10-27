<?php

namespace Database\Seeders;

use App\Models\BudgetProject;
use App\Models\CitizenFeedback;
use App\Models\EquityMetric;
use App\Models\FacilityCategory;
use App\Models\PublicFacility;
use App\Models\Region;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class TeraPublicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding TeraPublic master data...');

        // 0. Default Users (Admin & Warga)
        User::firstOrCreate(
            ['email' => 'admin@terapublic.jakarta.go.id'],
            [
                'name' => 'Administrator TeraPublic',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );
        $this->command->info('Created default admin: admin@terapublic.jakarta.go.id (role: admin)');

        User::firstOrCreate(
            ['email' => 'warga@terapublic.jakarta.go.id'],
            [
                'name' => 'Warga Jakarta Peduli',
                'password' => Hash::make('password123'),
                'role' => 'citizen',
            ]
        );
        $this->command->info('Created sample citizen: warga@terapublic.jakarta.go.id (role: citizen)');

        // 1. Categories
        $schoolCat = FacilityCategory::firstOrCreate(
            ['slug' => 'sekolah'],
            [
                'name' => 'Sekolah',
                'icon_name' => 'graduation-cap',
                'description' => 'Fasilitas pendidikan negeri dan swasta (SD, SMP, SMA, SMK)',
            ]
        );

        $marketCat = FacilityCategory::firstOrCreate(
            ['slug' => 'pasar-tradisional'],
            [
                'name' => 'Pasar Tradisional',
                'icon_name' => 'store',
                'description' => 'Pasar rakyat dan pasar tradisional binaan Perumda Pasar Jaya',
            ]
        );

        // 2. Regions
        $regionsPath = base_path('../data/seeders/regions_jakarta.json');
        if (File::exists($regionsPath)) {
            $regionsData = json_decode(File::get($regionsPath), true);
            foreach ($regionsData as $r) {
                Region::updateOrCreate(
                    ['id' => $r['id']],
                    [
                        'code' => $r['code'],
                        'name' => $r['name'],
                        'city' => $r['city'],
                        'level' => $r['level'],
                        'population' => $r['population'],
                        'area_km2' => $r['area_km2'],
                        'geometry' => $r['geometry'],
                    ]
                );
            }
            $this->command->info('Seeded '.count($regionsData).' DKI Jakarta regions.');
        }

        // 3. Facilities
        $facilitiesPath = base_path('../data/seeders/facilities_jakarta.json');
        if (File::exists($facilitiesPath)) {
            $facilitiesData = json_decode(File::get($facilitiesPath), true);
            foreach ($facilitiesData as $f) {
                $categoryId = ($f['category'] === 'Sekolah') ? $schoolCat->id : $marketCat->id;
                PublicFacility::updateOrCreate(
                    ['id' => $f['id']],
                    [
                        'category_id' => $categoryId,
                        'region_id' => $f['region_id'],
                        'name' => $f['name'],
                        'sub_category' => $f['sub_category'],
                        'npsn' => $f['npsn'] ?? null,
                        'address' => $f['address'],
                        'latitude' => $f['latitude'],
                        'longitude' => $f['longitude'],
                        'status' => $f['status'],
                        'is_state_owned' => $f['is_state_owned'],
                        'capacity' => $f['capacity'],
                        'has_wheelchair_ramp' => $f['has_wheelchair_ramp'],
                        'has_tactile_paving' => $f['has_tactile_paving'],
                        'has_disabled_toilet' => $f['has_disabled_toilet'],
                        'public_transport_nearby' => $f['public_transport_nearby'] ?? null,
                    ]
                );
            }
            $this->command->info('Seeded '.count($facilitiesData).' public facilities.');
        }

        // 4. Budget Projects
        $projectsPath = base_path('../data/seeders/budget_projects_jakarta.json');
        if (File::exists($projectsPath)) {
            $projectsData = json_decode(File::get($projectsPath), true);
            $chunks = array_chunk($projectsData, 200);
            $now = now();
            foreach ($chunks as $chunk) {
                $rows = [];
                foreach ($chunk as $p) {
                    $rows[] = [
                        'id' => $p['id'],
                        'facility_id' => null,
                        'region_id' => $p['region_id'],
                        'project_name' => $p['project_name'],
                        'fiscal_year' => $p['fiscal_year'],
                        'funding_source' => $p['funding_source'],
                        'budget_allocated' => $p['budget_allocated'],
                        'budget_realized' => $p['budget_realized'],
                        'status' => $p['status'],
                        'contractor_name' => $p['contractor_name'],
                        'start_date' => $p['start_date'],
                        'target_completion_date' => $p['target_completion_date'],
                        'progress_percentage' => $p['progress_percentage'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                BudgetProject::upsert(
                    $rows,
                    ['id'],
                    ['region_id', 'project_name', 'fiscal_year', 'funding_source', 'budget_allocated', 'budget_realized', 'status', 'contractor_name', 'start_date', 'target_completion_date', 'progress_percentage', 'updated_at']
                );
            }
            $this->command->info('Seeded '.count($projectsData).' budget projects.');
        }

        // 5. Calculate & Seed Equity Metrics automatically
        $allRegions = Region::all();
        foreach ($allRegions as $reg) {
            $facs = PublicFacility::where('region_id', $reg->id)->get();
            $count = $facs->count();
            $pop = $reg->population > 0 ? $reg->population : 1;
            $ratio = round(($count / $pop) * 10000, 2);

            // Calculate accessibility percentage
            $accessibleCount = $facs->filter(function ($item) {
                return $item->has_wheelchair_ramp || $item->has_tactile_paving || $item->has_disabled_toilet;
            })->count();

            $accessScore = $count > 0 ? round(($accessibleCount / $count) * 100, 2) : 0;
            $isUnderserved = ($ratio < 0.35); // Benchmark threshold

            EquityMetric::updateOrCreate(
                [
                    'region_id' => $reg->id,
                    'category_id' => null, // Aggregate all facilities
                ],
                [
                    'facility_count' => $count,
                    'ratio_per_10k_population' => $ratio,
                    'accessibility_score' => $accessScore,
                    'equity_index' => min(100, round(($ratio * 50) + ($accessScore * 0.5), 2)),
                    'is_underserved' => $isUnderserved,
                ]
            );
        }

        $this->command->info('Computed and seeded equity metrics for all '.$allRegions->count().' regions.');

        // 6. Sample Citizen Feedback
        $wargaUser = User::where('email', 'warga@terapublic.jakarta.go.id')->first();
        $sampleFacility = PublicFacility::first();
        if ($wargaUser && $sampleFacility) {
            CitizenFeedback::firstOrCreate(
                ['tracking_code' => 'TP-2026-0001'],
                [
                    'user_id' => $wargaUser->id,
                    'facility_id' => $sampleFacility->id,
                    'citizen_name' => $wargaUser->name,
                    'citizen_email' => $wargaUser->email,
                    'title' => 'Ramp kursi roda licin dan terhalang pedagang',
                    'description' => 'Akses jalur difabel di pintu masuk tertutup gerobak semi-permanen dan ubin pemandu (tactile paving) rusak.',
                    'category' => 'disability_access',
                    'status' => 'verified',
                    'admin_response' => 'Laporan telah diverifikasi oleh Satpol PP & Dinas Bina Marga. Penertiban dan perbaikan dijadwalkan minggu depan.',
                ]
            );
            $this->command->info('Seeded sample citizen feedback with tracking code TP-2026-0001.');
        }
    }
}
