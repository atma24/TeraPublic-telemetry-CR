<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PublicFacility extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'region_id',
        'name',
        'sub_category',
        'npsn',
        'address',
        'latitude',
        'longitude',
        'status',
        'is_state_owned',
        'capacity',
        'has_wheelchair_ramp',
        'has_tactile_paving',
        'has_disabled_toilet',
        'public_transport_nearby',
        'additional_specs',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_state_owned' => 'boolean',
        'has_wheelchair_ramp' => 'boolean',
        'has_tactile_paving' => 'boolean',
        'has_disabled_toilet' => 'boolean',
        'capacity' => 'integer',
        'additional_specs' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(FacilityCategory::class, 'category_id');
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function budgetProjects(): HasMany
    {
        return $this->hasMany(BudgetProject::class, 'facility_id');
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(CitizenFeedback::class, 'facility_id');
    }
}
