<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquityMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'region_id',
        'category_id',
        'facility_count',
        'ratio_per_10k_population',
        'accessibility_score',
        'equity_index',
        'is_underserved',
    ];

    protected $casts = [
        'facility_count' => 'integer',
        'ratio_per_10k_population' => 'float',
        'accessibility_score' => 'float',
        'equity_index' => 'float',
        'is_underserved' => 'boolean',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(FacilityCategory::class, 'category_id');
    }
}
