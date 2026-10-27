<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'facility_id',
        'region_id',
        'project_name',
        'fiscal_year',
        'funding_source',
        'budget_allocated',
        'budget_realized',
        'status',
        'contractor_name',
        'start_date',
        'target_completion_date',
        'progress_percentage',
        'progress_reports',
    ];

    protected $casts = [
        'fiscal_year' => 'integer',
        'budget_allocated' => 'float',
        'budget_realized' => 'float',
        'progress_percentage' => 'float',
        'start_date' => 'date',
        'target_completion_date' => 'date',
        'progress_reports' => 'array',
    ];

    public function facility(): BelongsTo
    {
        return $this->belongsTo(PublicFacility::class, 'facility_id');
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}
