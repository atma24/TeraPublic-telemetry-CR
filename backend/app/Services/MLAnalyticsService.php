<?php

namespace App\Services;

use App\Models\BudgetProject;
use App\Models\EquityMetric;
use App\Models\PublicFacility;
use App\Models\Region;
use Illuminate\Support\Facades\File;

class MLAnalyticsService
{
    /**
     * Run K-Means Clustering ($k=3$) to classify 44 Jakarta districts
     * into infrastructure disparity and priority intervention tiers.
     *
     * @return array<string, mixed>
     */
    public function runDistrictClustering(): array
    {
        // 1. Check if Python ML pipeline artifacts exist
        $pythonOutputFile = base_path('../ml/outputs/dashboard_predictions.json');
        if (File::exists($pythonOutputFile)) {
            $data = json_decode(File::get($pythonOutputFile), true);
            if (! empty($data) && isset($data['district_clustering'])) {
                return $data['district_clustering'];
            }
        }

        // 2. Native Fallback Clustering
        $regions = Region::where('level', 'district')->get();

        if ($regions->isEmpty()) {
            return [
                'status' => 'empty',
                'message' => 'No district data available for clustering.',
                'clusters' => [],
            ];
        }

        // 1. Feature Extraction per District
        $dataset = [];
        foreach ($regions as $region) {
            $metric = EquityMetric::where('region_id', $region->id)->first();
            $facilities = PublicFacility::where('region_id', $region->id)->get();
            $facilityCount = $facilities->count();

            $disabilityCount = $facilities->filter(function ($f) {
                return $f->has_wheelchair_ramp || $f->has_tactile_paving || $f->has_disabled_toilet;
            })->count();

            $disabilityRate = $facilityCount > 0 ? ($disabilityCount / $facilityCount) * 100 : 0.0;
            $budgetTotal = BudgetProject::where('region_id', $region->id)->sum('budget_allocated') ?? 0;

            $dataset[] = [
                'region_id' => $region->id,
                'name' => $region->name,
                'city' => $region->city,
                'population' => (int) $region->population,
                'facility_count' => $facilityCount,
                'ratio_per_10k' => $metric ? (float) $metric->ratio_per_10k_population : 0.0,
                'disability_rate' => round($disabilityRate, 2),
                'budget_allocated' => (float) $budgetTotal,
            ];
        }

        // 2. Normalize Features (Min-Max Scaling to [0, 1])
        $features = ['population', 'facility_count', 'ratio_per_10k', 'disability_rate', 'budget_allocated'];
        $minMax = [];
        foreach ($features as $f) {
            $vals = array_column($dataset, $f);
            $minVal = ! empty($vals) ? min($vals) : 0;
            $maxVal = ! empty($vals) ? max($vals) : 1;
            $minMax[$f] = [
                'min' => $minVal,
                'max' => $maxVal == $minVal ? $minVal + 1 : $maxVal,
            ];
        }

        $vectors = [];
        foreach ($dataset as $idx => $row) {
            $vector = [];
            foreach ($features as $f) {
                $norm = ($row[$f] - $minMax[$f]['min']) / ($minMax[$f]['max'] - $minMax[$f]['min']);
                $vector[] = (float) $norm;
            }
            $vectors[$idx] = $vector;
        }

        // 3. K-Means Algorithm (k = 3) with deterministic seeds
        $k = 3;
        $numSamples = count($vectors);
        if ($numSamples < $k) {
            return ['status' => 'insufficient_data', 'clusters' => []];
        }

        // Initialize centroids using 15th, 50th, and 85th percentiles
        sort($vectors);
        $centroids = [
            $vectors[(int) ($numSamples * 0.15)],
            $vectors[(int) ($numSamples * 0.50)],
            $vectors[(int) ($numSamples * 0.85)],
        ];

        $assignments = array_fill(0, $numSamples, 0);
        $maxIterations = 25;

        for ($iter = 0; $iter < $maxIterations; $iter++) {
            $changed = false;

            // Step A: Assignment Step
            for ($i = 0; $i < $numSamples; $i++) {
                $bestDist = INF;
                $bestCluster = 0;

                for ($c = 0; $c < $k; $c++) {
                    $dist = $this->euclideanDistance($vectors[$i], $centroids[$c]);
                    if ($dist < $bestDist) {
                        $bestDist = $dist;
                        $bestCluster = $c;
                    }
                }

                if ($assignments[$i] !== $bestCluster) {
                    $assignments[$i] = $bestCluster;
                    $changed = true;
                }
            }

            if (! $changed) {
                break;
            }

            // Step B: Update Centroids
            for ($c = 0; $c < $k; $c++) {
                $clusterPoints = [];
                for ($i = 0; $i < $numSamples; $i++) {
                    if ($assignments[$i] === $c) {
                        $clusterPoints[] = $vectors[$i];
                    }
                }

                if (! empty($clusterPoints)) {
                    $dim = count($features);
                    $newCentroid = array_fill(0, $dim, 0.0);
                    foreach ($clusterPoints as $pt) {
                        for ($d = 0; $d < $dim; $d++) {
                            $newCentroid[$d] += $pt[$d];
                        }
                    }
                    $cCount = count($clusterPoints);
                    for ($d = 0; $d < $dim; $d++) {
                        $newCentroid[$d] /= $cCount;
                    }
                    $centroids[$c] = $newCentroid;
                }
            }
        }

        // 4. Cluster Classification & Interpretation
        $clusterGroups = [
            0 => ['label' => 'Prioritas Intervensi Kritis', 'urgency' => 'high', 'color' => '#EF4444', 'districts' => []],
            1 => ['label' => 'Kawasan Berkembang & Moderat', 'urgency' => 'medium', 'color' => '#F59E0B', 'districts' => []],
            2 => ['label' => 'Infrastruktur Stabil & Inklusif', 'urgency' => 'low', 'color' => '#10B981', 'districts' => []],
        ];

        // Rank clusters by average normalized ratio + disability score
        $clusterScores = [];
        for ($c = 0; $c < $k; $c++) {
            $members = [];
            for ($i = 0; $i < $numSamples; $i++) {
                if ($assignments[$i] === $c) {
                    $members[] = $dataset[$i];
                }
            }
            $avgRatio = ! empty($members) ? array_sum(array_column($members, 'ratio_per_10k')) / count($members) : 0;
            $avgDisability = ! empty($members) ? array_sum(array_column($members, 'disability_rate')) / count($members) : 0;
            $clusterScores[$c] = ($avgRatio * 0.6) + ($avgDisability * 0.4);
        }

        asort($clusterScores); // Lowest score = Highest priority/underserved
        $scoreKeys = array_keys($clusterScores);
        $clusterMapping = [
            $scoreKeys[0] => 0, // Critical
            $scoreKeys[1] => 1, // Moderate
            $scoreKeys[2] => 2, // Stable
        ];

        // Attach districts to sorted categories
        for ($i = 0; $i < $numSamples; $i++) {
            $mappedCluster = $clusterMapping[$assignments[$i]];
            $districtData = $dataset[$i];
            $districtData['cluster_id'] = $mappedCluster;
            $districtData['cluster_label'] = $clusterGroups[$mappedCluster]['label'];
            $districtData['urgency'] = $clusterGroups[$mappedCluster]['urgency'];
            $clusterGroups[$mappedCluster]['districts'][] = $districtData;
        }

        // 5. Anomaly Detection (High Population but Low Facility / Budget)
        $anomalies = [];
        $medianPopulation = $this->calculateMedian(array_column($dataset, 'population'));
        foreach ($dataset as $item) {
            if ($item['population'] > $medianPopulation && $item['ratio_per_10k'] < 0.25) {
                $anomalies[] = [
                    'region_id' => $item['region_id'],
                    'name' => $item['name'],
                    'city' => $item['city'],
                    'population' => $item['population'],
                    'ratio_per_10k' => $item['ratio_per_10k'],
                    'reason' => 'Populasi tinggi namun rasio fasilitas sangat rendah di bawah ambang batas (Defisit Akses).',
                ];
            }
        }

        return [
            'status' => 'success',
            'algorithm' => 'K-Means Multi-Dimensional Clustering',
            'model_metadata' => [
                'k' => $k,
                'iterations' => $iter,
                'features' => [
                    'population (BPS 2024)',
                    'facility_count',
                    'ratio_per_10k',
                    'disability_compliance_rate',
                    'apbd_budget_allocated',
                ],
                'total_districts_analyzed' => $numSamples,
            ],
            'summary' => [
                'critical_count' => count($clusterGroups[0]['districts']),
                'moderate_count' => count($clusterGroups[1]['districts']),
                'stable_count' => count($clusterGroups[2]['districts']),
                'anomalies_detected' => count($anomalies),
            ],
            'clusters' => array_values($clusterGroups),
            'anomalies' => $anomalies,
            'policy_recommendations' => [
                'critical' => 'Alokasikan paket revitalisasi fisik APBD prioritas tinggi untuk jalur disabilitas (ramps & tactile paving) dan penambahan unit fasilitas di kecamatan kluster kritis.',
                'moderate' => 'Percepat serapan anggaran pemeliharaan rutin dan pengawasan penyelesaian proyek fisik yang sedang berjalan.',
                'stable' => 'Pertahankan standar fasilitas inklusif dan integrasikan dengan jalur transportasi umum modern.',
            ],
        ];
    }

    private function euclideanDistance(array $a, array $b): float
    {
        $sum = 0.0;
        $count = count($a);
        for ($i = 0; $i < $count; $i++) {
            $diff = $a[$i] - $b[$i];
            $sum += $diff * $diff;
        }

        return sqrt($sum);
    }

    private function calculateMedian(array $numbers): float
    {
        if (empty($numbers)) {
            return 0.0;
        }
        sort($numbers);
        $count = count($numbers);
        $mid = (int) floor($count / 2);
        if ($count % 2 === 0) {
            return ($numbers[$mid - 1] + $numbers[$mid]) / 2.0;
        }

        return (float) $numbers[$mid];
    }
}
