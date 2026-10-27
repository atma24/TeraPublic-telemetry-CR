<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilityCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon_name',
        'description',
    ];

    public function facilities(): HasMany
    {
        return $this->hasMany(PublicFacility::class, 'category_id');
    }
}
