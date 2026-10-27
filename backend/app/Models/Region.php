<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Region extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'city',
        'level',
        'parent_id',
        'population',
        'area_km2',
        'geometry',
    ];

    protected $casts = [
        'geometry' => 'array',
        'population' => 'integer',
        'area_km2' => 'decimal:2',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Region::class, 'parent_id');
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(PublicFacility::class);
    }

    public function budgetProjects(): HasMany
    {
        return $this->hasMany(BudgetProject::class);
    }

    public function equityMetrics(): HasMany
    {
        return $this->hasMany(EquityMetric::class);
    }
}
